// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ApiService } from '../../../services/api.service';
// @Component({
//   selector: 'app-conference-details',
//   templateUrl: './conference-details.component.html',
//   styleUrls: ['./conference-details.component.css']
// })
// export class ConferenceDetailsComponent implements OnInit {
//   conference: any = null;
//   loading = true;
//   notFound = false;

//   // ⭐ שמות הכנסים שאסור לאפשר להם הרשמה בכלל —
//   // כפתור ה-Register מוסתר לגמרי בעמוד הזה עבורם
//   private readonly EXCLUDED_CONFERENCE_NAMES: string[] = [
//     'Law',
//     'Network Dynamics in Socio-Technical Systems: From Resilient Control to Incentives and Information Design'
//   ];

//   constructor(
//     private route: ActivatedRoute,
//     private apiService: ApiService,
//     public router: Router
//   ) { }

//   ngOnInit(): void {
//     this.route.params.subscribe(params => {
//       const id = params['id'];
//       if (id) {
//         this.loadSurveyDetails(id);
//       } else {
//         this.notFound = true;
//         this.loading = false;
//       }
//     });
//   }

//   loadSurveyDetails(id: string): void {
//     this.loading = true;
//     this.apiService.getSurveyById(id).subscribe({
//       next: (data) => {
//         if (data) {
//           this.conference = {
//             ...data,
//             name: data.Name || data.name || data.conference || 'כנס ללא שם',
//             description: data.Description || data.description || '',
//             tagline: data.Tagline || data.tagline || '',
//             date: data.Date || data.date || '',
//             location: data.Location || data.location || 'Not specified',
//             contactEmail: data.ContactEmail || data.contactEmail || '',
//             // השדה קיים במודל (ContactName) ובמסד הנתונים, אבל מעולם
//             // לא נשלף כאן - בדיוק אותה משפחת באג כמו whoShouldAttend/hasAbstractSubmission
//             contactName: data.ContactName || data.contactName || '',
//             // ⭐ חדש: קישור לאתר החיצוני של הכנס (אם הוזן בטופס הניהול תחת Links.website)
//             websiteUrl: data.Links?.website || data.links?.website || '',
//             programBlocks: (data.ProgramBlocks || data.programBlocks || []).map((pb: any) => ({
//               startTime: pb.StartTime || pb.startTime || '',
//               endTime: pb.EndTime || pb.endTime || '',
//               title: pb.Title || pb.title || ''
//             })),
//             allowsPoster: data.allowsPoster || false, // מוודא שהמידע על פוסטר קיים
//             // שני השדות האלה מוצגים ב-HTML אבל מעולם לא נשלפו בפועל מ-Mongo —
//             // זו הסיבה שנתונים שמנהל/ת כנס מזין/ה בטופס הניהול לא הופיעו כאן.
//             whoShouldAttend: data.Audience || data.audience || '',
//             submissionDeadline: data.AbstractDeadline || data.abstractDeadline || '',
//             // אותה משפחת באג בדיוק — נשמר בטופס הניהול, לא נקרא כאן עד עכשיו
//             hasAbstractSubmission: !!(data.Abstract_submission || data.abstract_submission),
//             registrationDeadline: data.RegistrationDeadline || data.registrationDeadline || '',
//             organizerName: data.OrganizerName || data.organizerName || '',
//             language: data.Language || data.language || 'English',
//             programPdfUrl: data.ProgramPdfUrl || data.programPdfUrl || '',
//             organizersDetails: (data.Organizers || data.organizers || []).map((org: any) => {
//               if (typeof org === 'string') {
//                 const match = org.match(/^(.*) \((.*)\)$/);
//                 return match ? { name: match[1], affiliation: match[2] } : { name: org, affiliation: '' };
//               }
//               return { name: org.name || org.Name, affiliation: org.affiliation || '' };
//             })
//           };
//           this.loading = false;
//           this.notFound = false;
//         } else {
//           this.notFound = true;
//           this.loading = false;
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching conference:', err);
//         this.notFound = true;
//         this.loading = false;
//       }
//     });
//   }

//   // ⭐ true אם הכנס הנוכחי נמצא ברשימת החסימה —
//   // ה-HTML משתמש בזה כדי להסתיר את שני כפתורי ה-Register בעמוד
//   get isRegistrationBlocked(): boolean {
//     const name = (this.conference?.name || '').toLowerCase();
//     return this.EXCLUDED_CONFERENCE_NAMES.some(
//       excluded => excluded.toLowerCase() === name
//     );
//   }

//   formatDate(date: string): string {
//     if (!date || date === '0001-01-01T00:00:00Z') return 'Date TBD';
//     return new Date(date).toLocaleDateString('en-US', {
//       weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
//     });
//   }

//   // פונקציה לניווט לטופס ההרשמה עם ה-ID של הכנס
//   register(): void {
//     // ⭐ הגנה כפולה: גם אם הכפתור מוסתר ב-HTML, לא לאפשר ניווט בפועל
//     if (this.isRegistrationBlocked) {
//       console.warn('Registration is blocked for this conference');
//       return;
//     }
//     const id = this.conference?.Id || this.conference?._id || this.conference?.id;
//     if (!id) {
//       console.error('Cannot register: conference has no valid id', this.conference);
//       return;
//     }
//     this.router.navigate(['/register', id]);
//   }

//   // פונקציה בטוחה לפרסור תאריכי דד-ליין: מנסה ISO קודם, ואם זה נתון ישן
//   // בפורמט "DD.M.YYYY" (מלפני שהחלפנו את השדה ל-type="date"), מפרסרת ידנית.
//   // לעולם לא קורסת - אם אין דרך לפרסר, מחזירה את המחרוזת הגולמית במקום לזרוק שגיאה.
//   formatDeadline(dateStr: string): string {
//     if (!dateStr) return '';
//     let d = new Date(dateStr);
//     if (isNaN(d.getTime())) {
//       const match = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
//       if (match) {
//         const [, day, month, year] = match;
//         d = new Date(+year, +month - 1, +day);
//       }
//     }
//     if (isNaN(d.getTime())) return dateStr;
//     return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-conference-details',
  templateUrl: './conference-details.component.html',
  styleUrls: ['./conference-details.component.css']
})
export class ConferenceDetailsComponent implements OnInit {
  conference: any = null;
  loading = true;
  notFound = false;

  // ⭐ עודכן: הוספת כנס נוסף לרשימת החסימה —
  // גם כפתור ה-Register וגם ה-CTA banner בתחתית מוסתרים לגמרי עבורו
  private readonly EXCLUDED_CONFERENCE_NAMES: string[] = [
    'Law',
    'Network Dynamics in Socio-Technical Systems: From Resilient Control to Incentives and Information Design',
    'Cancer Biology Across Scales'
  ];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
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
          this.conference = {
            ...data,
            name: data.Name || data.name || data.conference || 'כנס ללא שם',
            description: data.Description || data.description || '',
            tagline: data.Tagline || data.tagline || '',
            date: data.Date || data.date || '',
            location: data.Location || data.location || 'Not specified',
            contactEmail: data.ContactEmail || data.contactEmail || '',
            // השדה קיים במודל (ContactName) ובמסד הנתונים, אבל מעולם
            // לא נשלף כאן - בדיוק אותה משפחת באג כמו whoShouldAttend/hasAbstractSubmission
            contactName: data.ContactName || data.contactName || '',
            // קישור לאתר החיצוני של הכנס (אם הוזן בטופס הניהול תחת Links.website)
            websiteUrl: data.Links?.website || data.links?.website || '',
            programBlocks: (data.ProgramBlocks || data.programBlocks || []).map((pb: any) => ({
              startTime: pb.StartTime || pb.startTime || '',
              endTime: pb.EndTime || pb.endTime || '',
              title: pb.Title || pb.title || ''
            })),
            allowsPoster: data.allowsPoster || false, // מוודא שהמידע על פוסטר קיים
            // שני השדות האלה מוצגים ב-HTML אבל מעולם לא נשלפו בפועל מ-Mongo —
            // זו הסיבה שנתונים שמנהל/ת כנס מזין/ה בטופס הניהול לא הופיעו כאן.
            whoShouldAttend: data.Audience || data.audience || '',
            submissionDeadline: data.AbstractDeadline || data.abstractDeadline || '',
            // אותה משפחת באג בדיוק — נשמר בטופס הניהול, לא נקרא כאן עד עכשיו
            hasAbstractSubmission: !!(data.Abstract_submission || data.abstract_submission),
            registrationDeadline: data.RegistrationDeadline || data.registrationDeadline || '',
            organizerName: data.OrganizerName || data.organizerName || '',
            language: data.Language || data.language || 'English',
            programPdfUrl: data.ProgramPdfUrl || data.programPdfUrl || '',
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
    // הגנה כפולה: גם אם הכפתור מוסתר ב-HTML, לא לאפשר ניווט בפועל
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

  // פונקציה בטוחה לפרסור תאריכי דד-ליין: מנסה ISO קודם, ואם זה נתון ישן
  // בפורמט "DD.M.YYYY" (מלפני שהחלפנו את השדה ל-type="date"), מפרסרת ידנית.
  // לעולם לא קורסת - אם אין דרך לפרסר, מחזירה את המחרוזת הגולמית במקום לזרוק שגיאה.
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