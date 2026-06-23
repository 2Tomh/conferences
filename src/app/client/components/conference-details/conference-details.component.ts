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
//   ) {}

//   ngOnInit(): void {
//     // מאזינים לשינויים ב-ID ב-URL
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
//     // משתמשים ב-getSurveyById כי זה ה-Endpoint הנכון ב-ApiService שלך
//     this.apiService.getSurveyById(id).subscribe({
//       next: (data) => {
//         // בודקים אם הנתונים הגיעו
//         if (data) {
//           this.conference = data;
//           this.loading = false;
//           this.notFound = false;
//         } else {
//           this.notFound = true;
//           this.loading = false;
//         }
//       },
//       error: (err) => {
//         console.error('Error fetching survey details:', err);
//         this.notFound = true;
//         this.loading = false;
//       }
//     });
//   }

//   formatDate(date: string): string {
//     if (!date) return '';
//     return new Date(date).toLocaleDateString('he-IL', {
//       weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
//     });
//   }

//   formatTime(date: string): string {
//     if (!date) return '';
//     return new Date(date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
//   }

//   goBack(): void {
//     this.router.navigate(['/all-conferences']);
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
      }
    });
  }

  // loadSurveyDetails(id: string): void {
  //     this.loading = true;
  //     this.apiService.getSurveyById(id).subscribe({
  //       next: (data) => {
  //         if (data) {
  //           // הנתונים ב-JSON שהראית לנו מגיעים ישירות באובייקט הראשי (data)
  //           // לכן נשתמש בהם ישירות.
  //           this.conference = {
  //             name: data.name || data.conference || 'כנס ללא שם',
  //             description: data.description || '',
  //             tagline: data.tagline || '',
  //             date: data.date || '',
  //             location: data.location || 'לא צוין',
  //             language: data.language || 'English',
  //             whoShouldAttend: data.whoShouldAttend || 'Researchers, practitioners, and students.',
  //             contactEmail: data.contactEmail || '',
  //             submissionDeadline: data.submissionDeadline || null,
  //             // לפי ה-JSON, המארגנים הם מערך מחרוזות ישירות בשדה organizers
  //             programBlocks: data.programBlocks || [],
  //             organizersDetails: data.organizers || [] // כאן המיפוי למערך המארגנים
  //           };
  //           this.loading = false;
  //           this.notFound = false;
  //         } else {
  //           this.notFound = true;
  //           this.loading = false;
  //         }
  //       },
  //       error: () => {
  //         this.notFound = true;
  //         this.loading = false;
  //       }
  //     });
  //   }
  loadSurveyDetails(id: string): void {
    this.loading = true;
    this.apiService.getSurveyById(id).subscribe({
      next: (data) => {
        // --- כאן הוספתי את ההדפסה לקונסולה ---
        console.log('נתונים שהתקבלו מהשרת עבור כנס ' + id + ':', data);
        // ------------------------------------

        if (data) {
          this.conference = {
            name: data.Name || data.name || 'כנס ללא שם',
            description: data.Description || data.description || '',
            date: data.Date || data.date || '',
            location: data.Location || data.location || 'לא צוין',
            language: data.language || 'English',
            whoShouldAttend: data.whoShouldAttend || 'Researchers, practitioners, and students.',
            contactEmail: data.contactEmail || '',
            submissionDeadline: data.submissionDeadline || null,
            programBlocks: data.programBlocks || [],
            organizersDetails: data.organizers || []
          };
          this.loading = false;
          this.notFound = false;
        } else {
          this.notFound = true;
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching survey details:', err);
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

  formatTime(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  }

  goBack(): void {
    this.router.navigate(['/all-conferences']);
  }
}