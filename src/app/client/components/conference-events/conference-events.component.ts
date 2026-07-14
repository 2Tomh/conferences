// import { Component, OnInit } from '@angular/core';
// import { ConferenceEventsService } from '../../../services/conference-events.service';
// import { TranslateService } from '@ngx-translate/core';

// @Component({
//   selector: 'app-conference-events',
//   templateUrl: './conference-events.component.html',
//   styleUrls: ['./conference-events.component.css']
// })
// export class ConferenceEventsComponent implements OnInit {
//   pageSize = 12;
//   currentPage = 1;
//   conferences: any[] = [];
//   searchText = '';

//   // --- שדות הניווט החדשים לפי תחום ---
//   selectedCategory: string = 'All';

//   // --- ניהול ה-Popup של התיאור ---
//   activeDescription: string | null = null;

//   constructor(
//     private conferenceEventsService: ConferenceEventsService,
//     private translate: TranslateService
//   ) { }

//   ngOnInit(): void {
//     this.conferenceEventsService.getSurveys().subscribe({
//       next: (data) => {
//         this.conferences = data;
//       },
//       error: (err) => console.error('שגיאה בטעינת נתונים:', err)
//     });
//   }

//   // הפתרון החכם: מקבלים את כל אובייקט הכנס
//   openDescription(conf: any) {
//     // נבדוק את כל האפשרויות לשם השדה
//     this.activeDescription = conf.Description || conf.description || 'אין תיאור זמין';
//   }

//   closeDescription(): void {
//     this.activeDescription = null;
//   }

//   // פונקציה לשינוי התחום בלחיצה מה-Navbar
//   selectCategory(category: string): void {
//     this.selectedCategory = category;
//     this.currentPage = 1; // מאפסים לעמוד הראשון בכל סינון מחדש
//   }

//   get pages(): number[] {
//     return Array.from({ length: this.totalPages }, (_, i) => i + 1);
//   }

//   goToPage(page: number): void {
//     if (page < 1 || page > this.totalPages) { return; }
//     this.currentPage = page;
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   get lastUpdated(): Date {
//     return this.conferences
//       .filter(c => c.AddedAt || c.addedAt)
//       .map(c => new Date(c.AddedAt || c.addedAt))
//       .reduce((max, d) => d > max ? d : max, new Date(0));
//   }

//   // ה-Getter של הסינון שתומך גם בטאבים וגם בחיפוש חופשי
//   get filteredConferences(): any[] {
//     let list = this.conferences;

//     // 1. סינון לפי קטגוריות
//     if (this.selectedCategory && this.selectedCategory !== 'All') {
//       // נרמול גם של הקטגוריה כדי למנוע טעויות Case Sensitivity
//       list = list.filter(c =>
//         (c.Category || c.category || '').toLowerCase() === this.selectedCategory.toLowerCase()
//       );
//     }

//     if (!this.searchText) { return list; }

//     const term = this.searchText.toLowerCase().trim();

//     return list.filter(c => {
//       // א. נרמול שם הכנס בלבד (שימוש ב-|| כדי לתפוס את כל הווריאציות)
//       // הוסר: התאמה לפי Description — היא גרמה להצגת כנסים לא-קשורים
//       // (למשל חיפוש "behav" הציג גם כנסים שרק בתיאור המלא שלהם
//       // מוזכרת המילה "behavior", בלי שום קשר לשם הכנס עצמו).
//       const name = (c.Conference || c.conference || c.Name || c.name || '').toLowerCase();

//       // ב. טיפול ב-TranslateService — עדיין נחשב "שם הכנס", רק בשפה המתורגמת
//       const translationKey = 'CONFERENCES_NAMES.' + (c.Conference || c.conference);
//       const translated = this.translate.instant(translationKey);
//       const confNameTranslated = (translated !== translationKey ? translated : '').toLowerCase();

//       // ג. בדיקת התאמה — רק שם הכנס (גולמי או מתורגם)
//       const matchText = name.includes(term) || confNameTranslated.includes(term);

//       // ד. בדיקת מארגנים (טיפול גם באובייקטים וגם במערך מחרוזות)
//       const organizers = c.Organizers || c.organizers || [];
//       const matchOrganizer = organizers.some((org: any) => {
//         const orgName = typeof org === 'string' ? org : (org.Name || org.name || '');
//         return orgName.toLowerCase().includes(term);
//       });

//       return matchText || matchOrganizer;
//     });
//   }

//   get pagedConferences(): any[] {
//     const list = this.filteredConferences;
//     const start = (this.currentPage - 1) * this.pageSize;
//     const result = list.slice(start, start + this.pageSize);
//     return result;
//   }

//   get totalPages(): number {
//     return Math.ceil(this.filteredConferences.length / this.pageSize);
//   }

//   onSearchChange() {
//     this.currentPage = 1;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ConferenceEventsService } from '../../../services/conference-events.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-conference-events',
  templateUrl: './conference-events.component.html',
  styleUrls: ['./conference-events.component.css']
})
export class ConferenceEventsComponent implements OnInit {
  pageSize = 12;
  currentPage = 1;
  conferences: any[] = [];
  searchText = '';

  // --- שדות הניווט החדשים לפי תחום ---
  selectedCategory: string = 'All';

  // --- ניהול ה-Popup של התיאור ---
  activeDescription: string | null = null;

  constructor(
    private conferenceEventsService: ConferenceEventsService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.conferenceEventsService.getSurveys().subscribe({
      next: (data) => {
        this.conferences = data;
      },
      error: (err) => console.error('שגיאה בטעינת נתונים:', err)
    });
  }

  // הפתרון החכם: מקבלים את כל אובייקט הכנס
  openDescription(conf: any) {
    // נבדוק את כל האפשרויות לשם השדה
    this.activeDescription = conf.Description || conf.description || 'אין תיאור זמין';
  }

  closeDescription(): void {
    this.activeDescription = null;
  }

  // פונקציה לשינוי התחום בלחיצה מה-Navbar
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1; // מאפסים לעמוד הראשון בכל סינון מחדש
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) { return; }
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get lastUpdated(): Date {
    return this.conferences
      .filter(c => c.AddedAt || c.addedAt)
      .map(c => new Date(c.AddedAt || c.addedAt))
      .reduce((max, d) => d > max ? d : max, new Date(0));
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

  // ה-Getter של הסינון שתומך גם בטאבים וגם בחיפוש חופשי
  get filteredConferences(): any[] {
    let list = this.conferences;

    // 1. סינון לפי קטגוריות (כולל תמיכה במערך categories)
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      list = list.filter(c => this.conferenceMatchesCategory(c, this.selectedCategory));
    }

    if (!this.searchText) { return list; }

    const term = this.searchText.toLowerCase().trim();

    return list.filter(c => {
      // א. נרמול שם הכנס בלבד (שימוש ב-|| כדי לתפוס את כל הווריאציות)
      // הוסר: התאמה לפי Description — היא גרמה להצגת כנסים לא-קשורים
      // (למשל חיפוש "behav" הציג גם כנסים שרק בתיאור המלא שלהם
      // מוזכרת המילה "behavior", בלי שום קשר לשם הכנס עצמו).
      const name = (c.Conference || c.conference || c.Name || c.name || '').toLowerCase();

      // ב. טיפול ב-TranslateService — עדיין נחשב "שם הכנס", רק בשפה המתורגמת
      const translationKey = 'CONFERENCES_NAMES.' + (c.Conference || c.conference);
      const translated = this.translate.instant(translationKey);
      const confNameTranslated = (translated !== translationKey ? translated : '').toLowerCase();

      // ג. בדיקת התאמה — רק שם הכנס (גולמי או מתורגם)
      const matchText = name.includes(term) || confNameTranslated.includes(term);

      // ד. בדיקת מארגנים (טיפול גם באובייקטים וגם במערך מחרוזות)
      const organizers = c.Organizers || c.organizers || [];
      const matchOrganizer = organizers.some((org: any) => {
        const orgName = typeof org === 'string' ? org : (org.Name || org.name || '');
        return orgName.toLowerCase().includes(term);
      });

      return matchText || matchOrganizer;
    });
  }

  get pagedConferences(): any[] {
    const list = this.filteredConferences;
    const start = (this.currentPage - 1) * this.pageSize;
    const result = list.slice(start, start + this.pageSize);
    return result;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredConferences.length / this.pageSize);
  }

  onSearchChange() {
    this.currentPage = 1;
  }
}