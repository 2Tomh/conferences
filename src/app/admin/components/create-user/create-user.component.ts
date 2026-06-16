import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required], // נדרש ע"י השרת
      email: ['', [Validators.required, Validators.email]], // חובה ע"י השרת!
      password: ['', Validators.required],
      role: ['FacultyManager', Validators.required],
      departmentName: ['', Validators.required] // זה ה-Department שביקשת
    });
  }

  ngOnInit(): void {
    this.apiService.getDepartmentsLookup().subscribe({
      next: (data) => this.departments = data,
      error: (err) => console.error('שגיאה בטעינת מחלקות:', err)
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      // אובייקט ה-Payload חייב להתאים בדיוק למבנה של ה-Admin class ב-Backend
      const payload = {
        FullName: this.userForm.value.fullName,
        Email: this.userForm.value.email,
        Password: this.userForm.value.password,
        Role: this.userForm.value.role,
        // השדה הזה חייב להיות FacultyName כי ככה הוא מוגדר במודל Admin.cs שלך
        FacultyName: this.userForm.value.role === 'FacultyManager' ? this.userForm.value.departmentName : null
      };

      this.authService.createUser(payload).subscribe({
        next: () => {
          alert('המשתמש נוצר בהצלחה');
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          console.error('שגיאה ביצירת משתמש:', err);
          alert('שגיאה ביצירת משתמש: ' + (err.error?.message || err.error || 'נכשל'));
        }
      });
    }
  }
}