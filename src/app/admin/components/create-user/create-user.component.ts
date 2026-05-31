import { Component, OnInit } from '@angular/core'; // הוספנו OnInit
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../../services/api.service'; // נביא את השירות שמביא פקולטות

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  faculties: string[] = []; // מערך פקולטות דינמי

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService // הזרקת ה-API
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['FacultyManager', Validators.required],
      facultyName: [''] // ישתנה ל-select
    });
  }

  ngOnInit(): void {
    this.loadFaculties();
  }

  loadFaculties(): void {
    this.apiService.getFaculties().subscribe({
      next: (data: any) => {
        this.faculties = Array.isArray(data) ? data : Object.keys(data);
      },
      error: (err) => console.error('שגיאה בטעינת פקולטות:', err)
    });
  }

  onSubmit():void {
    if (this.userForm.valid) {
      this.authService.createUser(this.userForm.value).subscribe({
        next: () => alert('משתמש נוצר בהצלחה'),
        error: (err) => console.error('שגיאה:', err)
      });
    }
  }
}
