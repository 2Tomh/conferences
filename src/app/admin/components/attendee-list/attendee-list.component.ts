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

//   // פילטרים
//   searchTerm = '';
//   selectedConferenceId = '';
//   selectedPaymentStatus = '';

//   // מיון
//   sortField = 'registeredAt';
//   sortDir: 'asc' | 'desc' = 'desc';

//   // פרטי נרשם נבחר
//   selectedAttendee: any = null;

//   constructor(private apiService: ApiService) { }

//   ngOnInit(): void {
//     this.loadAttendees();
//     this.loadConferences();
//   }
//   // בקובץ ה-TS
//   exportToCSV() {
//     if (!this.filteredAttendees || this.filteredAttendees.length === 0) {
//       alert("אין נתונים לייצוא");
//       return;
//     }

//     // 1. הגדרת כותרות העמודות (אפשר להוסיף כאן את כל השדות)
//     const header = "שם מלא,אימייל,טלפון,מוסד,סטטוס תשלום,תאריך הרשמה\n";

//     // 2. מיפוי הנתונים - כאן הקסם: שימוש בשמות עם אותיות גדולות בדיוק כפי שהם ב-DB
//     const rows = this.filteredAttendees.map(a => {
//       return [
//         a.FullName,
//         a.Email,
//         a.Phone,
//         a.Institution || '—',
//         a.PaymentStatus === 'paid' ? 'שולם' : (a.PaymentStatus === 'pending' ? 'ממתין' : 'נכשל'),
//         a.RegisteredAt ? new Date(a.RegisteredAt).toLocaleString('he-IL') : ''
//       ].map(value => `"${value}"`).join(","); // הוספת גרשיים כדי למנוע בעיות עם פסיקים בטקסט
//     }).join("\n");

//     // 3. יצירת הקובץ עם תמיכה בעברית (UTF-8 BOM)
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
//   // loadAttendees() {
//   //   this.isLoading = true;
//   //   this.error = '';

//   //   this.apiService.getAllAttendees({
//   //     conferenceId: this.selectedConferenceId,
//   //     paymentStatus: this.selectedPaymentStatus,
//   //     search: this.searchTerm
//   //   }).subscribe({
//   //     next: (data) => {
//   //       this.attendees = data;
//   //       this.applyFilters();
//   //       this.isLoading = false;
//   //     },
//   //     error: (err) => {
//   //       this.error = 'שגיאה בטעינת נרשמים';
//   //       console.error(err);
//   //       this.isLoading = false;
//   //     }
//   //   });
//   // }
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
//         this.error = 'שגיאה בטעינת נרשמים';
//         console.error('שגיאה בקריאת ה-API:', err);
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
//         a.Institution?.toLowerCase().includes(t)
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

//   get paidCount() {
//     return this.filteredAttendees.filter(a => a.PaymentStatus === 'success').length;
//   }

//   get pendingCount() {
//     return this.filteredAttendees.filter(a => a.PaymentStatus === 'pending').length;
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

//   get totalCount() {
//     return this.filteredAttendees.length;
//   }

//   get withAbstractCount() {
//     const count = this.filteredAttendees.filter(a => {
//       const hasAbs = a.HasAbstract || a.hasAbstract;
//       return hasAbs === true;
//     }).length;

//     return count;
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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadAttendees();
    this.loadConferences();
  }

  exportToCSV() {
    if (!this.filteredAttendees || this.filteredAttendees.length === 0) {
      alert("אין נתונים לייצוא");
      return;
    }

    const header = "שם מלא,אימייל,טלפון,מוסד,סטטוס תשלום,תאריך הרשמה\n";

    const rows = this.filteredAttendees.map(a => {
      return [
        a.FullName,
        a.Email,
        a.Phone,
        a.Institution || '—',
        a.DisplayStatus || a.PaymentStatus,
        a.RegisteredAt ? new Date(a.RegisteredAt).toLocaleString('he-IL') : ''
      ].map(value => `"${value}"`).join(",");
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
        this.error = 'שגיאה בטעינת נרשמים';
        console.error('שגיאה בקריאת ה-API:', err);
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
        a.Institution?.toLowerCase().includes(t)
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
}