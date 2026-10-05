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

  // ⭐ חדש: מזהה הכנס שסטטוס ההרשמה שלו מתעדכן כרגע (למניעת לחיצה כפולה)
  updatingRegistrationId: string | null = null;

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

  private getConfName(conf: any): string {
    return conf.name || conf.Name || conf.Conference || conf.conference || 'Unnamed Conference';
  }

  toggleExternalOnly(conf: any): void {
    const id = conf.Id || conf._id;
    if (!id || this.updatingExternalId === id) return;

    const newValue = !conf.IsExternalOnly;
    const confirmMsg = newValue
      ? `להפוך את "${this.getConfName(conf)}" לכנס חיצוני?`
      : `להחזיר את "${this.getConfName(conf)}" לכנס פנימי (רגיל)?`;

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

  // ⭐ חדש: פתיחה/סגירה של ההרשמה לכנס - אדמין ראשי בלבד
  toggleRegistrationClosed(conf: any): void {
    const id = conf.Id || conf._id;
    if (!id || this.updatingRegistrationId === id || this.userRole !== 'Admin') return;

    const newValue = !conf.IsRegistrationClosed;
    const confirmMsg = newValue
      ? `לסגור את ההרשמה לכנס "${this.getConfName(conf)}"?\nלא ניתן יהיה להירשם או לשלם עבור הכנס.`
      : `לפתוח מחדש את ההרשמה לכנס "${this.getConfName(conf)}"?`;

    if (!confirm(confirmMsg)) return;

    this.updatingRegistrationId = id;

    this.apiService.updateSurvey(id, { IsRegistrationClosed: newValue }).subscribe({
      next: () => {
        conf.IsRegistrationClosed = newValue;
        this.updatingRegistrationId = null;
      },
      error: (err) => {
        console.error('שגיאה בעדכון סטטוס ההרשמה:', err);
        alert('לא ניתן לעדכן את סטטוס ההרשמה כרגע.');
        this.updatingRegistrationId = null;
      }
    });
  }

  // ייצוא כל המידע המלא של הכנסים לאקסל (CSV)
  exportToExcel(): void {
    const conferencesToExport = this.filteredConferences;
    if (!conferencesToExport || conferencesToExport.length === 0) {
      alert('אין נתונים לייצוא.');
      return;
    }

    let csvContent = '\uFEFF'; // BOM לתמיכה בעברית באקסל (UTF-8)
    csvContent += 'ID,Conference Name,Category,Location,Date/Time,Description,Abstract Submission,Allows Poster,Is External,Registration,Contact Email,Website,Survey Link\n';

    conferencesToExport.forEach(conf => {
      const id = `"${(conf.Id || conf._id || '').replace(/"/g, '""')}"`;
      const name = `"${this.getConfName(conf).replace(/"/g, '""')}"`;
      const category = `"${(conf.Category || conf.category || '').replace(/"/g, '""')}"`;

      const location = `"${(conf.Location || conf.location || conf.Address || '').replace(/"/g, '""')}"`;
      const dateTime = `"${(conf.Date || conf.date || conf.Time || conf.time || conf.Schedule || conf.schedule || '').replace(/"/g, '""')}"`;
      const description = `"${(conf.Description || conf.description || '').replace(/[\r\n]+/g, ' ').replace(/"/g, '""')}"`;

      const abstractSub = (conf.AbstractSubmission || conf.Abstract_submission || conf.abstractSubmission) ? 'Yes' : 'No';
      const allowsPoster = (conf.AllowsPoster || conf.allowsPoster) ? 'Yes' : 'No';
      const isExternal = conf.IsExternalOnly ? 'External' : 'Internal';
      const registration = conf.IsRegistrationClosed ? 'Closed' : 'Open'; // ⭐ חדש

      const contactEmail = `"${(conf.ContactEmail || conf.contactEmail || '').replace(/"/g, '""')}"`;
      const website = `"${(conf.Links?.website || conf.website || '').replace(/"/g, '""')}"`;
      const survey = `"${(conf.Links?.survey || conf.Links?.Survey || conf.survey || conf.Survey || '').replace(/"/g, '""')}"`;

      csvContent += `${id},${name},${category},${location},${dateTime},${description},${abstractSub},${allowsPoster},${isExternal},${registration},${contactEmail},${website},${survey}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Conferences_Full_Export_${this.selectedCategory}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}