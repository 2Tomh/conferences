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

//   // ngOnInit(): void {
//   //   const user = this.authService.getCurrentUser();
//   //   this.userRole = user?.role || '';
//   //   this.userScope = user?.facultyName || '';
//   //   this.managedConferenceId = user?.managedConferenceId || '';

//   //   this.loadSurveys();
//   // }
// ngOnInit(): void {
//   const user = this.authService.getCurrentUser();
//   this.userRole = user?.role || '';
//   this.userScope = user?.scope || '';
//   this.managedConferenceId = user?.managedConferenceId || '';
//   this.loadSurveys();
// }
//   // פונקציה לבדיקת הרשאה להצגת טאב ב-NAV
//   canShowCategory(categoryName: string): boolean {
//     if (this.userRole === 'Admin' || this.userScope === 'ALL') return true;
//     return this.userScope === categoryName;
//   }

//   // loadSurveys(): void {
//   //   this.loading = true;
//   //   this.apiService.getMySurveys().subscribe({
//   //     next: (data) => {
//   //       this.conferences = data;
//   //       this.loading = false;
//   //     },
//   //     error: (err) => {
//   //       console.error('שגיאה בטעינת סקרים מהמונגו:', err);
//   //       this.loading = false;
//   //     }
//   //   });
//   // }

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
//           // יש פקולטה – כל הכנסים של הפקולטה
//           this.conferences = allData.filter(c => c.Category === this.userScope);
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
//       return this.conferences.filter(c => c.Category === this.selectedCategory);
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
import { AuthService } from '../../services/auth.service'; // וודא שזה הנתיב הנכון

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  conferences: any[] = [];
  loading = true;

  // משתנה לניהול הטאב הנבחר באדמין
  selectedCategory = 'All';
  managedConferenceId: string = '';
  // --- שדות לניהול ה-Pagination ---
  pageSize = 10;
  currentPage = 1;

  // משתני הרשאה לסינון התפריט (NAV)
  userRole: string = '';
  userScope: string = '';

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

  // פונקציה לבדיקת הרשאה להצגת טאב ב-NAV
  canShowCategory(categoryName: string): boolean {
    if (this.userRole === 'Admin' || this.userScope === 'ALL') return true;
    return this.userScope === categoryName;
  }

  // עוזר משותף: בודק אם כנס שייך לקטגוריה נתונה,
  // תוך תמיכה גם בשדה הישן (יחיד) וגם במערך החדש (multi-category)
  private conferenceMatchesCategory(c: any, category: string): boolean {
    const target = (category || '').toLowerCase();
    const singleCategory = (c.Category || c.category || '').toLowerCase();
    const categoriesArray: string[] = c.categories || c.Categories || [];
    const matchesArray = categoriesArray.some((cat: string) => (cat || '').toLowerCase() === target);
    return singleCategory === target || matchesArray;
  }

  // פונקציית הפעלה בעת לחיצה על טאב ב-Navbar
  loadSurveys(): void {
    this.loading = true;
    this.apiService.getSurveys().subscribe({  // אותו endpoint רגיל
      next: (data) => {
        const allData = Array.isArray(data) ? data : [data];
        if (this.userRole === 'Admin') {
          // אדמין רואה הכל – אבל זה לא אמור לקרות כאן
          this.conferences = allData;
        } else if (this.managedConferenceId) {
          // יש כנס ספציפי משויך – רק אותו
          this.conferences = allData.filter(c => c._id === this.managedConferenceId || c.Id === this.managedConferenceId);
        } else if (this.userScope) {
          // יש פקולטה – כל הכנסים של הפקולטה (כולל כנסים ששייכים אליה דרך המערך categories)
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
    this.currentPage = 1; // 🛠️ מאפסים לעמוד הראשון בכל שינוי קטגוריה
  }

  // 1. ה-Getter שמסנן את הטבלה לפי הקטגוריה
  get filteredConferences(): any[] {
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      return this.conferences.filter(c => this.conferenceMatchesCategory(c, this.selectedCategory));
    }
    return this.conferences;
  }

  // 2. ה-Getter שמחזיר רק את הרשומות של העמוד הנוכחי
  get pagedConferences(): any[] {
    const list = this.filteredConferences;
    const start = (this.currentPage - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  // 3. חישוב סך כל העמודים לקטגוריה הנוכחית
  get totalPages(): number {
    return Math.ceil(this.filteredConferences.length / this.pageSize) || 1;
  }

  // 4. יצירת מערך עמודים דינמי עבור ה-HTML (1, 2, 3...)
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // 5. מעבר בין עמודים וקפיצה חלקה לראש הטבלה
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
}