// // import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// // import { AuthService } from '../../services/auth.service';
// // import { ApiService } from '../../../services/api.service';
// // import { Router } from '@angular/router';

// // @Component({
// //   selector: 'app-create-user',
// //   templateUrl: './create-user.component.html',
// //   styleUrls: ['./create-user.component.css']
// // })
// // export class CreateUserComponent implements OnInit {
// //   userForm: FormGroup;
// //   departments: string[] = [];

// //   constructor(
// //     private fb: FormBuilder,
// //     private authService: AuthService,
// //     private apiService: ApiService,
// //     private router: Router
// //   ) {
// //     this.userForm = this.fb.group({
// //       fullName: ['', Validators.required], // נדרש ע"י השרת
// //       email: ['', [Validators.required, Validators.email]], // חובה ע"י השרת!
// //       password: ['', Validators.required],
// //       role: ['FacultyManager', Validators.required],
// //       departmentName: ['', Validators.required] // זה ה-Department שביקשת
// //     });
// //   }

// //   ngOnInit(): void {
// //     this.apiService.getDepartmentsLookup().subscribe({
// //       next: (data) => this.departments = data,
// //       error: (err) => console.error('שגיאה בטעינת מחלקות:', err)
// //     });
// //   }

// //   onSubmit(): void {
// //     if (this.userForm.valid) {
// //       // אובייקט ה-Payload חייב להתאים בדיוק למבנה של ה-Admin class ב-Backend
// //       const payload = {
// //         FullName: this.userForm.value.fullName,
// //         Email: this.userForm.value.email,
// //         Password: this.userForm.value.password,
// //         Role: this.userForm.value.role,
// //         // השדה הזה חייב להיות FacultyName כי ככה הוא מוגדר במודל Admin.cs שלך
// //         FacultyName: this.userForm.value.role === 'FacultyManager' ? this.userForm.value.departmentName : null
// //       };

// //       this.authService.createUser(payload).subscribe({
// //         next: () => {
// //           alert('המשתמש נוצר בהצלחה');
// //           this.router.navigate(['/admin/users']);
// //         },
// //         error: (err) => {
// //           console.error('שגיאה ביצירת משתמש:', err);
// //           alert('שגיאה ביצירת משתמש: ' + (err.error?.message || err.error || 'נכשל'));
// //         }
// //       });
// //     }
// //   }
// // }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { ApiService } from '../../../services/api.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-create-user',
//   templateUrl: './create-user.component.html',
//   styleUrls: ['./create-user.component.css']
// })
// export class CreateUserComponent implements OnInit {
//   userForm: FormGroup;
//   departments: string[] = [];
//   allConferences: any[] = [];      // כל הכנסים מהשרת
//   filteredConferences: any[] = []; // הכנסים המסוננים לפי מחלקה

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private apiService: ApiService,
//     private router: Router
//   ) {
//     this.userForm = this.fb.group({
//       fullName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       role: ['FacultyManager', Validators.required],
//       departmentName: [''], 
//       conferenceId: ['']    
//     });
//   }

//   ngOnInit(): void {
//     // טעינת מחלקות
//     this.apiService.getDepartmentsLookup().subscribe({
//       next: (data) => this.departments = data,
//       error: (err) => console.error('שגיאה בטעינת מחלקות:', err)
//     });

//     // טעינת כל הכנסים
//     this.apiService.getSurveys().subscribe({
//       next: (data) => {
//         this.allConferences = data;
//         this.filteredConferences = data;
//       },
//       error: (err) => console.error('שגיאה בטעינת כנסים:', err)
//     });

//     // האזנה לשינויים בבחירת מחלקה
//     this.userForm.get('departmentName')?.valueChanges.subscribe(dept => {
//       this.filterConferences(dept);
//     });
//   }

//   filterConferences(deptName: string): void {
//     if (!deptName) {
//       this.filteredConferences = this.allConferences;
//     } else {
//       // סינון לפי קטגוריה (בהנחה ש-Category הוא שם הפקולטה ב-Survey)
//       this.filteredConferences = this.allConferences.filter(
//         c => c.Category === deptName || c.category === deptName
//       );
//     }
//     this.userForm.patchValue({ conferenceId: '' }, { emitEvent: false });
//   }

//   onSubmit(): void {
//     if (this.userForm.valid) {
//       const payload = {
//         FullName: this.userForm.value.fullName,
//         Email: this.userForm.value.email,
//         Password: this.userForm.value.password,
//         Role: this.userForm.value.role,
//         FacultyName: this.userForm.value.departmentName,
//         ManagedConferenceId: this.userForm.value.conferenceId
//       };

//       this.authService.createUser(payload).subscribe({
//         next: () => {
//           alert('המשתמש נוצר בהצלחה');
//           this.router.navigate(['/admin/users']);
//         },
//         error: (err) => alert('שגיאה ביצירת משתמש: ' + (err.error?.message || 'נכשל'))
//       });
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  departments: string[] = [];
  allConferences: any[] = [];

  // רשימת כנסים מסוננת בנפרד לכל שורת שיוך (אינדקס = מיקום השורה ב-FormArray)
  filteredConferencesByRow: any[][] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['FacultyManager', Validators.required],
      assignments: this.fb.array([])
    });
  }

  get assignments(): FormArray {
    return this.userForm.get('assignments') as FormArray;
  }

  ngOnInit(): void {
    this.apiService.getDepartmentsLookup().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('שגיאה בטעינת מחלקות:', err)
    });

    this.apiService.getSurveys().subscribe({
      next: (data) => { this.allConferences = data; },
      error: (err) => console.error('שגיאה בטעינת כנסים:', err)
    });

    // שורת שיוך ראשונה כברירת מחדל
    this.addAssignment();

    // אם עוברים ל-Admin ואז חוזרים ל-FacultyManager בלי אף שורה - נוסיף אחת
    this.userForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'FacultyManager' && this.assignments.length === 0) {
        this.addAssignment();
      }
    });
  }

  addAssignment(): void {
    const group = this.fb.group({
      facultyName: ['', Validators.required],
      conferenceId: ['', Validators.required]
    });

    const index = this.assignments.length;
    this.filteredConferencesByRow[index] = this.allConferences;

    group.get('facultyName')?.valueChanges.subscribe(faculty => {
      this.filteredConferencesByRow[index] = faculty
        ? this.allConferences.filter(c => (c.Category || c.category) === faculty)
        : this.allConferences;
      group.patchValue({ conferenceId: '' }, { emitEvent: false });
    });

    this.assignments.push(group);
  }

  removeAssignment(index: number): void {
    this.assignments.removeAt(index);
    this.filteredConferencesByRow.splice(index, 1);
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const role = this.userForm.value.role;

    const payload = {
      FullName: this.userForm.value.fullName,
      Email: this.userForm.value.email,
      Password: this.userForm.value.password,
      Role: role,
      // מערך שיוכים - פקולטה + כנס לכל שורה. ריק עבור Admin.
      // ⚠️ דורש עדכון מקביל במודל ה-User/Admin בבקאנד (ראה הסבר מטה)
      ManagedAssignments: role === 'FacultyManager'
        ? this.assignments.value.map((a: any) => ({
            FacultyName: a.facultyName,
            ConferenceId: a.conferenceId
          }))
        : []
    };

    this.authService.createUser(payload).subscribe({
      next: () => {
        alert('המשתמש נוצר בהצלחה');
        this.router.navigate(['/admin/users']);
      },
      error: (err) => alert('שגיאה ביצירת משתמש: ' + (err.error?.message || 'נכשל'))
    });
  }
}