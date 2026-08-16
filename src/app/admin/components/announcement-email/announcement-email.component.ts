import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-announcement-email',
  templateUrl: './announcement-email.component.html',
  styleUrls: ['./announcement-email.component.css']
})
export class AnnouncementEmailComponent implements OnInit, AfterViewInit {
  isAdmin = false;

  subject = '';
  body = '';

  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  testEmail = '';
  isSendingTest = false;
  testResultMessage = '';
  testErrorMessage = '';

  isSending = false;
  isConfirming = false;
  resultMessage = '';
  resultDetails: { totalRecipients: number; sent: number; failed: number; failedEmails: string[] } | null = null;
  errorMessage = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.isAdmin = this.checkIsAdmin();
  }

  ngAfterViewInit(): void {
    if (this.isAdmin) {
      this.loadDefaultTemplate();
    }
  }

  private checkIsAdmin(): boolean {
    const directRole = localStorage.getItem('role');
    if (directRole) {
      return directRole === 'Admin';
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.role) return user.role === 'Admin';
        if (user?.Role) return user.Role === 'Admin';
      } catch { }
    }

    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('jwt');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role =
          payload['role'] ||
          payload['Role'] ||
          payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        return role === 'Admin';
      } catch { }
    }

    return false;
  }

  format(command: string, value?: string): void {
    document.execCommand(command, false, value);
    this.editorRef.nativeElement.focus();
    this.syncBody();
  }

  formatBlock(tag: string): void {
    document.execCommand('formatBlock', false, tag);
    this.editorRef.nativeElement.focus();
    this.syncBody();
  }

  insertLink(): void {
    const url = prompt('Enter the URL:', 'https://');
    if (url) {
      document.execCommand('createLink', false, url);
    }
    this.editorRef.nativeElement.focus();
    this.syncBody();
  }

  loadDefaultTemplate(): void {
    this.subject = '{{participant_first_name}}, help us spread the word about Mind-IL!';

    const mindilUrl = 'https://www.mind-il.org';
    const logoUrl = 'https://www.mind-il.org/assets/logo.jpeg';

    const template = `
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F0;padding:40px 20px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(15,27,76,0.10);font-family:Arial,sans-serif;">
            <tr><td style="height:4px;background:linear-gradient(90deg,#C9A84C,#E8C97A,#C9A84C);"></td></tr>
            <tr><td align="center" style="background:#0F1B4C;padding:36px 40px 32px;">
              <a href="${mindilUrl}"><img src="${logoUrl}" alt="Mind-IL" width="200" style="display:block;margin:0 auto 20px;border-radius:12px;"></a>
              <h1 style="color:#C9A84C;font-size:22px;margin:0 0 8px;font-weight:700;">Help Us Spread the Word!</h1>
              <p style="color:rgba(255,255,255,0.6);margin:0;font-size:14px;">Mind-IL – Israel's Science and Academia Week</p>
            </td></tr>
            <tr><td style="padding:40px;">
              <p style="color:#2a2a4a;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Dear <strong>{{participant_name}}</strong>,
              </p>
              <p style="color:#4a4a6a;font-size:14px;line-height:1.75;margin:0 0 24px;">
                We are thrilled to share that Mind-IL has grown to include more than 40 exciting conferences and academic gatherings, with over 1,000 participants already registered!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F0;border-radius:10px;padding:24px;margin-bottom:28px;">
                <tr><td style="font-size:13px;color:#4a4a6a;line-height:1.7;">
                  Please help us expand the Mind-IL community by sharing the registration link with colleagues, professional networks, communities, friends, and anyone else who may be interested:
                  <br><br>
                  <a href="${mindilUrl}/" style="color:#C9A84C;font-weight:700;">${mindilUrl}/</a>
                </td></tr>
              </table>
              <p style="font-size:13px;color:#4a4a6a;line-height:1.75;margin:0 0 16px;">
                Every share helps us reach new participants from Israel and around the world and build an extraordinary week of science, scholarship, collaboration, and connection.
              </p>
              <p style="font-size:13px;color:#4a4a6a;line-height:1.75;margin:0 0 32px;">
                Thank you for being part of Mind-IL. We look forward to welcoming you this October!
              </p>
              <p style="font-size:13px;color:#4a4a6a;margin:0;">
                Warm regards,<br>
                <strong style="color:#0F1B4C;">The Mind-IL Organizing Committee</strong>
              </p>
            </td></tr>
            <tr><td style="background:#0F1B4C;padding:28px 40px;text-align:center;">
              <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0 0 6px;">Mind-IL – Israel's Science and Academia Week</p>
              <a href="${mindilUrl}" style="color:#C9A84C;font-size:12px;text-decoration:none;">${mindilUrl}</a>
            </td></tr>
            <tr><td style="height:3px;background:linear-gradient(90deg,#C9A84C,#E8C97A,#C9A84C);"></td></tr>
          </table>
        </td></tr>
      </table>
    `;

    this.editorRef.nativeElement.innerHTML = template;
    this.syncBody();
  }

  resetToDefault(): void {
    const hasContent = this.body.trim() && this.body.trim() !== '<br>';
    const confirmed = hasContent ? confirm('This will replace the current content with the default template. Continue?') : true;
    if (!confirmed) return;
    this.loadDefaultTemplate();
  }

  syncBody(): void {
    this.body = this.editorRef.nativeElement.innerHTML;
  }

  get isFormValid(): boolean {
    return this.subject.trim().length > 0 && this.body.trim().length > 0 && this.body.trim() !== '<br>';
  }

  get isTestFormValid(): boolean {
    return this.isFormValid && this.testEmail.trim().length > 0;
  }

  // ⭐⭐ עודכן: מציג בהודעת התוצאה אם נמצא attendee תואם ב-DB, ומה השם
  // ששימש בפועל בפרסונליזציה
  sendTest(): void {
    if (!this.isTestFormValid || this.isSendingTest) return;

    this.isSendingTest = true;
    this.testResultMessage = '';
    this.testErrorMessage = '';

    this.apiService.sendTestEmail(this.testEmail.trim(), this.subject.trim(), this.body).subscribe({
      next: (res: any) => {
        this.isSendingTest = false;
        const foundNote = res.foundInDatabase
          ? ` (used real name: "${res.usedName}")`
          : ` (no matching attendee found — used sample name "${res.usedName}")`;
        this.testResultMessage = `Test email sent to ${this.testEmail.trim()}${foundNote}`;
      },
      error: (err) => {
        this.isSendingTest = false;
        console.error('Error sending test email:', err);
        this.testErrorMessage = 'Failed to send test email';
      }
    });
  }

  askToSend(): void {
    if (!this.isFormValid) return;
    this.isConfirming = true;
  }

  cancelSend(): void {
    this.isConfirming = false;
  }

  confirmSend(): void {
    this.isConfirming = false;
    this.isSending = true;
    this.resultMessage = '';
    this.resultDetails = null;
    this.errorMessage = '';

    this.apiService.sendBulkEmail(this.subject.trim(), this.body).subscribe({
      next: (res: any) => {
        this.isSending = false;
        this.resultMessage = 'Email sent successfully';
        this.resultDetails = {
          totalRecipients: res.totalRecipients,
          sent: res.sent,
          failed: res.failed,
          failedEmails: res.failedEmails || []
        };
      },
      error: (err) => {
        this.isSending = false;
        console.error('Error sending bulk email:', err);
        this.errorMessage = 'Failed to send bulk email';
      }
    });
  }
}