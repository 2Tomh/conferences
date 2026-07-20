import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Attendee {
  Amount?: number;
  amount?: number;
  PaymentStatus?: string;
}

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent implements OnInit, AfterViewInit {

  @ViewChild('conferenceBarCanvas') conferenceBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('abstractBarCanvas') abstractBarCanvas!: ElementRef<HTMLCanvasElement>;

  stats: any = null;
  isLoading = true;
  error = '';

  // ⭐ חדש: מחושבים מתוך רשימת הנרשמים הגולמית (getAllAttendees), כי getStatistics()
  // לא כולל את שדה הסכום (Amount) הבודד לכל רשומה.
  totalMoneyRaised = 0;
  tier150Percentage = 0;
  tier750Percentage = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getStatistics().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        // הגרפים מצוירים רק אחרי שהנתונים הגיעו וה-DOM התעדכן
        setTimeout(() => this.renderCharts(), 0);
      },
      error: (err) => {
        console.error('שגיאה בטעינת סטטיסטיקות:', err);
        this.error = 'לא ניתן לטעון את הנתונים כרגע';
        this.isLoading = false;
      }
    });

    // ⭐ קריאה נפרדת לרשימת הנרשמים הגולמית, רק כדי לחשב סכום כסף ואחוזי תעריף.
    // לא משנה את מקור הנתונים לגרפים/טבלה הקיימים - הם ממשיכים להגיע מ-getStatistics().
    this.apiService.getAllAttendees().subscribe({
      next: (attendees: Attendee[]) => {
        this.computeMoneyStats(attendees || []);
      },
      error: (err) => {
        console.error('שגיאה בטעינת נתוני תשלום לחישוב סכומים:', err);
      }
    });
  }

  ngAfterViewInit(): void { }

  // עוזר לתצוגת "הגשות תקציר" בטבלת הפירוט לפי כנס
  getAbstractCountFor(conferenceName: string): number {
    const match = this.stats?.AbstractsByConference?.find((a: any) => a.ConferenceName === conferenceName);
    return match ? match.Count : 0;
  }

  private getAmount(a: Attendee): number {
    const amount = a.Amount !== undefined && a.Amount !== null ? a.Amount : a.amount;
    return typeof amount === 'number' ? amount : 0;
  }

  private computeMoneyStats(attendees: Attendee[]): void {
    const paidAttendees = attendees.filter(a => a.PaymentStatus === 'success');

    this.totalMoneyRaised = paidAttendees.reduce((sum, a) => sum + this.getAmount(a), 0);

    const totalPaidCount = paidAttendees.length;
    if (totalPaidCount === 0) {
      this.tier150Percentage = 0;
      this.tier750Percentage = 0;
      return;
    }

    // ⭐ אותם טווחים כמו בעמוד הקודם: 100-200 = תעריף "150", 700-800 = תעריף "750"
    const tier150Count = paidAttendees.filter(a => {
      const amount = this.getAmount(a);
      return amount >= 100 && amount <= 200;
    }).length;

    const tier750Count = paidAttendees.filter(a => {
      const amount = this.getAmount(a);
      return amount >= 700 && amount <= 800;
    }).length;

    this.tier150Percentage = Math.round((tier150Count / totalPaidCount) * 100);
    this.tier750Percentage = Math.round((tier750Count / totalPaidCount) * 100);
  }

  private renderCharts(): void {
    if (!this.stats) return;

    // ⭐ גרף עמודות: נרשמים לפי כנס
    new Chart(this.conferenceBarCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.stats.RegistrationsByConference.map((c: any) => c.ConferenceName),
        datasets: [{
          label: 'נרשמים',
          data: this.stats.RegistrationsByConference.map((c: any) => c.Count),
          backgroundColor: '#C9A84C'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });

    // ⭐ גרף עמודות: הגשות תקציר לפי כנס
    new Chart(this.abstractBarCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.stats.AbstractsByConference.map((c: any) => c.ConferenceName),
        datasets: [{
          label: 'הגשות תקציר',
          data: this.stats.AbstractsByConference.map((c: any) => c.Count),
          backgroundColor: '#0F1B4C'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }
}