// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { ApiService } from '../../../services/api.service';
// @Component({
//   selector: 'app-user-management',
//   templateUrl: './user-management.component.html',
//   styleUrls: ['./user-management.component.css']
// })
// export class UserManagementComponent implements OnInit {
//   users: any[] = [];
//   editingUser: any = null;
//   editForm!: FormGroup;
//   isCreateModalOpen = false;
//   faculties: string[] = [];
//   roles = ['Admin', 'FacultyManager', 'Lecturer'];
//   constructor(
//     private authService: AuthService,
//     private fb: FormBuilder,
//     private apiService: ApiService,
//   ) { }
//   ngOnInit(): void {
//     this.loadUsers();
//     this.loadFaculties();
//   }
//   loadUsers(): void {
//     this.authService.getAllUsers().subscribe({
//       next: (data) => {
//         this.users = data;
//       },
//       error: (err) => console.error('Error:', err)
//     });
//   }
//   startEdit(user: any): void {
//     this.editingUser = user;
//     this.editForm = this.fb.group({
//       fullName: [user.FullName, Validators.required],
//       email: [user.Email, [Validators.required, Validators.email]],
//       role: [user.Role, Validators.required],
//       facultyName: [user.FacultyName || ''],
//       password: ['']
//     });
//   }
//   cancelEdit(): void {
//     this.editingUser = null;
//   }
//   saveEdit(): void {
//     if (!this.editingUser) {
//       console.error('No user is being edited!');
//       return;
//     }
//     const userId = this.editingUser.Id || this.editingUser.id || this.editingUser.ID;
//     if (!userId) {
//       alert('Error: could not find the user ID. Check the Console to see how the field is named on the object!');
//       return;
//     }
//     if (this.editForm.invalid) {
//       alert('The form is invalid');
//       return;
//     }
//     this.authService.updateUser(userId, this.editForm.value).subscribe({
//       next: () => {
//         alert('User updated successfully');
//         this.editingUser = null;
//         this.loadUsers();
//       },
//       error: (err) => {
//         console.error('Update error:', err);
//       }
//     });
//   }
//   deleteUser(id: string): void {
//     if (!confirm('Are you sure you want to delete this user?')) { return; }
//     this.authService.deleteUser(id).subscribe({
//       next: () => this.loadUsers(),
//       error: (err) => alert('Error deleting: ' + err.error)
//     });
//   }
//   openCreateModal() {
//     this.isCreateModalOpen = true;
//   }
//   closeCreateModal() {
//     this.isCreateModalOpen = false;
//   }
//   loadFaculties(): void {
//     this.apiService.getFaculties().subscribe({
//       next: (data) => {
//         // Assuming data is an object whose keys are the faculty names
//         this.faculties = Object.keys(data);
//       },
//       error: (err) => console.error('Error loading faculties:', err)
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  editingUser: any = null;
  editForm!: FormGroup;
  isCreateModalOpen = false;
  faculties: string[] = [];
  roles = ['Admin', 'FacultyManager', 'Lecturer'];

  allConferences: any[] = [];
  // רשימת כנסים מסוננת בנפרד לכל שורת שיוך (אינדקס = מיקום השורה ב-FormArray)
  filteredConferencesByRow: any[][] = [];

  showPassword = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadFaculties();
    this.loadConferences();
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  loadConferences(): void {
    this.apiService.getSurveys().subscribe({
      next: (data) => { this.allConferences = data; },
      error: (err) => console.error('Error loading conferences:', err)
    });
  }

  get assignments(): FormArray {
    return this.editForm.get('assignments') as FormArray;
  }

  addAssignment(facultyName: string = '', conferenceId: string = ''): void {
    const group = this.fb.group({
      facultyName: [facultyName, Validators.required],
      conferenceId: [conferenceId, Validators.required]
    });

    const index = this.assignments.length;
    this.filteredConferencesByRow[index] = facultyName
      ? this.allConferences.filter(c => (c.Category || c.category) === facultyName)
      : this.allConferences;

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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  startEdit(user: any): void {
    this.editingUser = user;
    this.showPassword = false;
    this.filteredConferencesByRow = [];

    this.editForm = this.fb.group({
      fullName: [user.FullName, Validators.required],
      email: [user.Email, [Validators.required, Validators.email]],
      role: [user.Role, Validators.required],
      password: [''],
      assignments: this.fb.array([])
    });

    // תאימות לאחור: אם עדיין אין למשתמש מערך ManagedAssignments (מבנה ישן עם
    // FacultyName + ManagedConferenceId בודדים) - נהפוך את זה לשורה אחת.
    const existing = (user.ManagedAssignments && user.ManagedAssignments.length)
      ? user.ManagedAssignments
      : (user.FacultyName
          ? [{ FacultyName: user.FacultyName, ConferenceId: user.ManagedConferenceId || '' }]
          : []);

    existing.forEach((a: any) => this.addAssignment(a.FacultyName || a.facultyName, a.ConferenceId || a.conferenceId));

    if (existing.length === 0 && user.Role === 'FacultyManager') {
      this.addAssignment();
    }
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  saveEdit(): void {
    if (!this.editingUser) {
      console.error('No user is being edited!');
      return;
    }
    const userId = this.editingUser.Id || this.editingUser.id || this.editingUser.ID;
    if (!userId) {
      alert('Error: could not find the user ID. Check the Console to see how the field is named on the object!');
      return;
    }
    if (this.editForm.invalid) {
      alert('The form is invalid');
      return;
    }

    const formValue = this.editForm.value;

    const payload: any = {
      fullName: formValue.fullName,
      email: formValue.email,
      role: formValue.role,
      // מערך שיוכים - פקולטה + כנס לכל שורה. ריק אם לא FacultyManager.
      // ⚠️ דורש עמודה/שדה תואם בבקאנד (ראה הערה בהודעת הצ'אט)
      ManagedAssignments: formValue.role === 'FacultyManager'
        ? this.assignments.value.map((a: any) => ({
            FacultyName: a.facultyName,
            ConferenceId: a.conferenceId
          }))
        : []
    };

    // סיסמא נשלחת רק אם המשתמש הקליד ערך חדש - שדה ריק = "לא לשנות סיסמא"
    if (formValue.password) {
      payload.password = formValue.password;
    }

    this.authService.updateUser(userId, payload).subscribe({
      next: () => {
        alert('User updated successfully');
        this.editingUser = null;
        this.loadUsers();
      },
      error: (err) => {
        console.error('Update error:', err);
      }
    });
  }

  deleteUser(id: string): void {
    if (!confirm('Are you sure you want to delete this user?')) { return; }
    this.authService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => alert('Error deleting: ' + err.error)
    });
  }

  openCreateModal() {
    this.isCreateModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  loadFaculties(): void {
    // ⚠️ הוחלף מ-getFaculties() ל-getDepartmentsLookup() כדי להשתמש בדיוק
    // באותו endpoint כמו ב-create-user.component - כך ששני הטפסים תמיד
    // יציגו את אותה רשימה, באותו casing.
    this.apiService.getDepartmentsLookup().subscribe({
      next: (data) => this.faculties = data,
      error: (err) => console.error('Error loading faculties:', err)
    });
  }
}