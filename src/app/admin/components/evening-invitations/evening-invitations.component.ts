import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

// ⭐ חדש: עמוד הניהול של ההזמנות לאירוע הערב.
// כאן המארגן בוחר מתוך מי ששמר לו מקום (Reserve בעמוד Attendees),
// קובע עד מתי אפשר לענות, ושולח באצ' של הזמנות במייל.
@Component({
  selector: 'app-evening-invitations',
  templateUrl: './evening-invitations.component.html',
  styleUrls: ['./evening-invitations.component.css']
})
export class EveningInvitationsComponent implements OnInit {

  isLoading = false;
  isSending = false;
  error = '';
  resultMessage = '';
  resultDetails: string[] = [];

  isAdmin = false;
  quota: number | null = null;
  reservedSeats = 0;
  confirmed = 0;
  awaiting = 0;
  declined = 0;
  expired = 0;

  all: any[] = [];
  readyToInvite: any[] = [];
  invited: any[] = [];

  selectedIds = new Set<string>();
  deadline = '';          // datetime-local (שעון מקומי)
  message = '';

  statusFilter = '';      // '' | invited | attending | declined | expired

  // ⭐ חדש: חיפוש ו-pagination לשתי הטבלאות
  readonly pageSize = 15;
  readySearch = '';
  readyPage = 1;
  invitedSearch = '';
  invitedPage = 1;

  // ⭐ חדש: מיון לפי עמודה (לחיצה על כותרת: עולה ← יורד)
  readySortKey = '';
  readySortDir: 1 | -1 = 1;
  invitedSortKey = '';
  invitedSortDir: 1 | -1 = 1;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.deadline = this.toLocalInput(new Date(Date.now() + 48 * 60 * 60 * 1000));
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.error = '';
    this.api.getEveningInvitations().subscribe({
      next: (res) => {
        this.isAdmin = !!res?.IsAdmin;
        this.quota = res?.Quota ?? null;
        this.reservedSeats = res?.ReservedSeats ?? 0;
        this.confirmed = res?.Confirmed ?? 0;
        this.awaiting = res?.Awaiting ?? 0;
        this.declined = res?.Declined ?? 0;
        this.expired = res?.Expired ?? 0;

        this.all = res?.Attendees || [];
        this.readyToInvite = this.all.filter(a => a.HasReservedSeat && !a.EveningInviteStatus);
        this.invited = this.all.filter(a => !!a.EveningInviteStatus);

        // אחרי טעינה מחדש (למשל אחרי שליחה) לא נשארים על עמוד שכבר לא קיים
        this.readyPage = Math.min(this.readyPage, Math.max(1, Math.ceil(this.filteredReady.length / this.pageSize)));
        this.invitedPage = Math.min(this.invitedPage, Math.max(1, Math.ceil(this.filteredInvited.length / this.pageSize)));

        // מנקים בחירות של אנשים שכבר לא ברשימה
        const readyIds = new Set(this.readyToInvite.map(a => a.Id));
        this.selectedIds.forEach(id => { if (!readyIds.has(id)) this.selectedIds.delete(id); });

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err?.error?.message || `Failed to load invitations (HTTP ${err?.status ?? '?'})`;
      }
    });
  }

  // ---------- בחירה ----------
  isSelected(a: any): boolean { return this.selectedIds.has(a.Id); }

  toggle(a: any): void {
    if (this.selectedIds.has(a.Id)) this.selectedIds.delete(a.Id);
    else this.selectedIds.add(a.Id);
  }

  // ---------- טבלת "Send a new batch": חיפוש + עמודים ----------
  private matches(a: any, term: string): boolean {
    if (!term) return true;
    const t = term.trim().toLowerCase();
    return (a.FullName || '').toLowerCase().includes(t)
      || (a.Email || '').toLowerCase().includes(t)
      || (a.ConferenceName || '').toLowerCase().includes(t);
  }

  get filteredReady(): any[] {
    const rows = this.readyToInvite.filter(a => this.matches(a, this.readySearch));
    return this.sortRows(rows, this.readySortKey, this.readySortDir);
  }

  get readyTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredReady.length / this.pageSize));
  }

  get pagedReady(): any[] {
    const page = Math.min(this.readyPage, this.readyTotalPages);
    const start = (page - 1) * this.pageSize;
    return this.filteredReady.slice(start, start + this.pageSize);
  }

  onReadySearch(): void { this.readyPage = 1; }

  // הצ'קבוקס בכותרת מסמן / מבטל את השורות שבעמוד הנוכחי
  get pageAllSelected(): boolean {
    const rows = this.pagedReady;
    return rows.length > 0 && rows.every(a => this.selectedIds.has(a.Id));
  }

  togglePage(): void {
    const rows = this.pagedReady;
    if (this.pageAllSelected) rows.forEach(a => this.selectedIds.delete(a.Id));
    else rows.forEach(a => this.selectedIds.add(a.Id));
  }

  // בחירת כל מי שמתאים לחיפוש (בכל העמודים)
  selectAllFiltered(): void {
    this.filteredReady.forEach(a => this.selectedIds.add(a.Id));
  }

  clearSelection(): void {
    this.selectedIds.clear();
  }

  // ---------- שליחה ----------
  get deadlineIsValid(): boolean {
    if (!this.deadline) return false;
    const d = new Date(this.deadline);
    return !isNaN(d.getTime()) && d.getTime() > Date.now() + 10 * 60 * 1000;
  }

  get canSend(): boolean {
    return !this.isSending && !this.isPreapproving && this.selectedIds.size > 0 && this.deadlineIsValid;
  }

  send(): void {
    if (!this.canSend) return;
    const count = this.selectedIds.size;
    const when = new Date(this.deadline).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (!confirm(`Send ${count} invitation(s)?\nResponse deadline: ${when}`)) return;

    this.isSending = true;
    this.resultMessage = '';
    this.resultDetails = [];
    this.error = '';

    this.api.sendEveningInvitations({
      attendeeIds: Array.from(this.selectedIds),
      deadline: new Date(this.deadline).toISOString(),
      message: this.message?.trim() || undefined
    }).subscribe({
      next: (res) => {
        this.isSending = false;
        this.resultMessage = res?.message || 'Invitations sent.';
        (res?.failed || []).forEach((f: any) => this.resultDetails.push(`Failed: ${f.FullName} (${f.Email})`));
        (res?.skipped || []).forEach((s: any) => this.resultDetails.push(`Skipped: ${s.FullName} – ${s.Reason}`));
        this.selectedIds.clear();
        this.message = '';
        this.load();
      },
      error: (err) => {
        this.isSending = false;
        this.error = err?.error?.message || 'Failed to send invitations';
        (err?.error?.skipped || []).forEach((s: any) => this.resultDetails.push(`Skipped: ${s.FullName} – ${s.Reason}`));
      }
    });
  }

  // ---------- ⭐ חדש: אישור הגעה מראש בלי מייל (אדמין ראשי בלבד) ----------
  isPreapproving = false;

  get canPreapprove(): boolean {
    return this.isAdmin && !this.isPreapproving && !this.isSending && this.selectedIds.size > 0;
  }

  preapprove(): void {
    if (!this.canPreapprove) return;
    const count = this.selectedIds.size;
    if (!confirm(`Confirm ${count} attendee(s) for the evening event WITHOUT sending an email?\n\nThey will appear as Confirmed right away.`)) return;

    this.isPreapproving = true;
    this.resultMessage = '';
    this.resultDetails = [];
    this.error = '';

    this.api.preapproveEvening(Array.from(this.selectedIds)).subscribe({
      next: (res) => {
        this.isPreapproving = false;
        this.resultMessage = res?.message || 'Attendees confirmed.';
        (res?.skipped || []).forEach((s: any) => this.resultDetails.push(`Skipped: ${s.FullName} – ${s.Reason}`));
        this.selectedIds.clear();
        this.load();
      },
      error: (err) => {
        this.isPreapproving = false;
        this.error = err?.error?.message || 'Failed to confirm attendees';
      }
    });
  }

  // מי שאושר מראש (בלי מייל) - אין לו מועד אחרון
  rowStatusLabel(a: any): string {
    if (a.EveningInviteStatus === 'attending' && !a.EveningInviteDeadline) return 'Confirmed (no email)';
    return this.statusLabel(a.EveningInviteStatus);
  }

  // ---------- ⭐ חדש: שינוי ידני של תשובה (אדמין ראשי בלבד) ----------
  overridingIds = new Set<string>();

  overrideResponse(a: any, status: 'attending' | 'declined'): void {
    if (!this.isAdmin || this.overridingIds.has(a.Id)) return;

    const text = status === 'attending'
      ? `Mark ${a.FullName} as ATTENDING?\n\nA seat will be reserved for them.`
      : `Mark ${a.FullName} as NOT ATTENDING?\n\nTheir seat will be released.`;
    if (!confirm(text)) return;

    this.overridingIds.add(a.Id);
    this.error = '';
    this.api.overrideEveningResponse(a.Id, status).subscribe({
      next: () => {
        this.overridingIds.delete(a.Id);
        this.resultMessage = `${a.FullName} was updated to "${this.statusLabel(status)}".`;
        this.resultDetails = [];
        this.load();
      },
      error: (err) => {
        this.overridingIds.delete(a.Id);
        this.error = err?.error?.message || 'Failed to update the response';
      }
    });
  }

  // ---------- טבלת ההזמנות: סטטוס + חיפוש + עמודים ----------
  get filteredInvited(): any[] {
    const rows = this.invited.filter(a =>
      (!this.statusFilter || a.EveningInviteStatus === this.statusFilter)
      && this.matches(a, this.invitedSearch));
    return this.sortRows(rows, this.invitedSortKey, this.invitedSortDir);
  }

  get invitedTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredInvited.length / this.pageSize));
  }

  get pagedInvited(): any[] {
    const page = Math.min(this.invitedPage, this.invitedTotalPages);
    const start = (page - 1) * this.pageSize;
    return this.filteredInvited.slice(start, start + this.pageSize);
  }

  setFilter(s: string): void { this.statusFilter = s; this.invitedPage = 1; }

  onInvitedSearch(): void { this.invitedPage = 1; }

  // ---------- ⭐ חדש: מיון ----------
  private readonly dateKeys = ['EveningInvitedAt', 'EveningInviteDeadline', 'EveningRespondedAt'];
  private readonly statusOrder: { [k: string]: number } = { attending: 1, invited: 2, declined: 3, expired: 4 };

  private sortValue(a: any, key: string): any {
    const v = a[key];
    if (this.dateKeys.indexOf(key) >= 0) return v ? new Date(v).getTime() : null;
    if (key === 'EveningInviteStatus') return this.statusOrder[v] || 99;
    return v ? String(v).toLowerCase() : null;
  }

  private sortRows(rows: any[], key: string, dir: number): any[] {
    if (!key) return rows;
    return rows.slice().sort((x, y) => {
      const a = this.sortValue(x, key);
      const b = this.sortValue(y, key);
      // ערכים ריקים תמיד בסוף
      if (a === null && b === null) return 0;
      if (a === null) return 1;
      if (b === null) return -1;
      if (typeof a === 'number' && typeof b === 'number') return (a - b) * dir;
      return String(a).localeCompare(String(b)) * dir;
    });
  }

  sortReady(key: string): void {
    if (this.readySortKey === key) this.readySortDir = this.readySortDir === 1 ? -1 : 1;
    else { this.readySortKey = key; this.readySortDir = 1; }
    this.readyPage = 1;
  }

  sortInvited(key: string): void {
    if (this.invitedSortKey === key) this.invitedSortDir = this.invitedSortDir === 1 ? -1 : 1;
    else { this.invitedSortKey = key; this.invitedSortDir = 1; }
    this.invitedPage = 1;
  }

  sortIcon(currentKey: string, dir: number, key: string): string {
    if (currentKey !== key) return '↕';
    return dir === 1 ? '▲' : '▼';
  }

  // ---------- עזר ל-pagination ----------
  pageNumbers(current: number, total: number): number[] {
    const pages: number[] = [];
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) pages.push(i);
    return pages;
  }

  rangeStart(page: number, count: number): number {
    return count === 0 ? 0 : (page - 1) * this.pageSize + 1;
  }

  rangeEnd(page: number, count: number): number {
    return Math.min(page * this.pageSize, count);
  }

  statusLabel(s: string): string {
    switch (s) {
      case 'invited': return 'Awaiting reply';
      case 'attending': return 'Confirmed';
      case 'declined': return 'Declined';
      case 'expired': return 'No reply (expired)';
      default: return '—';
    }
  }

  private toLocalInput(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}