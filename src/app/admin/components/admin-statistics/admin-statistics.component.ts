import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

interface Attendee {
  Amount?: number;
  amount?: number;
  PaymentStatus?: string;
  ConferenceId?: string;
  Currency?: string;
  currency?: string;
}

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent implements OnInit, AfterViewInit {
  stats: any = null;
  isLoading = true;
  error = '';

  totalRaisedILS = 0;
  totalRaisedUSD = 0;
  tier150Count = 0;
  tier750Count = 0;
  tier50UsdCount = 0;
  tier250UsdCount = 0;

  private externalConferenceIds = new Set<string>();

  searchText = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getStatistics().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('שגיאה בטעינת סטטיסטיקות:', err);
        this.error = 'לא ניתן לטעון את הנתונים כרגע';
        this.isLoading = false;
      }
    });

    this.apiService.getAllConferences().subscribe({
      next: (conferences: any[]) => {
        (conferences || []).forEach((c: any) => {
          const isExternal = c.IsExternalOnly === true || c.isExternalOnly === true;
          const id = c.Id || c._id || c.id;
          if (isExternal && id) {
            this.externalConferenceIds.add(id);
          }
        });
        this.apiService.getAllAttendees().subscribe({
          next: (attendees: Attendee[]) => {
            this.computeMoneyStats(attendees || []);
          },
          error: (err) => {
            console.error('שגיאה בטעינת נתוני תשלום לחישוב סכומים:', err);
          }
        });
      },
      error: (err) => {
        console.error('שגיאה בטעינת רשימת הכנסים:', err);
        this.apiService.getAllAttendees().subscribe({
          next: (attendees: Attendee[]) => {
            this.computeMoneyStats(attendees || []);
          },
          error: (err2) => console.error('שגיאה בטעינת נתוני תשלום לחישוב סכומים:', err2)
        });
      }
    });
  }

  ngAfterViewInit(): void { }

  getAbstractCountFor(conferenceName: string): number {
    const match = this.stats?.AbstractsByConference?.find((a: any) => a.ConferenceName === conferenceName);
    return match ? match.Count : 0;
  }

  get filteredConferences(): any[] {
    const list = this.stats?.RegistrationsByConference || [];
    const term = this.searchText.trim().toLowerCase();
    if (!term) return list;
    return list.filter((conf: any) => (conf.ConferenceName || '').toLowerCase().includes(term));
  }

  private getAmount(a: Attendee): number {
    const amount = a.Amount !== undefined && a.Amount !== null ? a.Amount : a.amount;
    return typeof amount === 'number' ? amount : 0;
  }

  private getCurrency(a: Attendee): string {
    const currency = a.Currency || a.currency;
    return currency === 'USD' ? 'USD' : 'ILS';
  }

  private computeMoneyStats(attendees: Attendee[]): void {
    const relevantAttendees = attendees.filter(a =>
      !a.ConferenceId || !this.externalConferenceIds.has(a.ConferenceId)
    );
    const paidAttendees = relevantAttendees.filter(a => a.PaymentStatus === 'success');

    this.totalRaisedILS = paidAttendees
      .filter(a => this.getCurrency(a) === 'ILS')
      .reduce((sum, a) => sum + this.getAmount(a), 0);
    this.totalRaisedUSD = paidAttendees
      .filter(a => this.getCurrency(a) === 'USD')
      .reduce((sum, a) => sum + this.getAmount(a), 0);

    const totalPaidCount = paidAttendees.length;
    if (totalPaidCount === 0) {
      this.tier150Count = 0;
      this.tier750Count = 0;
      this.tier50UsdCount = 0;
      this.tier250UsdCount = 0;
      return;
    }
    this.tier150Count = paidAttendees.filter(a => {
      const amount = this.getAmount(a);
      return this.getCurrency(a) === 'ILS' && amount >= 100 && amount <= 200;
    }).length;
    this.tier750Count = paidAttendees.filter(a => {
      const amount = this.getAmount(a);
      return this.getCurrency(a) === 'ILS' && amount >= 700 && amount <= 800;
    }).length;
    this.tier50UsdCount = paidAttendees.filter(a => {
      const amount = this.getAmount(a);
      return this.getCurrency(a) === 'USD' && amount >= 30 && amount <= 70;
    }).length;
    this.tier250UsdCount = paidAttendees.filter(a => {
      const amount = this.getAmount(a);
      return this.getCurrency(a) === 'USD' && amount >= 200 && amount <= 300;
    }).length;
  }

  // ⭐ חדש: ייצוא כל הסטטיסטיקה ל-CSV - כולל סיכום כללי ופירוט מלא לפי כנס
  // (כל הרשימה מ-stats.RegistrationsByConference, לא רק מה שמסונן כרגע בחיפוש)
// ⭐ שונה: מייצא רק פירוט לפי כנס - שם, מספר נרשמים, מספר הגשות תקציר
// (הוסרו הסיכום הכספי והפילוח לפי תעריף)
exportStatsToCSV(): void {
  if (!this.stats) {
    alert('אין נתונים לייצוא');
    return;
  }

  const lines: string[] = [];

  lines.push('שם הכנס,נרשמים,הגשות תקציר');
  const allConferences = this.stats.RegistrationsByConference || [];
  allConferences.forEach((conf: any) => {
    const name = String(conf.ConferenceName || '').replace(/"/g, '""');
    const abstractCount = this.getAbstractCountFor(conf.ConferenceName);
    lines.push(`"${name}",${conf.Count},${abstractCount}`);
  });

  const csvContent = '\uFEFF' + lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'conference-statistics.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}