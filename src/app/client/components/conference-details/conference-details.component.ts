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
//           // מיפוי הנתונים למבנה שה-HTML מצפה לו
//           this.conference = {
//             ...data,
//             name: data.Name || data.name || data.conference || 'כנס ללא שם',
//             description: data.Description || data.description || '',
//             tagline: data.Tagline || data.tagline || '',
//             date: data.Date || data.date || '',
//             location: data.Location || data.location || 'לא צוין',
//             contactEmail: data.ContactEmail || data.contactEmail || '',
//             programBlocks: data.ProgramBlocks || data.programBlocks || [],
//             // עיבוד מארגנים למבנה אובייקטים
//             organizersDetails: (data.Organizers || data.organizers || []).map((org: any) => {
//               if (typeof org === 'string') {
//                 const match = org.match(/^(.*) \((.*)\)$/);
//                 return match ? { name: match[1], affiliation: match[2] } : { name: org, affiliation: '' };
//               }
//               return org;
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
//     if (!date || date === '0001-01-01T00:00:00Z') return 'תאריך לא צוין';
//     return new Date(date).toLocaleDateString('he-IL', {
//       weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
//     });
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
            location: data.Location || data.location || 'לא צוין',
            contactEmail: data.ContactEmail || data.contactEmail || '',
            programBlocks: data.ProgramBlocks || data.programBlocks || [],
            allowsPoster: data.allowsPoster || false, // מוודא שהמידע על פוסטר קיים
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
    if (!date || date === '0001-01-01T00:00:00Z') return 'תאריך לא צוין';
    return new Date(date).toLocaleDateString('he-IL', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // פונקציה לניווט לטופס ההרשמה עם ה-ID של הכנס
  register(): void {
    this.router.navigate(['/register', this.conference._id || this.conference.id]);
  }
}