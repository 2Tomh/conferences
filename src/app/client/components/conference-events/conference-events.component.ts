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
    
    // שימוש ב-get האסינכרוני כדי לוודא שקובץ השפה נטען ב-100%
    this.translate.get(translationKey).subscribe((translatedText: string) => {
      // אם התרגום נכשל או לא קיים ב-JSON, ניקח את התיאור המקורי באנגלית מה-DB
      if (translatedText === translationKey) {
        this.activeDescription = conf.Description || conf.description || 'No description available.';
      } else {
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

    // סינון לפי התחום שנבחר ב-Navbar הפנימי
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      list = list.filter(c => c.Category === this.selectedCategory);
    }

    if (!this.searchText) { return list; }

    const term = this.searchText.toLowerCase();
    return list.filter(c => {
      const conferenceName = c.Conference || '';
      const description = c.Description || '';

      const matchText = conferenceName.toLowerCase().includes(term) || 
                        description.toLowerCase().includes(term);

      let matchOrganizer = false;
      if (c.Organizers && Array.isArray(c.Organizers)) {
        matchOrganizer = c.Organizers.some((org: string) => org?.toLowerCase().includes(term));
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