import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-countdown-popup',
  templateUrl: './countdown-popup.component.html',
  styleUrls: ['./countdown-popup.component.css']
})
export class CountdownPopupComponent implements OnInit, OnDestroy {
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  isPast = false;

  private targetTimestamp = 0;
  private intervalId: any;

  ngOnInit(): void {
    // ⭐ יעד: 25.10.2026, 00:00 לפי שעון ישראל (מחושב דינמית - תקין גם
    // אם התאריך נמצא בדיוק בגבול שעון קיץ/חורף)
    this.targetTimestamp = this.getIsraelTimestamp(2026, 10, 25, 0, 0, 0);
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // ⭐ מחשב את ההיסט (offset) של שעון ישראל מ-UTC, בדקות, נכון לרגע נתון -
  // מתחשב אוטומטית בשעון קיץ/חורף, בלי צורך בספריית תאריכים חיצונית
  private getIsraelTimezoneOffsetMinutes(date: Date): number {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jerusalem',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const parts: Record<string, string> = {};
    dtf.formatToParts(date).forEach(p => {
      if (p.type !== 'literal') parts[p.type] = p.value;
    });

    // ⭐ הגנה: חלק ממנועי JS מחזירים "24" בחצות במקום "00" כש-hour12:false
    if (parts['hour'] === '24') {
      parts['hour'] = '00';
    }

    const asUtc = Date.UTC(
      Number(parts['year']),
      Number(parts['month']) - 1,
      Number(parts['day']),
      Number(parts['hour']),
      Number(parts['minute']),
      Number(parts['second'])
    );

    return (asUtc - date.getTime()) / 60000;
  }

  // ⭐ ממיר תאריך/שעה "מקומיים" בישראל ל-timestamp UTC מדויק, ללא תלות
  // בשעון או באזור הזמן של מכשיר המשתמש הגולש באתר
  private getIsraelTimestamp(
    year: number, month: number, day: number,
    hour: number, minute: number, second: number
  ): number {
    const naiveUtc = Date.UTC(year, month - 1, day, hour, minute, second);
    const offsetMinutes = this.getIsraelTimezoneOffsetMinutes(new Date(naiveUtc));
    return naiveUtc - offsetMinutes * 60000;
  }

  private updateCountdown(): void {
    const now = Date.now();
    let diff = this.targetTimestamp - now;

    if (diff <= 0) {
      this.isPast = true;
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      return;
    }

    this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= this.days * (1000 * 60 * 60 * 24);

    this.hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= this.hours * (1000 * 60 * 60);

    this.minutes = Math.floor(diff / (1000 * 60));
    diff -= this.minutes * (1000 * 60);

    this.seconds = Math.floor(diff / 1000);
  }
}