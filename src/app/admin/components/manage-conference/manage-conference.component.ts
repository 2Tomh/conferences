import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-manage-conference',
  templateUrl: './manage-conference.component.html',
  styleUrls: ['./manage-conference.component.css']
})
export class ManageConferenceComponent implements OnInit {
  conferenceForm!: FormGroup;
  conferenceId: string | null = null;
  isEditMode = false;
  currentStep = 1;

  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCategoriesFromMongo();

    this.conferenceId = this.route.snapshot.paramMap.get('id');
    if (this.conferenceId) {
      this.isEditMode = true;
      this.loadConferenceData(this.conferenceId);
    }
  }

  loadCategoriesFromMongo(): void {
    this.apiService.getSurveys().subscribe({
      next: (conferencesList) => {
        if (conferencesList && Array.isArray(conferencesList)) {
          const rawCategories = conferencesList.map(c => c.Category || c.category);
          const uniqueCategories = [...new Set(rawCategories)].filter(cat => cat && cat.trim() !== '');
          this.categories = uniqueCategories.sort();
        }
      },
      error: (err) => console.error('שגיאה בשליפת קטגוריות:', err)
    });
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // initForm(): void {
  //   // הסרת ה-Validators מהשדות Conference ו-Description
  //   this.conferenceForm = this.fb.group({
  //     Id: [''],
  //     Category: ['', Validators.required],
  //     Conference: [''],
  //     Description: [''],

  //     AbstractGuidelines: [''],
  //     AbstractMaxLimit: [2500],
  //     Abstract_submission: [false],
  //     Organizers: this.fb.array([]),
  //     Links: this.fb.group({
  //       survey: [''],
  //       website: ['']
  //     })
  //   });
  // }
  initForm(): void {
    this.conferenceForm = this.fb.group({
      Id: [''],
      Category: ['', Validators.required],
      Conference: [''],
      Description: [''],

      // שדות חדשים שנוספו
      AbstractGuidelines: [''],
      AbstractMaxLimit: [2500],
      Abstract_submission: [false],

      Organizers: this.fb.array([]),
      Links: this.fb.group({
        survey: [''],
        website: ['']
      })
    });
  }
  get organizersFormArray(): FormArray {
    return this.conferenceForm.get('Organizers') as FormArray;
  }

  addOrganizer(value: string = ''): void {
    this.organizersFormArray.push(this.fb.control(value));
  }

  removeOrganizer(index: number): void {
    this.organizersFormArray.removeAt(index);
  }

  // loadConferenceData(id: string): void {
  //   this.apiService.getSurveyById(id).subscribe({
  //     next: (data) => {
  //       if (data) {
  //         this.organizersFormArray.clear();
  //         const organizers = data.Organizers || data.organizers || [];
  //         organizers.forEach((org: string) => this.addOrganizer(org));

  //         this.conferenceForm.patchValue({
  //           Id: data.Id || data._id,
  //           Category: data.Category,
  //           Conference: data.Conference,
  //           Description: data.Description,
  //           AbstractGuidelines: data.AbstractGuidelines || '',
  //           AbstractMaxLimit: data.AbstractMaxLimit || 2500,
  //           Abstract_submission: data.Abstract_submission !== undefined ? data.Abstract_submission : data.AbstractSubmission,
  //           Links: {
  //             survey: data.Links?.survey || '',
  //             website: data.Links?.website || ''
  //           }
  //         });
  //       }
  //     },
  //     error: (err) => console.error('שגיאה בטעינת נתונים:', err)
  //   });
  // }
  loadConferenceData(id: string): void {
    this.apiService.getSurveyById(id).subscribe({
      next: (data) => {
        if (data) {
          this.organizersFormArray.clear();
          const organizers = data.Organizers || data.organizers || [];
          organizers.forEach((org: string) => this.addOrganizer(org));

          this.conferenceForm.patchValue({
            Id: data.Id || data._id,
            Category: data.Category,
            // כאן התיקון: נבדוק גם Conference וגם Name
            Conference: data.Conference || data.Name || data.name || '',
            Description: data.Description || data.description || '',
            AbstractGuidelines: data.AbstractGuidelines || '',
            AbstractMaxLimit: data.AbstractMaxLimit || 2500,
            Abstract_submission: data.Abstract_submission !== undefined ? data.Abstract_submission : data.AbstractSubmission,
            Links: {
              survey: data.Links?.survey || '',
              website: data.Links?.website || ''
            }
          });
        }
      },
      error: (err) => console.error('שגיאה בטעינת נתונים:', err)
    });
  }
  onSubmit(): void {
    const formData = this.conferenceForm.value;

    // --- התיקון מתחיל כאן ---
    // אנחנו יוצרים אובייקט חדש או מעדכנים את הקיים כך שיהיה לו שדה Name
    // השורה הזו לוקחת את מה שהמשתמש כתב ב-Conference ושמה אותו ב-Name
    formData.Name = formData.Conference;
    // --- התיקון נגמר כאן ---

    console.log('שולח נתונים לשרת:', formData);

    if (this.isEditMode) {
      this.apiService.updateSurvey(this.conferenceId!, formData).subscribe({
        next: () => this.router.navigate(['/admin/dashboard']),
        error: (err) => console.error('שגיאה בעדכון:', err)
      });
    } else {
      this.apiService.createConference(formData).subscribe({
        next: () => this.router.navigate(['/admin/dashboard']),
        error: (err) => console.error('שגיאה ביצירה:', err)
      });
    }
  }
}