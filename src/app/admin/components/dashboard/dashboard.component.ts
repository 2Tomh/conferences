import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  conferences: any[] = [];
  loading = true;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadConferences();
  }

  loadConferences() {
    this.loading = true;
    this.apiService.getMyConferences().subscribe({
      next: (data) => {
        this.conferences = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('שגיאה בטעינת כנסים:', err);
        this.loading = false;
      }
    });
  }

  // השינוי כאן: id שונה מ-number ל-string
  onDelete(id: string) {
    if (confirm('האם אתה בטוח שברצונך למחוק את הכנס?')) {
      this.apiService.deleteConference(id).subscribe({
        next: () => {
          this.loadConferences(); // רענון הרשימה לאחר מחיקה
        },
        error: (err) => {
          console.error('שגיאה במחיקה:', err);
          alert('לא ניתן למחוק את הכנס כרגע.');
        }
      });
    }
  }
}
