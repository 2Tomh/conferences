import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  isUnlocked = false;
  passwordInput = '';
  passwordError = '';
  isVerifying = false;

  private readonly PAGE_KEY = 'transactions';
  private readonly SESSION_KEY = 'txPageUnlocked';

  transactions: any[] = [];
  filteredTransactions: any[] = [];
  isLoading = false;
  error = '';
  searchTerm = '';
  selectedStatus = '';

  sortField = 'CreatedAt';
  sortDir: 'asc' | 'desc' = 'desc';

  currentPage = 1;
  pageSize = 20;

  selectedTransaction: any = null;

  resendingOrderIds = new Set<string>();
  resendFeedback: { [orderId: string]: string } = {};

  // ⭐⭐ חדש: לעריכת transaction (רשימת כנסים לבחירה + role check)
  allConferences: any[] = [];
  isAdmin = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem(this.SESSION_KEY) === 'true') {
      this.isUnlocked = true;
      this.loadTransactions();
    }
    this.loadConferences();
    this.isAdmin = this.checkIsAdmin();
  }

  private loadConferences(): void {
    this.apiService.getAllConferences().subscribe({
      next: (data) => this.allConferences = data,
      error: () => { }
    });
  }

  // ⭐⭐ אותה לוגיקת בדיקת role כמו ב-attendee-list.component.ts
  private checkIsAdmin(): boolean {
    const directRole = localStorage.getItem('role');
    if (directRole) {
      return directRole === 'Admin';
    }

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
        const role =
          payload['role'] ||
          payload['Role'] ||
          payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        return role === 'Admin';
      } catch { }
    }

    return false;
  }

  submitPassword(): void {
    if (!this.passwordInput || this.isVerifying) return;

    this.isVerifying = true;
    this.passwordError = '';

    this.apiService.verifyPageAccess(this.PAGE_KEY, this.passwordInput).subscribe({
      next: (res) => {
        this.isVerifying = false;
        if (res?.success) {
          this.isUnlocked = true;
          sessionStorage.setItem(this.SESSION_KEY, 'true');
          this.loadTransactions();
        } else {
          this.passwordError = 'Incorrect password. Please try again.';
          this.passwordInput = '';
        }
      },
      error: (err) => {
        this.isVerifying = false;
        this.passwordError = 'Could not verify password — please try again.';
        console.error('Error verifying page access:', err);
      }
    });
  }

  lockPage(): void {
    this.isUnlocked = false;
    sessionStorage.removeItem(this.SESSION_KEY);
    this.transactions = [];
    this.filteredTransactions = [];
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.error = '';
    this.apiService.getAllTransactions().subscribe({
      next: (data: any[]) => {
        this.transactions = data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading transactions';
        console.error('Error calling the API:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let list = [...this.transactions];
    if (this.searchTerm) {
      const t = this.searchTerm.toLowerCase();
      list = list.filter(tx =>
        tx.FullName?.toLowerCase().includes(t) ||
        tx.Email?.toLowerCase().includes(t) ||
        tx.ConferenceName?.toLowerCase().includes(t) ||
        tx.TxId?.toLowerCase().includes(t) ||
        tx.RegistrationId?.toLowerCase().includes(t)
      );
    }
    if (this.selectedStatus) {
      list = list.filter(tx => tx.Status === this.selectedStatus);
    }
    list.sort((a, b) => {
      const av = this.getSortValue(a, this.sortField);
      const bv = this.getSortValue(b, this.sortField);
      return this.sortDir === 'asc'
        ? (av > bv ? 1 : -1)
        : (av < bv ? 1 : -1);
    });
    this.filteredTransactions = list;
    this.currentPage = 1;
  }

  private getSortValue(tx: any, field: string): any {
    if (field === 'Amount') return this.getAmount(tx);
    if (field === 'CreatedAt') return this.getDate(tx.CreatedAt) || '';
    return tx[field] ?? '';
  }

  getAmount(tx: any): number {
    const raw = tx.Amount?.$numberDecimal ?? tx.Amount;
    return raw != null ? parseFloat(raw) : 0;
  }

  getDate(value: any): string | null {
    const raw = value?.$date || value;
    return raw || null;
  }

  onSearch(): void { this.applyFilters(); }
  onStatusFilterChange(): void { this.applyFilters(); }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'desc';
    }
    this.applyFilters();
  }

  openDetails(tx: any): void {
    this.selectedTransaction = tx;
  }

  closeDetails(): void {
    this.selectedTransaction = null;
  }

  resendEmail(tx: any): void {
    if (!tx?.OrderId) {
      this.resendFeedback[tx?.OrderId ?? ''] = 'Missing order ID';
      return;
    }
    if (this.resendingOrderIds.has(tx.OrderId)) return;

    this.resendingOrderIds.add(tx.OrderId);
    delete this.resendFeedback[tx.OrderId];

    this.apiService.sendPaymentConfirmation(tx.OrderId, true).subscribe({
      next: (res: any) => {
        this.resendingOrderIds.delete(tx.OrderId);
        tx.EmailSent = true;
        if (this.selectedTransaction?.OrderId === tx.OrderId) {
          this.selectedTransaction.EmailSent = true;
        }
        this.resendFeedback[tx.OrderId] = res?.message === 'payment not confirmed yet'
          ? 'Payment not confirmed yet — email not sent'
          : 'Email sent successfully';
        setTimeout(() => delete this.resendFeedback[tx.OrderId], 4000);
      },
      error: (err: any) => {
        this.resendingOrderIds.delete(tx.OrderId);
        this.resendFeedback[tx.OrderId] = 'Failed to send email';
        console.error('Error resending confirmation email:', err);
        setTimeout(() => delete this.resendFeedback[tx.OrderId], 4000);
      }
    });
  }

  isResending(orderId: string): boolean {
    return this.resendingOrderIds.has(orderId);
  }

  // ⭐⭐ חדש: state ולוגיקת עריכת transaction - Admin בלבד
  editingTransactionTarget: any = null;
  editTxFullName = '';
  editTxEmail = '';
  editTxConferenceId = '';
  editTxError = '';
  isSavingTransaction = false;

  openEditTransaction(tx: any): void {
    this.editingTransactionTarget = tx;
    this.editTxFullName = tx.FullName || '';
    this.editTxEmail = tx.Email || '';
    this.editTxConferenceId = tx.ConferenceId || '';
    this.editTxError = '';
  }

  closeEditTransaction(): void {
    this.editingTransactionTarget = null;
  }

  saveEditTransaction(): void {
    if (!this.editingTransactionTarget?.OrderId || this.isSavingTransaction) return;

    this.isSavingTransaction = true;
    this.editTxError = '';
    const target = this.editingTransactionTarget;

    const conf = this.allConferences.find(c => (c.Id || c.id) === this.editTxConferenceId);
    const conferenceName = conf ? (conf.Name || conf.name) : target.ConferenceName;

    this.apiService.updateTransaction(target.OrderId, {
      fullName: this.editTxFullName.trim(),
      email: this.editTxEmail.trim(),
      conferenceId: this.editTxConferenceId,
      conferenceName: conferenceName
    }).subscribe({
      next: () => {
        this.isSavingTransaction = false;
        target.FullName = this.editTxFullName.trim();
        target.Email = this.editTxEmail.trim();
        target.ConferenceId = this.editTxConferenceId;
        target.ConferenceName = conferenceName;
        if (this.selectedTransaction?.OrderId === target.OrderId) {
          this.selectedTransaction.FullName = target.FullName;
          this.selectedTransaction.Email = target.Email;
          this.selectedTransaction.ConferenceId = target.ConferenceId;
          this.selectedTransaction.ConferenceName = target.ConferenceName;
        }
        this.editingTransactionTarget = null;
      },
      error: (err) => {
        this.isSavingTransaction = false;
        console.error('Error updating transaction:', err);
        this.editTxError = 'Failed to update transaction';
      }
    });
  }

  get totalCount(): number { return this.filteredTransactions.length; }
  get successCount(): number { return this.filteredTransactions.filter(t => t.Status === 'success').length; }
  get failedCount(): number { return this.filteredTransactions.filter(t => t.Status === 'failed').length; }
  get pendingCount(): number { return this.filteredTransactions.filter(t => t.Status === 'pending').length; }
  get totalAmount(): number {
    return this.filteredTransactions
      .filter(t => t.Status === 'success')
      .reduce((sum, t) => sum + this.getAmount(t), 0);
  }

  get pagedTransactions(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTransactions.slice(start, start + this.pageSize);
  }
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredTransactions.length / this.pageSize));
  }
  get pageStart(): number {
    return this.filteredTransactions.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }
  get pageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredTransactions.length);
  }
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
  nextPage(): void { this.goToPage(this.currentPage + 1); }
  prevPage(): void { this.goToPage(this.currentPage - 1); }

  exportToCSV(): void {
    if (!this.filteredTransactions.length) {
      alert('No data to export');
      return;
    }
    const header = 'TxId,Full Name,Email,Conference,Status,Amount,Registration Date,Registration Id\n';
    const rows = this.filteredTransactions.map(tx => {
      const created = this.getDate(tx.CreatedAt);
      return [
        tx.TxId || '',
        tx.FullName || '',
        tx.Email || '',
        tx.ConferenceName || '',
        tx.Status || '',
        this.getAmount(tx),
        created ? new Date(created).toLocaleString('en-US') : '',
        tx.RegistrationId || ''
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    }).join('\n');
    const csvContent = '\uFEFF' + header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}