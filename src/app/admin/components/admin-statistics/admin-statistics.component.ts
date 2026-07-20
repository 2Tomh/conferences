import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { Chart, registerables } from 'chart.js';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

Chart.register(...registerables);

interface Attendee {
  FullName?: string;
  Email?: string;
  Affiliation?: string;
  affiliation?: string;
  Role?: string;
  role?: string;
  ConferenceName?: string;
  HasAbstract?: boolean;
  hasAbstract?: boolean;
  PaymentStatus?: string;
  DisplayStatus?: string;
  Amount?: number;
  amount?: number;
  RegisteredAt?: string;
  Address?: string;
}

interface CountItem { label: string; count: number; }

const UNKNOWN_COUNTRY = 'לא זוהתה מדינה';

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent implements OnInit, AfterViewInit {

  @ViewChild('conferenceBarCanvas') conferenceBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('abstractBarCanvas') abstractBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('paymentPieCanvas') paymentPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('paymentTierPieCanvas') paymentTierPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rolePieCanvas') rolePieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('countryBarCanvas') countryBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('universityBarCanvas') universityBarCanvas!: ElementRef<HTMLCanvasElement>;

  attendees: Attendee[] = [];
  isLoading = true;
  isLoadingCountries = false;
  error = '';

  totalRegistrations = 0;
  totalPaid = 0;
  totalPending = 0;
  totalFailed = 0;
  totalWithAbstract = 0;
  totalMoneyRaised = 0;

  private readonly CHART_COLORS = [
    '#C9A84C', '#0F1B4C', '#34c77a', '#f5a524', '#f2545b',
    '#6ea8fe', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
  ];

  // ⭐ any[] בכוונה: Chart.js מגדיר generics שונים לכל סוג גרף (bar/pie),
  // וכאן אנחנו רק שומרים רפרנס כדי לקרוא destroy() בהמשך - לא צריך type-safety על הסוג הספציפי
  private charts: any[] = [];
  // ⭐ קאש בזיכרון בלבד (נבנה בזמן ריצה מתוצאות ה-API, לא hardcoded)
  private affiliationToCountryCache = new Map<string, string>();

  constructor(private apiService: ApiService, private http: HttpClient) { }

  ngOnInit(): void {
    // ⭐ שולפים את כל הנרשמים (כמו בעמוד "נרשמים"). ודא ש-getAllAttendees מחזירה
    // את כל הרשומות ולא עמוד אחד מתוך פאג'ינציה.
    this.apiService.getAllAttendees().subscribe({
      next: (data: Attendee[]) => {
        this.attendees = data || [];
        this.computeSummary();
        this.isLoading = false;
        this.resolveCountriesAndRender();
      },
      error: (err: any) => {
        console.error('שגיאה בטעינת נתוני נרשמים לסטטיסטיקות:', err);
        this.error = 'לא ניתן לטעון את הנתונים כרגע';
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void { }

  // --- Normalizers: מטפלים בחוסר עקביות ב-casing מה-backend ---
  private getAffiliation(a: Attendee): string {
    return a.Affiliation || a.affiliation || 'לא ידוע';
  }
  private getRole(a: Attendee): string {
    return a.Role || a.role || 'לא ידוע';
  }
  private getAmount(a: Attendee): number {
    // ⭐ לא משתמשים ב-|| כאן כדי לא "לבלוע" בטעות סכום 0 אמיתי
    const amount = a.Amount !== undefined && a.Amount !== null ? a.Amount : a.amount;
    return typeof amount === 'number' ? amount : 0;
  }
  private hasAbstract(a: Attendee): boolean {
    return !!(a.HasAbstract || a.hasAbstract);
  }

  private computeSummary(): void {
    this.totalRegistrations = this.attendees.length;
    this.totalPaid = this.attendees.filter(a => a.PaymentStatus === 'success').length;
    this.totalPending = this.attendees.filter(a => a.PaymentStatus === 'pending').length;
    this.totalFailed = this.attendees.filter(a => a.PaymentStatus === 'failed').length;
    this.totalWithAbstract = this.attendees.filter(a => this.hasAbstract(a)).length;
    this.totalMoneyRaised = this.attendees
      .filter(a => a.PaymentStatus === 'success')
      .reduce((sum, a) => sum + this.getAmount(a), 0);
  }

  private groupCount(items: Attendee[], keyFn: (a: Attendee) => string): CountItem[] {
    const map = new Map<string, number>();
    for (const item of items) {
      const key = keyFn(item) || 'לא ידוע';
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }

  private getPaymentTier(a: Attendee): string {
    const amount = this.getAmount(a);
    if (amount >= 100 && amount <= 200) return '50$ / 150₪';
    if (amount >= 700 && amount <= 800) return '250$ / 750₪';
    if (amount === 0) return 'ללא תשלום / טרם שולם';
    return 'אחר';
  }

  private topNWithOthers(items: CountItem[], n: number): CountItem[] {
    if (items.length <= n) return items;
    const top = items.slice(0, n);
    const othersCount = items.slice(n).reduce((sum, i) => sum + i.count, 0);
    return [...top, { label: 'אחרים', count: othersCount }];
  }

  // ⭐ שליפה דינמית של מדינה לפי שם מוסד, דרך Hipolabs Universities API. אין כאן שום רשימה קבועה -
  // אם השם לא נמצא, מוצג "לא זוהתה מדינה" ופשוט לא ניתן לסווג את הנרשם ההוא.
  private lookupCountry(affiliation: string): Observable<string> {
    const cached = this.affiliationToCountryCache.get(affiliation);
    if (cached) return of(cached);

    if (!affiliation || affiliation === 'לא ידוע') {
      return of(UNKNOWN_COUNTRY);
    }

    const url = `https://universities.hipolabs.com/search?name=${encodeURIComponent(affiliation)}`;
    return this.http.get<any[]>(url).pipe(
      map(results => (results && results.length > 0 && results[0].country) ? results[0].country : UNKNOWN_COUNTRY),
      catchError(() => of(UNKNOWN_COUNTRY))
    );
  }

  private resolveCountriesAndRender(): void {
    const uniqueAffiliations = Array.from(new Set(this.attendees.map(a => this.getAffiliation(a))));

    if (uniqueAffiliations.length === 0) {
      setTimeout(() => this.renderCharts(), 0);
      return;
    }

    this.isLoadingCountries = true;
    const lookups = uniqueAffiliations.map(name =>
      this.lookupCountry(name).pipe(map(country => ({ name, country })))
    );

    forkJoin(lookups).subscribe(results => {
      results.forEach(r => this.affiliationToCountryCache.set(r.name, r.country));
      this.isLoadingCountries = false;
      setTimeout(() => this.renderCharts(), 0);
    });
  }

  private renderCharts(): void {
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    const registrationsByConference = this.groupCount(this.attendees, a => a.ConferenceName || 'לא ידוע');
    const abstractsByConference = this.groupCount(this.attendees.filter(a => this.hasAbstract(a)), a => a.ConferenceName || 'לא ידוע');
    const paymentStatus = this.groupCount(this.attendees, a => a.DisplayStatus || a.PaymentStatus || 'לא ידוע');
    const paymentTiers = this.groupCount(this.attendees, a => this.getPaymentTier(a));
    const roles = this.groupCount(this.attendees, a => this.getRole(a));
    const countries = this.groupCount(this.attendees, a => this.affiliationToCountryCache.get(this.getAffiliation(a)) || UNKNOWN_COUNTRY);
    const universities = this.topNWithOthers(
      this.groupCount(this.attendees, a => this.getAffiliation(a)), 12
    );

    this.charts.push(new Chart(this.conferenceBarCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: registrationsByConference.map(c => c.label),
        datasets: [{ label: 'נרשמים', data: registrationsByConference.map(c => c.count), backgroundColor: '#C9A84C' }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
    }));

    this.charts.push(new Chart(this.abstractBarCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: abstractsByConference.map(c => c.label),
        datasets: [{ label: 'הגשות תקציר', data: abstractsByConference.map(c => c.count), backgroundColor: '#0F1B4C' }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
    }));

    this.charts.push(new Chart(this.paymentPieCanvas.nativeElement, {
      type: 'pie',
      data: { labels: paymentStatus.map(p => p.label), datasets: [{ data: paymentStatus.map(p => p.count), backgroundColor: this.CHART_COLORS }] },
      options: { responsive: true }
    }));

    this.charts.push(new Chart(this.paymentTierPieCanvas.nativeElement, {
      type: 'pie',
      data: { labels: paymentTiers.map(p => p.label), datasets: [{ data: paymentTiers.map(p => p.count), backgroundColor: this.CHART_COLORS }] },
      options: { responsive: true }
    }));

    this.charts.push(new Chart(this.rolePieCanvas.nativeElement, {
      type: 'pie',
      data: { labels: roles.map(r => r.label), datasets: [{ data: roles.map(r => r.count), backgroundColor: this.CHART_COLORS }] },
      options: { responsive: true }
    }));

    this.charts.push(new Chart(this.countryBarCanvas.nativeElement, {
      type: 'bar',
      data: { labels: countries.map(c => c.label), datasets: [{ label: 'נרשמים', data: countries.map(c => c.count), backgroundColor: '#34c77a' }] },
      options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0 } } } }
    }));

    this.charts.push(new Chart(this.universityBarCanvas.nativeElement, {
      type: 'bar',
      data: { labels: universities.map(u => u.label), datasets: [{ label: 'נרשמים', data: universities.map(u => u.count), backgroundColor: '#6ea8fe' }] },
      options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0 } } } }
    }));
  }
}