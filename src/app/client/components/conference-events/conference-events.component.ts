import { Component, OnInit } from '@angular/core';
import { ConferenceEventsService } from '../../../services/conference-events.service'
@Component({
  selector: 'app-conference-events',
  templateUrl: './conference-events.component.html',
  styleUrls: ['./conference-events.component.css']
})
export class ConferenceEventsComponent implements OnInit {
  pageSize = 12;
  currentPage = 1;
  conferences: any[] = [];

  constructor(private conferenceEventsService: ConferenceEventsService) { }

  ngOnInit(): void {
    // טעינת הנתונים מהשרת
    this.conferenceEventsService.getSurveys().subscribe({
      next: (data) => {
        this.conferences = data;
      },
      error: (err) => console.error("Error fetching surveys", err)
    });
  }

  get totalPages(): number {
    return Math.ceil(this.conferences.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedConferences(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.conferences.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get lastUpdated(): Date {
    return this.conferences
      .filter(c => c.AddedAt)
      .map(c => new Date(c.AddedAt))
      .reduce((max, d) => d > max ? d : max, new Date(0));
  }
}