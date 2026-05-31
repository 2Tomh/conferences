import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-conference-details',
  templateUrl: './conference-details.component.html',
  styleUrls: ['./conference-details.component.css']
})
export class ConferenceDetailsComponent implements OnInit {
  conference: any = null;
  loading = true;
  notFound = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.apiService.getConferenceById(id).subscribe({
      next: (data) => {
        this.conference = data;
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('he-IL', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  }

  goBack(): void {
    this.router.navigate(['/all-conferences']);
  }
}
