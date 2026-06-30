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
  partners: any[] = [];

  ngOnInit(): void {
    this.checkIfAdmin();
    this.loadConferences();
    this.loadCommittee();

    // עדכון הרשימה בכל פעם שהשפה משתנה
    this.translate.onLangChange.subscribe(() => {
      this.loadCommittee();
    });
    this.apiService.getPartners().subscribe({
      next: (data) => {
        this.partners = data;
      },
      error: (err) => console.error("Error loading partners:", err)
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
  ngAfterViewInit(): void {
    this.generateStars();
    this.initScrollSnap();
  }

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    const wrapper = document.querySelector('.main-card-wrapper') as HTMLElement;
    if (el && wrapper) {
      wrapper.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  }

  generateStars(): void {
    const container = document.getElementById('stars');
    if (!container) return;
    for (let i = 0; i < 120; i++) {
      const star = document.createElement('div');
      star.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.6);
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
      opacity: ${0.2 + Math.random() * 0.6};
      animation: twinkle ${2 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 4}s;
    `;
      container.appendChild(star);
    }
  }

  initScrollSnap(): void {
    const wrapper = document.querySelector('.main-card-wrapper') as HTMLElement;
    const dots = document.querySelectorAll('.dot');
    const sections = ['section-hero', 'section-about', 'section-partners'];

    if (!wrapper) return;

    wrapper.addEventListener('scroll', () => {
      const scrollTop = wrapper.scrollTop;
      const height = wrapper.clientHeight;
      const index = Math.round(scrollTop / height);

      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    });
  }
}