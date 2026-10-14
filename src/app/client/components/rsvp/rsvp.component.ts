import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

// ⭐ עמוד אישור הגעה לאירוע הערב.
// נפתח מהקישור האישי במייל ההזמנה: https://www.mind-il.org/rsvp?id=...&token=...
// המוזמן לא צריך להקליד כלום - רק "מגיע / לא מגיע".
@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit {

  id = '';
  token = '';
  // ⭐ חדש: התשובה מהכפתור שנלחץ במייל ('yes' / 'no')
  answerFromEmail: string | null = null;

  isLoading = true;
  isSaving = false;
  errorMessage = '';

  fullName = '';
  status: string | null = null;      // invited | attending | declined | expired
  deadlineText = '';
  canRespond = false;

  // כשהמוזמן בחר "לא מגיע" - מבקשים אישור, כי אי אפשר לחזור מזה
  confirmingDecline = false;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.id = params.get('id') || '';
    this.token = params.get('token') || '';
    this.answerFromEmail = params.get('answer');

    if (!this.id || !this.token) {
      this.isLoading = false;
      this.errorMessage = 'This link is incomplete. Please use the personal link from your invitation email.';
      return;
    }
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.api.getEveningRsvp(this.id, this.token).subscribe({
      next: (res) => {
        this.fullName = res?.FullName || '';
        this.status = res?.Status || null;
        this.deadlineText = res?.DeadlineText || '';
        this.canRespond = !!res?.CanRespond;
        this.isLoading = false;
        this.applyAnswerFromEmail();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Something went wrong. Please try again later.';
      }
    });
  }

  respond(attending: boolean): void {
    if (this.isSaving) return;
    if (!attending && !this.confirmingDecline) {
      this.confirmingDecline = true;
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.api.submitEveningRsvp({ id: this.id, token: this.token, attending }).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.confirmingDecline = false;
        this.status = res?.Status || (attending ? 'attending' : 'declined');
        this.canRespond = false; // עונים פעם אחת בלבד
      },
      error: (err) => {
        this.isSaving = false;
        this.confirmingDecline = false;
        this.errorMessage = err?.error?.message || 'Could not save your response. Please try again.';
        this.load();
      }
    });
  }

  // ⭐ חדש: מגיעים מכפתור במייל
  // "I will attend" - נשמר מיד.
  // "I can't attend" - מבקשים אישור נוסף, כי סירוב משחרר את המקום ואי אפשר לחזור ממנו.
  private applyAnswerFromEmail(): void {
    const answer = this.answerFromEmail;
    this.answerFromEmail = null; // רק פעם אחת
    if (!answer || !this.canRespond) return;

    if (answer === 'yes' && this.status === 'invited') {
      this.respond(true);
    } else if (answer === 'no' && this.status === 'invited') {
      this.confirmingDecline = true;
    }
  }

  cancelDecline(): void {
    this.confirmingDecline = false;
  }
}