import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-announcement-tracking',
  templateUrl: './announcement-tracking.component.html',
  styleUrls: ['./announcement-tracking.component.css']
})
export class AnnouncementTrackingComponent implements OnInit {
  isAdmin = false;

  latestAnnouncement: any = null;
  allRecipients: any[] = [];
  filteredRecipients: any[] = [];
  statusFilter = '';
  searchTerm = '';

  isLoading = false;
  isResendingAll = false;
  resendingRecipientIds = new Set<string>();

  currentPage = 1;
  pageSize = 20;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.isAdmin = this.checkIsAdmin();
    if (this.isAdmin) {
      this.loadLatestAnnouncement();
    }
  }

  private checkIsAdmin(): boolean {
    const directRole = localStorage.getItem('role');
    if (directRole) return directRole === 'Admin';
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.role) return user.role === 'Admin';
        if (user?.Role) return user.Role === 'Admin';
      } catch { }
    }
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('jwt');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload['role'] || payload['Role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        return role === 'Admin';
      } catch { }
    }
    return false;
  }

  loadLatestAnnouncement(): void {
    this.isLoading = true;
    this.apiService.getAnnouncements().subscribe({
      next: (announcements) => {
        if (announcements && announcements.length > 0) {
          this.latestAnnouncement = announcements[0];
          this.loadRecipients();
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading announcements:', err);
        this.isLoading = false;
      }
    });
  }

  loadRecipients(): void {
    if (!this.latestAnnouncement?.Id) return;
    this.isLoading = true;
    this.apiService.getAnnouncementRecipients(this.latestAnnouncement.Id).subscribe({
      next: (data) => {
        this.allRecipients = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading recipients:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let list = [...this.allRecipients];

    if (this.statusFilter) {
      list = list.filter(r => r.Status === this.statusFilter);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      list = list.filter(r =>
        (r.FullName || '').toLowerCase().includes(term) ||
        (r.Email || '').toLowerCase().includes(term)
      );
    }

    this.filteredRecipients = list;
    this.currentPage = 1;
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  resendToOne(recipient: any): void {
    const targetId = recipient.AttendeeId; // ⭐ תמיד קיים, בשונה מ-Id
    if (this.resendingRecipientIds.has(targetId)) return;
    this.resendingRecipientIds.add(targetId);

    this.apiService.sendToAttendee(this.latestAnnouncement.Id, targetId).subscribe({
      next: () => {
        this.resendingRecipientIds.delete(targetId);
        recipient.Status = 'sent';
        recipient.SentAt = new Date();
        recipient.ErrorMessage = null;
      },
      error: (err) => {
        this.resendingRecipientIds.delete(targetId);
        console.error('Error sending/resending:', err);
        alert('Failed to send email to this recipient');
      }
    });
  }

  isResending(recipientId: string): boolean {
    return this.resendingRecipientIds.has(recipientId);
  }

  resendAllFailed(): void {
    if (!this.latestAnnouncement?.Id || this.isResendingAll) return;
    if (!confirm('Resend to all failed or unsent recipients for this announcement?')) return;

    this.isResendingAll = true;
    this.apiService.resendAllFailed(this.latestAnnouncement.Id).subscribe({
      next: (res: any) => {
        this.isResendingAll = false;
        alert(`Sent: ${res.sent}, still failed: ${res.stillFailed}`);
        this.loadRecipients();
      },
      error: (err) => {
        this.isResendingAll = false;
        console.error('Error resending all:', err);
        alert('Failed to resend');
      }
    });
  }

  get failedCount(): number {
    return this.allRecipients.filter(r => r.Status === 'failed' || r.Status === 'not_sent').length;
  }

  get pagedRecipients(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRecipients.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRecipients.length / this.pageSize));
  }

  get pageStart(): number {
    return this.filteredRecipients.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredRecipients.length);
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

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  nextPage(): void { this.goToPage(this.currentPage + 1); }
  prevPage(): void { this.goToPage(this.currentPage - 1); }
}