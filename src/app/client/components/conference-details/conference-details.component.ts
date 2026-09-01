import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-conference-details',
  templateUrl: './conference-details.component.html',
  styleUrls: ['./conference-details.component.css']
})
export class ConferenceDetailsComponent implements OnInit {
  conference: any = null;
  loading = true;
  notFound = false;

  // ⭐ חדש: שולט על תצוגת הפופאפ של הקובץ המצורף
  showAttachmentModal = false;

  // ⭐ חדש: גרסה "מאושרת" (sanitized) של קישור ה-PDF, לשימוש כ-src של ה-iframe.
  // Angular חוסם URL חיצוני ב-iframe src כברירת מחדל (הגנת XSS) - bypassSecurityTrustResourceUrl
  // אומר לו במפורש שהקישור הזה בטוח (הוא הרי מגיע מהשרת שלנו, לא מקלט/הזנת משתמש).
  attachmentSafeUrl: SafeResourceUrl | null = null;

  // שמות הכנסים שאסור לאפשר להם הרשמה בכלל —
  // כפתור ה-Register וה-CTA banner מוסתרים לגמרי בעמוד הזה עבורם
  private readonly EXCLUDED_CONFERENCE_NAMES: string[] = [
    'Law',
    'Network Dynamics in Socio-Technical Systems: From Resilient Control to Incentives and Information Design',
    'Cancer Biology Across Scales'
  ];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadSurveyDetails(id);
      } else {
        this.notFound = true;
        this.loading = false;
      }
    });
  }

  loadSurveyDetails(id: string): void {
    this.loading = true;
    this.apiService.getSurveyById(id).subscribe({
      next: (data) => {
        if (data) {
          // ⭐ חדש: מזהה הקובץ המצורף (אם קיים) - קובע אם נבנה קישור הורדה
          const attachmentFileId = data.AttachmentFileId || data.attachmentFileId || '';

          this.conference = {
            ...data,
            name: data.Name || data.name || data.conference || 'כנס ללא שם',
            description: data.Description || data.description || '',
            tagline: data.Tagline || data.tagline || '',
            date: data.Date || data.date || '',
            location: data.Location || data.location || 'Not specified',
            contactEmail: data.ContactEmail || data.contactEmail || '',
            contactName: data.ContactName || data.contactName || '',
            websiteUrl: data.Links?.website || data.links?.website || '',
            programBlocks: (data.ProgramBlocks || data.programBlocks || []).map((pb: any) => ({
              startTime: pb.StartTime || pb.startTime || '',
              endTime: pb.EndTime || pb.endTime || '',
              title: pb.Title || pb.title || ''
            })),
            allowsPoster: data.allowsPoster || false,
            whoShouldAttend: data.Audience || data.audience || '',
            submissionDeadline: data.AbstractDeadline || data.abstractDeadline || '',
            hasAbstractSubmission: !!(data.Abstract_submission || data.abstract_submission),
            registrationDeadline: data.RegistrationDeadline || data.registrationDeadline || '',
            organizerName: data.OrganizerName || data.organizerName || '',
            language: data.Language || data.language || 'English',
            programPdfUrl: data.ProgramPdfUrl || data.programPdfUrl || '',
            // ⭐ חדש: התיאור המילולי והקישור להורדה של קובץ ה-PDF המצורף לכנס.
            // attachmentUrl נשאר ריק אם אין קובץ מצורף - כך שהכפתור/פופאפ לא יוצג בכלל.
            attachmentDescription: data.AttachmentDescription || data.attachmentDescription || '',
            attachmentUrl: attachmentFileId ? this.apiService.getAttachmentUrl(id) : '',
            organizersDetails: (data.Organizers || data.organizers || []).map((org: any) => {
              if (typeof org === 'string') {
                const match = org.match(/^(.*) \((.*)\)$/);
                return match ? { name: match[1], affiliation: match[2] } : { name: org, affiliation: '' };
              }
              return { name: org.name || org.Name, affiliation: org.affiliation || '' };
            })
          };
          this.loading = false;
          this.notFound = false;
        } else {
          this.notFound = true;
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching conference:', err);
        this.notFound = true;
        this.loading = false;
      }
    });
  }

  // true אם הכנס הנוכחי נמצא ברשימת החסימה —
  // ה-HTML משתמש בזה כדי להסתיר את כפתורי ה-Register וה-CTA banner בעמוד
  get isRegistrationBlocked(): boolean {
    const name = (this.conference?.name || '').toLowerCase();
    return this.EXCLUDED_CONFERENCE_NAMES.some(
      excluded => excluded.toLowerCase() === name
    );
  }

  // ⭐ חדש: פתיחה/סגירה של פופאפ הקובץ המצורף
  openAttachmentModal(): void {
    if (this.conference?.attachmentUrl) {
      // מוסיפים #toolbar=0&navpanes=0 כדי להסתיר את סרגל הכלים המובנה של הדפדפן
      // (כפתורי הדפסה, כלי ציור/הערות וכו') - משאירים תצוגה נקייה לקריאה בלבד.
      const previewUrl = `${this.conference.attachmentUrl}#toolbar=0&navpanes=0`;
      this.attachmentSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(previewUrl);
    }
    this.showAttachmentModal = true;
  }

  closeAttachmentModal(): void {
    this.showAttachmentModal = false;
  }

  formatDate(date: string): string {
    if (!date || date === '0001-01-01T00:00:00Z') return 'Date TBD';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Date TBD';
    const formatted = d.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      timeZone: 'Asia/Jerusalem'
    });
    return `${formatted} (Israel Time)`;
  }

  // פונקציה לניווט לטופס ההרשמה עם ה-ID של הכנס
  register(): void {
    if (this.isRegistrationBlocked) {
      console.warn('Registration is blocked for this conference');
      return;
    }
    const id = this.conference?.Id || this.conference?._id || this.conference?.id;
    if (!id) {
      console.error('Cannot register: conference has no valid id', this.conference);
      return;
    }
    this.router.navigate(['/register', id]);
  }

  formatDeadline(dateStr: string): string {
    if (!dateStr) return '';
    let d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      const match = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
      if (match) {
        const [, day, month, year] = match;
        d = new Date(+year, +month - 1, +day);
      }
    }
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}