// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { ApiService } from '../../../services/api.service';
// import { AuthService } from '../../services/auth.service'; // וודא שזה הנתיב הנכון

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {
//   conferences: any[] = [];
//   loading = true;

//   // משתנה לניהול הטאב הנבחר באדמין
//   selectedCategory = 'All';
//   managedConferenceId: string = '';
//   // --- שדות לניהול ה-Pagination ---
//   pageSize = 10;
//   currentPage = 1;

//   // משתני הרשאה לסינון התפריט (NAV)
//   userRole: string = '';
//   userScope: string = '';

//   constructor(
//     private apiService: ApiService,
//     private router: Router,
//     private authService: AuthService
//   ) { }

//   ngOnInit(): void {
//     const user = this.authService.getCurrentUser();
//     this.userRole = user?.role || '';
//     this.userScope = user?.scope || '';
//     this.managedConferenceId = user?.managedConferenceId || '';
//     this.loadSurveys();
//   }

//   // פונקציה לבדיקת הרשאה להצגת טאב ב-NAV
//   canShowCategory(categoryName: string): boolean {
//     if (this.userRole === 'Admin' || this.userScope === 'ALL') return true;
//     return this.userScope === categoryName;
//   }

//   // עוזר משותף: בודק אם כנס שייך לקטגוריה נתונה,
//   // תוך תמיכה גם בשדה הישן (יחיד) וגם במערך החדש (multi-category)
//   private conferenceMatchesCategory(c: any, category: string): boolean {
//     const target = (category || '').toLowerCase();
//     const singleCategory = (c.Category || c.category || '').toLowerCase();
//     const categoriesArray: string[] = c.categories || c.Categories || [];
//     const matchesArray = categoriesArray.some((cat: string) => (cat || '').toLowerCase() === target);
//     return singleCategory === target || matchesArray;
//   }

//   // פונקציית הפעלה בעת לחיצה על טאב ב-Navbar
//   loadSurveys(): void {
//     this.loading = true;
//     this.apiService.getSurveys().subscribe({  // אותו endpoint רגיל
//       next: (data) => {
//         const allData = Array.isArray(data) ? data : [data];
//         if (this.userRole === 'Admin') {
//           // אדמין רואה הכל – אבל זה לא אמור לקרות כאן
//           this.conferences = allData;
//         } else if (this.managedConferenceId) {
//           // יש כנס ספציפי משויך – רק אותו
//           this.conferences = allData.filter(c => c._id === this.managedConferenceId || c.Id === this.managedConferenceId);
//         } else if (this.userScope) {
//           // יש פקולטה – כל הכנסים של הפקולטה (כולל כנסים ששייכים אליה דרך המערך categories)
//           this.conferences = allData.filter(c => this.conferenceMatchesCategory(c, this.userScope));
//         } else {
//           this.conferences = [];
//         }

//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('שגיאה:', err);
//         this.loading = false;
//       }
//     });
//   }

//   selectCategory(category: string): void {
//     this.selectedCategory = category;
//     this.currentPage = 1; // 🛠️ מאפסים לעמוד הראשון בכל שינוי קטגוריה
//   }

//   // 1. ה-Getter שמסנן את הטבלה לפי הקטגוריה
//   get filteredConferences(): any[] {
//     if (this.selectedCategory && this.selectedCategory !== 'All') {
//       return this.conferences.filter(c => this.conferenceMatchesCategory(c, this.selectedCategory));
//     }
//     return this.conferences;
//   }

//   // 2. ה-Getter שמחזיר רק את הרשומות של העמוד הנוכחי
//   get pagedConferences(): any[] {
//     const list = this.filteredConferences;
//     const start = (this.currentPage - 1) * this.pageSize;
//     return list.slice(start, start + this.pageSize);
//   }

//   // 3. חישוב סך כל העמודים לקטגוריה הנוכחית
//   get totalPages(): number {
//     return Math.ceil(this.filteredConferences.length / this.pageSize) || 1;
//   }

//   // 4. יצירת מערך עמודים דינמי עבור ה-HTML (1, 2, 3...)
//   get pages(): number[] {
//     return Array.from({ length: this.totalPages }, (_, i) => i + 1);
//   }

//   // 5. מעבר בין עמודים וקפיצה חלקה לראש הטבלה
//   goToPage(page: number): void {
//     if (page < 1 || page > this.totalPages) return;
//     this.currentPage = page;
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   onEdit(id: string): void {
//     this.router.navigate(['/admin/manage-conference', id]);
//   }

//   onDelete(id: string): void {
//     if (confirm('האם אתה בטוח שברצונך למחוק את הסקר מהדאטהבייס?')) {
//       this.apiService.deleteSurvey(id).subscribe({
//         next: () => {
//           this.loadSurveys();
//         },
//         error: (err) => {
//           console.error('שגיאה במחיקה:', err);
//           alert('לא ניתן למחוק את הסקר כרגע.');
//         }
//       });
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  conferences: any[] = [];
  loading = true;

  selectedCategory = 'All';
  managedConferenceId: string = '';
  pageSize = 10;
  currentPage = 1;

  userRole: string = '';
  userScope: string = '';

  updatingExternalId: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userRole = user?.role || '';
    this.userScope = user?.scope || '';
    this.managedConferenceId = user?.managedConferenceId || '';
    this.loadSurveys();
  }

  canShowCategory(categoryName: string): boolean {
    if (this.userRole === 'Admin' || this.userScope === 'ALL') return true;
    return this.userScope === categoryName;
  }

  private conferenceMatchesCategory(c: any, category: string): boolean {
    const target = (category || '').toLowerCase();
    const singleCategory = (c.Category || c.category || '').toLowerCase();
    const categoriesArray: string[] = c.categories || c.Categories || [];
    const matchesArray = categoriesArray.some((cat: string) => (cat || '').toLowerCase() === target);
    return singleCategory === target || matchesArray;
  }

  loadSurveys(): void {
    this.loading = true;
    this.apiService.getSurveys().subscribe({
      next: (data) => {
        const allData = Array.isArray(data) ? data : [data];
        if (this.userRole === 'Admin') {
          this.conferences = allData;
        } else if (this.managedConferenceId) {
          this.conferences = allData.filter(c => c._id === this.managedConferenceId || c.Id === this.managedConferenceId);
        } else if (this.userScope) {
          this.conferences = allData.filter(c => this.conferenceMatchesCategory(c, this.userScope));
        } else {
          this.conferences = [];
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('שגיאה:', err);
        this.loading = false;
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
  }

  get filteredConferences(): any[] {
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      return this.conferences.filter(c => this.conferenceMatchesCategory(c, this.selectedCategory));
    }
    return this.conferences;
  }

  get pagedConferences(): any[] {
    const list = this.filteredConferences;
    const start = (this.currentPage - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredConferences.length / this.pageSize) || 1;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onEdit(id: string): void {
    this.router.navigate(['/admin/manage-conference', id]);
  }

  onDelete(id: string): void {
    if (confirm('האם אתה בטוח שברצונך למחוק את הסקר מהדאטהבייס?')) {
      this.apiService.deleteSurvey(id).subscribe({
        next: () => {
          this.loadSurveys();
        },
        error: (err) => {
          console.error('שגיאה במחיקה:', err);
          alert('לא ניתן למחוק את הסקר כרגע.');
        }
      });
    }
  }

  // ⭐ עודכן: משתמש ב-IsExternalOnly (אות גדולה) בהתאמה למה שהשרת מחזיר/מצפה לו,
  // כי PropertyNamingPolicy = null בצד ה-C# משמר את שמות השדות כפי שהם במודל
  toggleExternalOnly(conf: any): void {
    const id = conf.Id || conf._id;
    if (!id || this.updatingExternalId === id) return;

    const newValue = !conf.IsExternalOnly;
    const confirmMsg = newValue
      ? `להפוך את "${conf.name || conf.Name || conf.Conference || conf.conference}" לכנס חיצוני?`
      : `להחזיר את "${conf.name || conf.Name || conf.Conference || conf.conference}" לכנס פנימי (רגיל)?`;

    if (!confirm(confirmMsg)) return;

    this.updatingExternalId = id;

    this.apiService.updateSurvey(id, { IsExternalOnly: newValue }).subscribe({
      next: () => {
        conf.IsExternalOnly = newValue;
        this.updatingExternalId = null;
      },
      error: (err) => {
        console.error('שגיאה בעדכון סטטוס חיצוני:', err);
        alert('לא ניתן לעדכן את הסטטוס כרגע.');
        this.updatingExternalId = null;
      }
    });
  }
}