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

  // ✅ הוספתי את המשתנה החסר שגרם לשגיאה
  selectedConference: any = null;
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
      sessionId: [''],
      fullName: ['', [Validators.required, Validators.minLength(2)]], // השדה הזה קיים
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],      // הוסף
      institution: ['']                     // הוסף
    });
  }

  loadInitialData() {
    this.isLoading = true;
    this.apiService.getAllConferences().subscribe({
      next: (data) => {
        console.log('נתונים התקבלו:', data); // ✅ הוסף זה
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
    this.regForm.patchValue({ conferenceId: '', sessionId: '' });
    this.availableSessions = [];
    this.selectedConference = null; // איפוס
  }

  onConferenceChange() {
    const confId = this.regForm.get('conferenceId')?.value;
    // ✅ עדכון המשתנה שנמצא כעת בשימוש ב-onSubmit
    this.selectedConference = this.allConferences.find(c => (c.id || c._id) === confId);
    this.availableSessions = this.selectedConference?.sessions || [];
    this.regForm.patchValue({ sessionId: '' });
  }

  onSubmit() {
    if (this.regForm.invalid) { return; }

    this.router.navigate(['/payment'], {
      state: {
        data: {
          fullName: this.regForm.value.fullName, // השתמש ב-fullName הקיים
          email: this.regForm.value.email,
          phone: this.regForm.value.phone,
          institution: this.regForm.value.institution,
          conferenceId: this.regForm.value.conferenceId,
          sessionId: this.regForm.value.sessionId,
          amount: this.selectedConference?.price || 50
        }
      }
    });
  }
}