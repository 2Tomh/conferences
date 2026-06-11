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
      error: (err) => console.error('שגיאה:', err)
    });
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
      console.error('אין משתמש בעריכה!');
      return;
    }
    const userId = this.editingUser.Id || this.editingUser.id || this.editingUser.ID;

    if (!userId) {
      alert('שגיאה: המערכת לא מצאה את ה-ID של המשתמש. תסתכל ב-Console ותראה איך קוראים לשדה באובייקט!');
      return;
    }

    if (this.editForm.invalid) {
      alert('הטופס אינו תקין');
      return;
    }

    this.authService.updateUser(userId, this.editForm.value).subscribe({
      next: () => {
        alert('המשתמש עודכן בהצלחה');
        this.editingUser = null;
        this.loadUsers();
      },
      error: (err) => {
        console.error('שגיאת עדכון:', err);
      }
    });
  }
  deleteUser(id: string): void {
    if (!confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) { return; }
    this.authService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => alert('שגיאה במחיקה: ' + err.error)
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
        // מניחים ש-data הוא אובייקט שבו המפתחות הם שמות הפקולטות
        this.faculties = Object.keys(data);
      },
      error: (err) => console.error('שגיאה בטעינת פקולטות:', err)
    });
  }
}
