// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { ApiService } from '../../../services/api.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {
//   loginForm!: FormGroup;
//   errorMessage: string = '';

//   departments: any[] = [];
//   faculties: string[] = [];
//   filteredDepartments: any[] = [];
//   selectedFaculty: string = '';

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private apiService: ApiService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     this.loginForm = this.fb.group({
//       username: ['', [Validators.required]],
//       password: ['', [Validators.required]],
//       isSuperAdmin: [false],
//       departmentId: ['', [Validators.required]]
//     });

//     this.apiService.getDepartmentsLookup().subscribe({
//       next: (data: any[]) => {
//         console.log('נתונים גולמיים:', data);
//         this.departments = data;

//         // חילוץ שם הפקולטה (החלק שלפני המקף)
//         this.faculties = [...new Set(data.map(d => {
//           if (d.displayName && d.displayName.includes(' - ')) {
//             return d.displayName.split(' - ')[0].trim();
//           }
//           return d.displayName; // למקרה שאין מקף
//         }))].sort();

//         console.log('פקולטות שחולצו:', this.faculties);
//       },
//       error: (err) => console.error('שגיאת API:', err)
//     });
//   }

//   onFacultyChange(event: any) {
//     this.selectedFaculty = event.target.value;

//     if (this.selectedFaculty) {
//       // סינון כל המחלקות שמתחילות בשם הפקולטה שנבחרה
//       this.filteredDepartments = this.departments.filter(d =>
//         d.displayName && d.displayName.startsWith(this.selectedFaculty)
//       );
//     } else {
//       this.filteredDepartments = [];
//     }
//     this.loginForm.patchValue({ departmentId: '' });
//   }
//   onLogin() {
//     if (this.loginForm.valid) {
//       this.authService.login(this.loginForm.value).subscribe({
//         next: () => this.router.navigate(['/admin/dashboard']),
//         error: (err) => this.errorMessage = 'שגיאת התחברות'
//       });
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // השדות בטופס ה-HTML נשארים באותיות קטנות (סטנדרט של אנגולר)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      
      // מיפוי קריטי: הופכים את הנתונים ל-PascalCase עבור השרת ב-C#
      const payload = {
        Email: this.loginForm.value.email,      // E גדולה
        Password: this.loginForm.value.password // P גדולה
      };

      console.log('שולח נתוני התחברות לשרת:', payload);

      this.authService.login(payload).subscribe({
        next: (response) => {
          console.log('התחברות הצליחה!', response);
          // ניווט מוחלט ישירות לדשבורד
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = 'אימייל או סיסמה שגויים';
        }
      });
    }
  }
}