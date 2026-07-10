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
      error: (err) => console.error('Error:', err)
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