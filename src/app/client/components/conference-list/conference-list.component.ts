import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-conference-list',
  templateUrl: './conference-list.component.html',
  styleUrls: ['./conference-list.component.css']
})
export class ConferenceListComponent implements OnInit {
  conferences: any[] = [];
  facultyGroups: { name: string, conferences: any[] }[] = [];
  loading = true;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getAllConferences().subscribe({
      next: (data) => {
        this.conferences = data;
        this.groupByFaculty(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('שגיאה:', err);
        this.loading = false;
      }
    });
  }

  groupByFaculty(conferences: any[]): void {
    const map = new Map<string, any[]>();
    conferences.forEach(c => {
      const faculty = c.facultyName || 'כללי';
      if (!map.has(faculty)) { map.set(faculty, []); }
      map.get(faculty)!.push(c);
    });
    this.facultyGroups = Array.from(map.entries()).map(([name, conferences]) => ({ name, conferences }));
  }

  goToConference(id: string): void {
    this.router.navigate(['/conference', id]);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
