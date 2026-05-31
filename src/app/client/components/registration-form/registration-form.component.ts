// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ApiService } from '../../../services/api.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-registration-form',
//   templateUrl: './registration-form.component.html',
//   styleUrls: ['./registration-form.component.css']
// })
// export class RegistrationFormComponent implements OnInit {
//   regForm!: FormGroup;
//   allConferences: any[] = [];
//   departments: string[] = [];
//   filteredConferences: any[] = [];
//   availableSessions: any[] = [];
//   isLoading: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private apiService: ApiService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     this.initForm();
//     this.loadInitialData();
//   }

//   initForm() {
//     this.regForm = this.fb.group({
//       department: ['', Validators.required],
//       conferenceId: ['', Validators.required],
//       sessionId: ['', Validators.required],
//       fullName: ['', [Validators.required, Validators.minLength(2)]],
//       email: ['', [Validators.required, Validators.email]]
//     });
//   }

//   loadInitialData() {
//     // השתמשתי ב-getAllConferences כפי שמוגדר ב-Service שלך
//     this.apiService.getAllConferences().subscribe(data => {
//       this.allConferences = data;
//       // פתרון שגיאת TS2322: המרה מפורשת ל-string
//       const locations = data.map((c: any) => (c.location || 'כללי') as string);
//       this.departments = [...new Set(locations)];
//     });
//   }

//   onDepartmentChange() {
//     const dept = this.regForm.get('department')?.value;
//     this.filteredConferences = this.allConferences.filter(c => c.location === dept);
//     this.regForm.patchValue({ conferenceId: '', sessionId: '' });
//   }

//   onConferenceChange() {
//     const confId = this.regForm.get('conferenceId')?.value;
//     const selectedConf = this.allConferences.find(c => c.id === confId || c._id === confId);
//     this.availableSessions = selectedConf ? selectedConf.sessions : [];
//     this.regForm.patchValue({ sessionId: '' });
//   }

//   onSubmit() {
//     if (this.regForm.invalid) return;

//     this.apiService.registerToSession(this.regForm.value).subscribe({
//       next: () => {
//         alert('נרשמת בהצלחה!');
//         this.router.navigate(['/']);
//       },
//       error: (err) => alert(err.error || 'שגיאה ברישום')
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  regForm!: FormGroup;
  allConferences: any[] = [];
  departments: string[] = [];
  filteredConferences: any[] = [];
  availableSessions: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  initForm() {
    this.regForm = this.fb.group({
      department: ['', Validators.required],
      conferenceId: ['', Validators.required],
      sessionId: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadInitialData() {
    this.isLoading = true;
    this.apiService.getAllConferences().subscribe({
      next: (data) => {
        this.allConferences = data;
        const locations = data.map((c: any) => (c.location || 'כללי') as string);
        this.departments = [...new Set(locations)];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('שגיאה בטעינת נתונים', err);
        this.isLoading = false;
      }
    });
  }

  onDepartmentChange() {
    const dept = this.regForm.get('department')?.value;
    this.filteredConferences = this.allConferences.filter(c => c.location === dept);
    // איפוס שדות תלויים כדי למנוע סתירות
    this.regForm.patchValue({ conferenceId: '', sessionId: '' });
    this.availableSessions = [];
  }

  onConferenceChange() {
    const confId = this.regForm.get('conferenceId')?.value;
    const selectedConf = this.allConferences.find(c => (c.id || c._id) === confId);
    this.availableSessions = selectedConf?.sessions || [];
    this.regForm.patchValue({ sessionId: '' });
  }

  onSubmit() {
    if (this.regForm.invalid) { return; }

    // שליחת אובייקט נקי לשרת
    const payload = {
      sessionId: this.regForm.value.sessionId,
      fullName: this.regForm.value.fullName,
      email: this.regForm.value.email
    };

    this.apiService.registerToSession(payload).subscribe({
      next: () => {
        alert('נרשמת בהצלחה!');
        this.router.navigate(['/']);
      },
      error: (err) => alert(err.error?.message || 'שגיאה בביצוע הרישום')
    });
  }
}
