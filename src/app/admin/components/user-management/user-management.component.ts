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
  roles = ['Admin', 'FacultyManager', 'Lecturer'];

  searchTerm = '';
  pageSize = 10;
  currentPage = 1;

  // ⭐⭐ תוקן: אותה תבנית בדיוק כמו create-user.component.ts, שכבר
  // מוכחת שעובדת - departments + כל הכנסים, מסוננים בצד הלקוח לפי Category
  departments: string[] = [];
  allConferences: any[] = [];
  filteredConferences: any[] = [];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();

    this.apiService.getDepartmentsLookup().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('שגיאה בטעינת מחלקות:', err)
    });

    this.apiService.getSurveys().subscribe({
      next: (data) => {
        this.allConferences = data;
        this.filteredConferences = data;
      },
      error: (err) => console.error('שגיאה בטעינת כנסים:', err)
    });
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  get filteredUsers(): any[] {
    if (!this.searchTerm) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(u => (u.FullName || '').toLowerCase().includes(term));
  }

  get pagedUsers(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize) || 1;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearch(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // ⭐⭐ עודכן: managedConferenceId נוסף, ומאזין לשינוי facultyName כדי
  // לסנן מחדש את רשימת הכנסים - אותה לוגיקה כמו filterConferences ב-create-user
  startEdit(user: any): void {
    this.editingUser = user;
    this.editForm = this.fb.group({
      fullName: [user.FullName, Validators.required],
      email: [user.Email, [Validators.required, Validators.email]],
      role: [user.Role, Validators.required],
      facultyName: [user.FacultyName || ''],
      managedConferenceId: [user.ManagedConferenceId || ''],
      password: ['']
    });

    this.filterConferences(user.FacultyName || '');

    this.editForm.get('facultyName')?.valueChanges.subscribe((dept: string) => {
      this.filterConferences(dept);
    });
  }

  // ⭐⭐ זהה ל-filterConferences ב-create-user.component.ts
  private filterConferences(deptName: string): void {
    if (!deptName) {
      this.filteredConferences = this.allConferences;
    } else {
      this.filteredConferences = this.allConferences.filter(
        c => c.Category === deptName || c.category === deptName
      );
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
}