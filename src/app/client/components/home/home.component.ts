// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../../../services/api.service';
// import { jwtDecode } from 'jwt-decode';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements OnInit {

//   constructor(private apiService: ApiService) { }
//   conferences: any[] = [];
//   loading = true;
//   isAdmin = false;
//   lastUpdated: Date = new Date('2026-05-26');

//   ngOnInit(): void {
//     this.checkIfAdmin();
//     this.loadConferences();
//   }

//   checkIfAdmin(): void {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded: any = jwtDecode(token);
//         const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role;
//         this.isAdmin = role === 'Admin';
//       } catch { this.isAdmin = false; }
//     }
//   }

//   loadConferences(): void {
//     this.apiService.getAllConferences().subscribe({
//       next: (data) => {
//         this.conferences = data;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Failed to load conferences', err);
//         this.loading = false;
//       }
//     });
//   }

//   deleteConference(id: string): void {
//     if (confirm('מחיקת כנס תמחוק גם את כל ההרצאות שלו. להמשיך?')) {
//       this.apiService.deleteConference(id).subscribe({
//         next: () => this.loadConferences(),
//         error: (err) => alert('שגיאה במחיקה: ' + err.message)
//       });
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { jwtDecode } from 'jwt-decode';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private apiService: ApiService, private translate: TranslateService) { }
  
  conferences: any[] = [];
  loading = true;
  isAdmin = false;
  lastUpdated: Date = new Date('2026-05-26');
  committeeMembers: string[] = []; // משתנה למערך חברי הוועדה

  ngOnInit(): void {
    this.checkIfAdmin();
    this.loadConferences();
    this.loadCommittee();

    // עדכון הרשימה בכל פעם שהשפה משתנה
    this.translate.onLangChange.subscribe(() => {
      this.loadCommittee();
    });
  }

  loadCommittee(): void {
    const members = this.translate.instant('ABOUT.COMMITTEE.MEMBERS');
    // הבטחה שהנתונים הם מערך לפני ההצגה
    this.committeeMembers = Array.isArray(members) ? members : [];
  }

  checkIfAdmin(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role;
        this.isAdmin = role === 'Admin';
      } catch { this.isAdmin = false; }
    }
  }

  loadConferences(): void {
    this.apiService.getAllConferences().subscribe({
      next: (data) => {
        this.conferences = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load conferences', err);
        this.loading = false;
      }
    });
  }

  deleteConference(id: string): void {
    if (confirm('מחיקת כנס תמחוק גם את כל ההרצאות שלו. להמשיך?')) {
      this.apiService.deleteConference(id).subscribe({
        next: () => this.loadConferences(),
        error: (err) => alert('שגיאה במחיקה: ' + err.message)
      });
    }
  }
}