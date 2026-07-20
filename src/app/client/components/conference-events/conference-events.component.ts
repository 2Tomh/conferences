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

  selectedCategory: string = 'All';
  activeDescription: string | null = null;

  private readonly EXTERNAL_ONLY_CONFERENCE_NAMES: string[] = [
    'Law',
    'Network Dynamics in Socio-Technical Systems: From Resilient Control to Incentives and Information Design',
    'Mid-Chain DeFi Conference',
    'Applied Mathematics'
  ];

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

  openDescription(conf: any) {
    this.activeDescription = conf.Description || conf.description || 'אין תיאור זמין';
  }

  closeDescription(): void {
    this.activeDescription = null;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
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

  private conferenceMatchesCategory(c: any, category: string): boolean {
    const target = (category || '').toLowerCase();
    const singleCategory = (c.Category || c.category || '').toLowerCase();
    const categoriesArray: string[] = c.categories || c.Categories || [];
    const matchesArray = categoriesArray.some((cat: string) => (cat || '').toLowerCase() === target);
    return singleCategory === target || matchesArray;
  }

  isExternalOnlyConference(conf: any): boolean {
    const name = (conf.Name || conf.name || conf.Conference || conf.conference || '').toLowerCase();
    return this.EXTERNAL_ONLY_CONFERENCE_NAMES.some(
      excluded => excluded.toLowerCase() === name
    );
  }

  get filteredConferences(): any[] {
    let list = this.conferences;

    if (this.selectedCategory && this.selectedCategory !== 'All') {
      list = list.filter(c => this.conferenceMatchesCategory(c, this.selectedCategory));
    }

    if (!this.searchText) {
      return this.sortByName(list);
    }

    const term = this.searchText.toLowerCase().trim();

    const filtered = list.filter(c => {
      const name = (c.Conference || c.conference || c.Name || c.name || '').toLowerCase();

      const translationKey = 'CONFERENCES_NAMES.' + (c.Conference || c.conference);
      const translated = this.translate.instant(translationKey);
      const confNameTranslated = (translated !== translationKey ? translated : '').toLowerCase();

      const matchText = name.includes(term) || confNameTranslated.includes(term);

      const organizers = c.Organizers || c.organizers || [];
      const matchOrganizer = organizers.some((org: any) => {
        const orgName = typeof org === 'string' ? org : (org.Name || org.name || '');
        return orgName.toLowerCase().includes(term);
      });

      return matchText || matchOrganizer;
    });

    return this.sortByName(filtered);
  }

  // ⭐ חדש: ממיין רשימת כנסים לפי שם, א'-ב' / A-Z
  private sortByName(list: any[]): any[] {
    return [...list].sort((a, b) => {
      const nameA = (a.Name || a.name || a.Conference || a.conference || '').toLowerCase();
      const nameB = (b.Name || b.name || b.Conference || b.conference || '').toLowerCase();
      return nameA.localeCompare(nameB);
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