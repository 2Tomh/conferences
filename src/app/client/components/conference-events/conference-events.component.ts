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
    // טעינת הנתונים מהשרת
    this.conferenceEventsService.getSurveys().subscribe({
      next: (data) => {
        this.conferences = data;
      },
      error: (err) => console.error('Error fetching surveys', err)
    });
  }

  // הפתרון החכם: מקבלים את כל אובייקט הכנס
openDescription(conf: any): void {
    const translationKey = 'CONFERENCES_DESC.' + conf.Conference;
    const dbDescription = conf.Description || conf.description || '';

    // שליפת התיאור מה-JSON
    this.translate.get(translationKey).subscribe((translatedText: string) => {
      
      // 1. אם אין בכלל מפתח כזה ב-JSON (למשל כנס חדש לגמרי שהמנהל יצר)
      if (translatedText === translationKey) {
        this.activeDescription = dbDescription || 'No description available.';
        return;
      }

      // 2. הטריק הגדול: אם התיאור ב-DB שונה מהתיאור ב-JSON, זה אומר שהמנהל ערך אותו!
      // נבדוק את זה ללא רווחים מיותרים (trim) כדי למנוע זיופים
      if (dbDescription && dbDescription.trim() !== translatedText.trim()) {
        // המנהל שינה את הטקסט באדמין -> נציג את מה שיש במונגו
        this.activeDescription = dbDescription;
      } else {
        // הטקסטים זהים או שאין שינוי -> נציג את התרגום הדינמי מה-JSON
        this.activeDescription = translatedText;
      }
    });
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

  // ה-Getter של הסינון שתומך גם בטאבים וגם בחיפוש חופשי
get filteredConferences(): any[] {
    let list = this.conferences;

    // 1. סינון לפי קטגוריות
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      list = list.filter(c => c.Category === this.selectedCategory);
    }

    if (!this.searchText) { return list; }

    const term = this.searchText.toLowerCase().trim();

    // 2. איפוס העמוד לעמוד 1 בכל פעם שמחפשים (פותר את הבעיה מהתמונה הראשונה)
    if (this.currentPage !== 1) {
      setTimeout(() => this.currentPage = 1);
    }

    return list.filter(c => {
      const confNameEn = (c.Conference || c.conference || '').toLowerCase();
      const description = (c.Description || c.description || '').toLowerCase();

      // שליפת התרגום הדינמי (עובד בכל שפה שמוגדרת באתר)
      const translationKey = 'CONFERENCES_NAMES.' + (c.Conference || c.conference);
      const confNameTranslated = this.translate.instant(translationKey).toLowerCase();

      // 3. בדיקה אם החיפוש מתאים לשם המקורי, לשם המתורגם או לתיאור
      const matchText = confNameEn.includes(term) || 
                        confNameTranslated.includes(term) || 
                        description.includes(term);

      // 4. בדיקת המארגנים
      const organizersArray = c.Organizers || c.organizers;
      let matchOrganizer = false;
      if (organizersArray && Array.isArray(organizersArray)) {
        matchOrganizer = organizersArray.some((org: string) => org?.toLowerCase().includes(term));
      }

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