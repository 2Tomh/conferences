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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  // ⭐ חדש: חיפוש לפי שם
  searchTerm = '';

  // ⭐ חדש: Pagination
  pageSize = 10;
  currentPage = 1;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadFaculties();
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  // ⭐ חדש: מסנן את הרשימה לפי שם (case-insensitive)
  get filteredUsers(): any[] {
    if (!this.searchTerm) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u => (u.FullName || '').toLowerCase().includes(term));
  }

  // ⭐ חדש: מחזיר רק את המשתמשים של העמוד הנוכחי
  get pagedUsers(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  // ⭐ חדש: סך כל העמודים לפי הרשימה המסוננת
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize) || 1;
  }

  // ⭐ חדש: מערך עמודים לצורך כפתורי הניווט
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // ⭐ חדש: מופעל בכל הקלדה בשדה החיפוש - מאפס לעמוד 1 כדי למנוע טבלה ריקה
  onSearch(): void {
    this.currentPage = 1;
  }

  // ⭐ חדש: מעבר בין עמודים
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  startEdit(user: any): void {
    this.editingUser = user;
    this.editForm = this.fb.group({
      fullName: [user.FullName, Validators.required],
      email: [user.Email, [Validators.required, Validators.email]],
      role: [user.Role, Validators.required],
      facultyName: [user.FacultyName || ''],
      password: ['']
    });
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
    this.authService.updateUser(userId, this.editForm.value).subscribe({
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
    this.apiService.getFaculties().subscribe({
      next: (data) => {
        // Assuming data is an object whose keys are the faculty names
        this.faculties = Object.keys(data);
      },
      error: (err) => console.error('Error loading faculties:', err)
    });
  }
}