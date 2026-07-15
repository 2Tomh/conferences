import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent implements OnInit, AfterViewInit {

  @ViewChild('conferenceBarCanvas') conferenceBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('abstractBarCanvas') abstractBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('paymentPieCanvas') paymentPieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rolePieCanvas') rolePieCanvas!: ElementRef<HTMLCanvasElement>;

  stats: any = null;
  isLoading = true;
  error = '';

  private readonly CHART_COLORS = [
    '#C9A84C', '#0F1B4C', '#34c77a', '#f5a524', '#f2545b',
    '#6ea8fe', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
  ];

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
  }

  ngAfterViewInit(): void { }

  // עוזר לתצוגת "הגשות תקציר" בטבלת הפירוט לפי כנס
  getAbstractCountFor(conferenceName: string): number {
    const match = this.stats?.AbstractsByConference?.find((a: any) => a.ConferenceName === conferenceName);
    return match ? match.Count : 0;
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

    // ⭐ גרף עוגה: סטטוס תשלום
    new Chart(this.paymentPieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.stats.PaymentBreakdown.map((p: any) => p.Status),
        datasets: [{
          data: this.stats.PaymentBreakdown.map((p: any) => p.Count),
          backgroundColor: this.CHART_COLORS
        }]
      },
      options: { responsive: true }
    });

    // ⭐ גרף עוגה: התפלגות תפקידים
    new Chart(this.rolePieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.stats.RegistrationsByRole.map((r: any) => r.Role),
        datasets: [{
          data: this.stats.RegistrationsByRole.map((r: any) => r.Count),
          backgroundColor: this.CHART_COLORS
        }]
      },
      options: { responsive: true }
    });
  }
}