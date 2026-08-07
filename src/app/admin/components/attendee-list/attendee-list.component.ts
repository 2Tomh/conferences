import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-attendee-list',
  templateUrl: './attendee-list.component.html',
  styleUrls: ['./attendee-list.component.css']
})
export class AttendeeListComponent implements OnInit {
  attendees: any[] = [];
  filteredAttendees: any[] = [];
  allConferences: any[] = [];
  isLoading = false;
  error = '';
  searchTerm = '';
  selectedConferenceId = '';
  selectedPaymentStatus = '';
  sortField = 'RegisteredAt';
  sortDir: 'asc' | 'desc' = 'desc';
  selectedAttendee: any = null;
  selectedAbstractAttendee: any = null;

  currentPage = 1;
  pageSize = 15;

  // ⭐ חדש: state לפופ-אפ "הוספת תקציר" ע"י מנהל
  addAbstractTarget: any = null;
  addAbstractTitle = '';
  addAbstractBody = '';
  addAbstractNotes = '';
  addAbstractError = '';
  isSavingAbstract = false;

  constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    this.loadAttendees();
    this.loadConferences();
  }

  getCurrencySymbol(attendee: any): string {
    const currency = attendee?.Currency || attendee?.currency;
    return currency === 'USD' ? '$' : '₪';
  }
  exportToCSV() {
    if (!this.filteredAttendees || this.filteredAttendees.length === 0) {
      alert("No data to export");
      return;
    }
    const header = "Full Name,Email,Affiliation,Address,Role,Conference,Abstract Submitted,Payment Status,Amount Paid,Registration Date\n";
    const rows = this.filteredAttendees.map(a => {
      const hasAbstract = (a.HasAbstract === true || a.hasAbstract === true) ? 'Yes' : 'No';
      return [
        a.FullName,
        a.Email,
        a.Affiliation || '—',
        a.Address || '—',
        a.Role || a.role || '—',
        a.ConferenceName || '—',
        hasAbstract,
        a.DisplayStatus || a.PaymentStatus,
        (a.Amount || a.amount || 0) + ' ' + this.getCurrencySymbol(a),
        a.RegisteredAt ? new Date(a.RegisteredAt).toLocaleString('en-US') : ''
      ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(",");
    }).join("\n");
    const csvContent = "\uFEFF" + header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "attendees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  exportAbstractsToCSV() {
    const withAbstracts = this.filteredAttendees.filter(
      a => a.HasAbstract === true || a.hasAbstract === true
    );

    if (!withAbstracts || withAbstracts.length === 0) {
      alert("No abstracts to export");
      return;
    }

    const header = "Full Name,Affiliation,Conference,Abstract Title,Abstract Body,Additional Notes\n";
    const rows = withAbstracts.map(a => {
      return [
        a.FullName,
        a.Affiliation || a.affiliation || '—',
        a.ConferenceName || '—',
        a.AbstractTitle || a.abstractTitle || '',
        a.AbstractBody || a.abstractBody || '',
        a.AbstractNotes || a.abstractNotes || ''
      ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(",");
    }).join("\n");

    const csvContent = "\uFEFF" + header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "abstracts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  loadAttendees() {
    this.isLoading = true;
    this.error = '';
    this.apiService.getAllAttendees({
      conferenceId: this.selectedConferenceId,
      paymentStatus: this.selectedPaymentStatus,
      search: this.searchTerm
    }).subscribe({
      next: (data) => {
        this.attendees = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error loading attendees';
        console.error('Error calling the API:', err);
        this.isLoading = false;
      }
    });
  }
  loadConferences() {
    this.apiService.getAllConferences().subscribe({
      next: (data) => this.allConferences = data,
      error: () => { }
    });
  }
  applyFilters() {
    let list = [...this.attendees];
    if (this.searchTerm) {
      const t = this.searchTerm.toLowerCase();
      list = list.filter(a =>
        a.FullName?.toLowerCase().includes(t) ||
        a.Email?.toLowerCase().includes(t) ||
        a.Affiliation?.toLowerCase().includes(t)
      );
    }
    if (this.selectedConferenceId)
      list = list.filter(a => a.ConferenceId === this.selectedConferenceId);
    if (this.selectedPaymentStatus)
      list = list.filter(a => a.PaymentStatus === this.selectedPaymentStatus);
    list.sort((a, b) => {
      const av = a[this.sortField] ?? '';
      const bv = b[this.sortField] ?? '';
      return this.sortDir === 'asc'
        ? av > bv ? 1 : -1
        : av < bv ? 1 : -1;
    });
    this.filteredAttendees = list;
    this.currentPage = 1;
  }
  onSearch() { this.applyFilters(); }
  onFilterChange() { this.loadAttendees(); }
  sortBy(field: string) {
    if (this.sortField === field)
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
    this.applyFilters();
  }
  openDetails(attendee: any) { this.selectedAttendee = attendee; }
  closeDetails() { this.selectedAttendee = null; }
  openAbstractDetails(attendee: any) {
    this.selectedAbstractAttendee = attendee;
  }
  closeAbstractDetails() { this.selectedAbstractAttendee = null; }

  // ⭐ שונה: פותח את אותו טופס גם להוספה וגם לעריכה - אם כבר יש תקציר,
  // השדות מתמלאים מראש עם הערכים הקיימים
  openAddAbstract(attendee: any): void {
    this.addAbstractTarget = attendee;
    this.addAbstractTitle = attendee.AbstractTitle || attendee.abstractTitle || '';
    this.addAbstractBody = attendee.AbstractBody || attendee.abstractBody || '';
    this.addAbstractNotes = attendee.AbstractNotes || attendee.abstractNotes || '';
    this.addAbstractError = '';
  }

  get isEditingAbstract(): boolean {
    return !!(this.addAbstractTarget?.HasAbstract || this.addAbstractTarget?.hasAbstract);
  }

  closeAddAbstract(): void {
    this.addAbstractTarget = null;
  }

  saveAddAbstract(): void {
    if (!this.addAbstractTitle.trim() || !this.addAbstractBody.trim()) {
      this.addAbstractError = 'Title and abstract body are required';
      return;
    }
    if (!this.addAbstractTarget?.Id) {
      this.addAbstractError = 'Missing attendee ID';
      return;
    }

    this.isSavingAbstract = true;
    this.addAbstractError = '';

    this.apiService.addAbstractForAttendee(this.addAbstractTarget.Id, {
      title: this.addAbstractTitle.trim(),
      body: this.addAbstractBody.trim(),
      notes: this.addAbstractNotes.trim() || undefined
    }).subscribe({
      next: () => {
        this.isSavingAbstract = false;
        // עדכון מקומי מיידי - כדי לא לחכות לטעינה מחדש מלאה מהשרת
        this.addAbstractTarget.HasAbstract = true;
        this.addAbstractTarget.AbstractTitle = this.addAbstractTitle.trim();
        this.addAbstractTarget.AbstractBody = this.addAbstractBody.trim();
        this.addAbstractTarget.AbstractNotes = this.addAbstractNotes.trim() || null;
        this.addAbstractTarget = null;
      },
      error: (err) => {
        this.isSavingAbstract = false;
        this.addAbstractError = 'Failed to save abstract';
        console.error('Error adding abstract:', err);
      }
    });
  }

  // ⭐ חדש: state ולוגיקת מחיקת תקציר, עם אישור לפני
  deletingAbstractTarget: any = null;
  isDeletingAbstract = false;

  confirmDeleteAbstract(attendee: any): void {
    this.deletingAbstractTarget = attendee;
  }

  cancelDeleteAbstract(): void {
    this.deletingAbstractTarget = null;
  }

  deleteAbstract(): void {
    if (!this.deletingAbstractTarget?.Id || this.isDeletingAbstract) return;

    this.isDeletingAbstract = true;
    const target = this.deletingAbstractTarget;

    this.apiService.deleteAbstractForAttendee(target.Id).subscribe({
      next: () => {
        this.isDeletingAbstract = false;
        target.HasAbstract = false;
        target.AbstractTitle = null;
        target.AbstractBody = null;
        target.AbstractNotes = null;
        this.deletingAbstractTarget = null;
        // אם התקציר שנמחק היה פתוח כרגע בפופ-אפ הצפייה, סוגרים אותו
        if (this.selectedAbstractAttendee?.Id === target.Id) {
          this.selectedAbstractAttendee = null;
        }
      },
      error: (err) => {
        this.isDeletingAbstract = false;
        console.error('Error deleting abstract:', err);
        alert('Failed to delete abstract');
      }
    });
  }

  get totalCount() {
    return this.filteredAttendees.length;
  }
  get paidCount() {
    return this.filteredAttendees.filter(a => a.PaymentStatus === 'success').length;
  }
  get pendingCount() {
    return this.filteredAttendees.filter(a => a.PaymentStatus === 'pending').length;
  }
  get failedCount() {
    return this.filteredAttendees.filter(a => a.PaymentStatus === 'failed').length;
  }
  get withAbstractCount() {
    return this.filteredAttendees.filter(a => a.HasAbstract === true || a.hasAbstract === true).length;
  }

  get pagedAttendees() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAttendees.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredAttendees.length / this.pageSize));
  }

  get pageStart() {
    return this.filteredAttendees.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEnd() {
    return Math.min(this.currentPage * this.pageSize, this.filteredAttendees.length);
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const pages: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  nextPage() { this.goToPage(this.currentPage + 1); }
  prevPage() { this.goToPage(this.currentPage - 1); }
}