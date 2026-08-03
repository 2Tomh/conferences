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
  // ⭐ תוקן: הוסר totalMoneyRaised (סה"כ משולב) - הוא חיבר ₪ ו-$ בלי המרת
  // מטבע, מה שיצר מספר חסר משמעות (למשל 82,650₪ + 1,600$ = "84,250").
  // נשארים רק שני הסכומים הנפרדים, שכל אחד מהם כן נכון בפני עצמו.
  totalRaisedILS = 0;
  totalRaisedUSD = 0;
  tier150Count = 0;
  tier750Count = 0;
  tier50UsdCount = 0;
  tier250UsdCount = 0;
  private externalConferenceIds = new Set<string>();
  // ⭐ חדש: טקסט החיפוש בפירוט לפי כנס
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
  // ⭐ חדש: רשימת הכנסים בפועל שמוצגת בכרטיסים, מסוננת לפי searchText
  // (חיפוש לא רגיש לאותיות גדולות/קטנות, על שם הכנס בלבד)
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

    // אותו סכום, אבל מפוצל לפי מטבע - כל אחד מחושב בנפרד על בסיס
    // getCurrency, בלי לערבב שקלים ודולרים באותו סכום
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
}