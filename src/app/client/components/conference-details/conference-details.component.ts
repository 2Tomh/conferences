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

//   constructor(
//     private route: ActivatedRoute,
//     private apiService: ApiService,
//     private router: Router
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
//             location: data.Location || data.location || 'TBD',
//             contactEmail: data.ContactEmail || data.contactEmail || '',
//             programBlocks: (data.ProgramBlocks || data.programBlocks || []).map((pb: any) => ({
//               startTime: pb.StartTime || pb.startTime || '',
//               endTime: pb.EndTime || pb.endTime || '',
//               title: pb.Title || pb.title || ''
//             })),
//             allowsPoster: data.allowsPoster || false, // מוודא שהמידע על פוסטר קיים
//             // חדש: שני השדות האלה מוצגים ב-HTML אבל מעולם לא נשלפו בפועל מ-Mongo —
//             // זו הסיבה שנתונים שמנהל/ת כנס מזין/ה בטופס הניהול לא הופיעו כאן.
//             whoShouldAttend: data.Audience || data.audience || '',
//             submissionDeadline: data.AbstractDeadline || data.abstractDeadline || '',
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

//   formatDate(date: string): string {
//     if (!date || date === '0001-01-01T00:00:00Z') return 'TBD';
//     return new Date(date).toLocaleDateString('he-IL', {
//       weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
//     });
//   }

//   // פונקציה לניווט לטופס ההרשמה עם ה-ID של הכנס
//   register(): void {
//     this.router.navigate(['/register', this.conference._id || this.conference.id]);
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

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
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
            programBlocks: (data.ProgramBlocks || data.programBlocks || []).map((pb: any) => ({
              startTime: pb.StartTime || pb.startTime || '',
              endTime: pb.EndTime || pb.endTime || '',
              title: pb.Title || pb.title || ''
            })),
            allowsPoster: data.allowsPoster || false, // מוודא שהמידע על פוסטר קיים
            // חדש: שני השדות האלה מוצגים ב-HTML אבל מעולם לא נשלפו בפועל מ-Mongo —
            // זו הסיבה שנתונים שמנהל/ת כנס מזין/ה בטופס הניהול לא הופיעו כאן.
            whoShouldAttend: data.Audience || data.audience || '',
            submissionDeadline: data.AbstractDeadline || data.abstractDeadline || '',
            // חדש: אותה משפחת באג בדיוק — נשמר בטופס הניהול, לא נקרא כאן עד עכשיו
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

  formatDate(date: string): string {
    if (!date || date === '0001-01-01T00:00:00Z') return 'Date TBD';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // פונקציה לניווט לטופס ההרשמה עם ה-ID של הכנס
  register(): void {
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