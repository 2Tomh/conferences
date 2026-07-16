// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../../../services/api.service';
// @Component({
//   selector: 'app-attendee-list',
//   templateUrl: './attendee-list.component.html',
//   styleUrls: ['./attendee-list.component.css']
// })
// export class AttendeeListComponent implements OnInit {
//   attendees: any[] = [];
//   filteredAttendees: any[] = [];
//   allConferences: any[] = [];
//   isLoading = false;
//   error = '';
//   searchTerm = '';
//   selectedConferenceId = '';
//   selectedPaymentStatus = '';
//   sortField = 'RegisteredAt';
//   sortDir: 'asc' | 'desc' = 'desc';
//   selectedAttendee: any = null;
//   selectedAbstractAttendee: any = null;
//   constructor(private apiService: ApiService) { }
//   ngOnInit(): void {
//     this.loadAttendees();
//     this.loadConferences();
//   }
//   exportToCSV() {
//     if (!this.filteredAttendees || this.filteredAttendees.length === 0) {
//       alert("No data to export");
//       return;
//     }
//     // ⭐ עודכן: הוספת עמודות Conference ו-Abstract Submitted, כדי שה-CSV
//     // יכיל בדיוק את כל העמודות שמופיעות בטבלה באתר, לא רק חלק מהן
//     const header = "Full Name,Email,Affiliation,Address,Role,Conference,Abstract Submitted,Payment Status,Amount Paid,Registration Date\n";
//     const rows = this.filteredAttendees.map(a => {
//       const hasAbstract = (a.HasAbstract === true || a.hasAbstract === true) ? 'Yes' : 'No';
//       return [
//         a.FullName,
//         a.Email,
//         a.Affiliation || '—',
//         a.Address || '—',
//         a.Role || a.role || '—',
//         a.ConferenceName || '—', // ⭐ חדש
//         hasAbstract,             // ⭐ חדש
//         a.DisplayStatus || a.PaymentStatus,
//         (a.Amount || a.amount || 0) + ' ₪',
//         a.RegisteredAt ? new Date(a.RegisteredAt).toLocaleString('en-US') : ''
//       ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(",");
//     }).join("\n");
//     const csvContent = "\uFEFF" + header + rows;
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", "attendees.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
//   // ⭐ ייצוא נפרד שמכיל רק את הנרשמים שהגישו תקציר, עם עמודות
//   // ממוקדות להשוואה נוחה (שם, שיוך, כותרת, גוף, הערות) - בלי עמודות
//   // תשלום/הרשמה שלא רלוונטיות כשמשווים בין תקצירים.
//   exportAbstractsToCSV() {
//     const withAbstracts = this.filteredAttendees.filter(
//       a => a.HasAbstract === true || a.hasAbstract === true
//     );

//     if (!withAbstracts || withAbstracts.length === 0) {
//       alert("No abstracts to export");
//       return;
//     }

//     const header = "Full Name,Affiliation,Conference,Abstract Title,Abstract Body,Additional Notes\n";
//     const rows = withAbstracts.map(a => {
//       return [
//         a.FullName,
//         a.Affiliation || a.affiliation || '—',
//         a.ConferenceName || '—',
//         a.AbstractTitle || a.abstractTitle || '',
//         a.AbstractBody || a.abstractBody || '',
//         a.AbstractNotes || a.abstractNotes || ''
//       ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(",");
//     }).join("\n");

//     const csvContent = "\uFEFF" + header + rows;
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", "abstracts.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }
//   loadAttendees() {
//     this.isLoading = true;
//     this.error = '';
//     this.apiService.getAllAttendees({
//       conferenceId: this.selectedConferenceId,
//       paymentStatus: this.selectedPaymentStatus,
//       search: this.searchTerm
//     }).subscribe({
//       next: (data) => {
//         this.attendees = data;
//         this.applyFilters();
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.error = 'Error loading attendees';
//         console.error('Error calling the API:', err);
//         this.isLoading = false;
//       }
//     });
//   }
//   loadConferences() {
//     this.apiService.getAllConferences().subscribe({
//       next: (data) => this.allConferences = data,
//       error: () => { }
//     });
//   }
//   applyFilters() {
//     let list = [...this.attendees];
//     if (this.searchTerm) {
//       const t = this.searchTerm.toLowerCase();
//       list = list.filter(a =>
//         a.FullName?.toLowerCase().includes(t) ||
//         a.Email?.toLowerCase().includes(t) ||
//         a.Affiliation?.toLowerCase().includes(t)
//       );
//     }
//     if (this.selectedConferenceId)
//       list = list.filter(a => a.ConferenceId === this.selectedConferenceId);
//     if (this.selectedPaymentStatus)
//       list = list.filter(a => a.PaymentStatus === this.selectedPaymentStatus);
//     list.sort((a, b) => {
//       const av = a[this.sortField] ?? '';
//       const bv = b[this.sortField] ?? '';
//       return this.sortDir === 'asc'
//         ? av > bv ? 1 : -1
//         : av < bv ? 1 : -1;
//     });
//     this.filteredAttendees = list;
//   }
//   onSearch() { this.applyFilters(); }
//   onFilterChange() { this.loadAttendees(); }
//   sortBy(field: string) {
//     if (this.sortField === field)
//       this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
//     else {
//       this.sortField = field;
//       this.sortDir = 'asc';
//     }
//     this.applyFilters();
//   }
//   openDetails(attendee: any) { this.selectedAttendee = attendee; }
//   closeDetails() { this.selectedAttendee = null; }
//   // openAbstractDetails(attendee: any) { this.selectedAbstractAttendee = attendee; }
//   openAbstractDetails(attendee: any) {
//     console.log('Attendee data:', attendee); // זמני - לבדיקה
//     this.selectedAbstractAttendee = attendee;
//   }
//   closeAbstractDetails() { this.selectedAbstractAttendee = null; }
//   get totalCount() {
//     return this.filteredAttendees.length;
//   }
//   get paidCount() {
//     return this.filteredAttendees.filter(a => a.PaymentStatus === 'success').length;
//   }
//   get pendingCount() {
//     return this.filteredAttendees.filter(a => a.PaymentStatus === 'pending').length;
//   }
//   get failedCount() {
//     return this.filteredAttendees.filter(a => a.PaymentStatus === 'failed').length;
//   }
//   get withAbstractCount() {
//     return this.filteredAttendees.filter(a => a.HasAbstract === true || a.hasAbstract === true).length;
//   }
// }

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

  // ⭐ חדש: מצב ה-pagination
  currentPage = 1;
  pageSize = 15;

  constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    this.loadAttendees();
    this.loadConferences();
  }
  exportToCSV() {
    if (!this.filteredAttendees || this.filteredAttendees.length === 0) {
      alert("No data to export");
      return;
    }
    // ⭐ עודכן: הוספת עמודות Conference ו-Abstract Submitted, כדי שה-CSV
    // יכיל בדיוק את כל העמודות שמופיעות בטבלה באתר, לא רק חלק מהן
    // הערה: הייצוא ל-CSV תמיד מייצא את כל filteredAttendees (כל התוצאות
    // המסוננות), לא רק את העמוד הנוכחי המוצג על המסך.
    const header = "Full Name,Email,Affiliation,Address,Role,Conference,Abstract Submitted,Payment Status,Amount Paid,Registration Date\n";
    const rows = this.filteredAttendees.map(a => {
      const hasAbstract = (a.HasAbstract === true || a.hasAbstract === true) ? 'Yes' : 'No';
      return [
        a.FullName,
        a.Email,
        a.Affiliation || '—',
        a.Address || '—',
        a.Role || a.role || '—',
        a.ConferenceName || '—', // ⭐ חדש
        hasAbstract,             // ⭐ חדש
        a.DisplayStatus || a.PaymentStatus,
        (a.Amount || a.amount || 0) + ' ₪',
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
  // ⭐ ייצוא נפרד שמכיל רק את הנרשמים שהגישו תקציר, עם עמודות
  // ממוקדות להשוואה נוחה (שם, שיוך, כותרת, גוף, הערות) - בלי עמודות
  // תשלום/הרשמה שלא רלוונטיות כשמשווים בין תקצירים.
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
    // ⭐ חדש: בכל פעם שהרשימה המסוננת משתנה (חיפוש/פילטר/מיון) חוזרים לעמוד 1,
    // כדי לא להישאר "תקועים" על עמוד שכבר לא קיים בתוצאה החדשה.
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
  // openAbstractDetails(attendee: any) { this.selectedAbstractAttendee = attendee; }
  openAbstractDetails(attendee: any) {
    console.log('Attendee data:', attendee); // זמני - לבדיקה
    this.selectedAbstractAttendee = attendee;
  }
  closeAbstractDetails() { this.selectedAbstractAttendee = null; }
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

  // ⭐⭐⭐ חדש: כל לוגיקת ה-pagination ⭐⭐⭐

  // מחזיר רק את פרוסת הנתונים של העמוד הנוכחי, לפי גודל עמוד (pageSize)
  get pagedAttendees() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAttendees.slice(start, start + this.pageSize);
  }

  // סה"כ עמודים, לפי כמות התוצאות המסוננות וגודל העמוד (מינימום 1 כדי למנוע 0 עמודים)
  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredAttendees.length / this.pageSize));
  }

  // מספר הרשומה הראשונה המוצגת בעמוד הנוכחי (לתצוגה "Showing X-Y of Z")
  get pageStart() {
    return this.filteredAttendees.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  // מספר הרשומה האחרונה המוצגת בעמוד הנוכחי
  get pageEnd() {
    return Math.min(this.currentPage * this.pageSize, this.filteredAttendees.length);
  }

  // רשימת מספרי העמודים המוצגים כפתורים (חלון של 2 עמודים לפני/אחרי הנוכחי)
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