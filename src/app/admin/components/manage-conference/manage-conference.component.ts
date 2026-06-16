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
  
  // מערך דינמי שיחזיק את הקטגוריות הייחודיות מהמונגו
  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // שליפת הקטגוריות מהמונגו ברגע שהקומפוננטה נטענת
    this.loadCategoriesFromMongo();

    // בדיקה האם הגענו לעמוד עם ID של כנס (מצב עריכה)
    this.conferenceId = this.route.snapshot.paramMap.get('id');
    if (this.conferenceId) {
      this.isEditMode = true;
      this.loadConferenceData(this.conferenceId);
    }
  }

  // פונקציה חכמה שמחלצת קטגוריות קיימות ללא כפילויות
  loadCategoriesFromMongo(): void {
    this.apiService.getSurveys().subscribe({
      next: (conferencesList) => {
        if (conferencesList && Array.isArray(conferencesList)) {
          // מיפוי כל ערכי הקטגוריות (תמיכה ב-PascalCase ו-camelCase לכל מקרה)
          const rawCategories = conferencesList.map(c => c.Category || c.category);
          
          // סינון ערכים ריקים ומחיקת כפילויות בעזרת Set
          const uniqueCategories = [...new Set(rawCategories)].filter(cat => cat && cat.trim() !== '');
          
          // מיון אלפביתי קל כדי שהרשימה בדרופ-דאון תיראה מסודרת
          this.categories = uniqueCategories.sort();
        }
      },
      error: (err) => console.error('שגיאה בשליפת קטגוריות דינמיות מהמונגו:', err)
    });
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' }); // קפיצה חלקה לראש הטופס
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  initForm(): void {
    this.conferenceForm = this.fb.group({
      Id: [''], // שומרים את ה-ID
      Category: ['', Validators.required],
      Conference: ['', Validators.required],
      Description: ['', Validators.required],
      Abstract_submission: [false], // או AbstractSubmission תלוי ב-C# של ה-API
      Organizers: this.fb.array([]), // מערך דינמי למארגנים

      // תואם ב-100% למבנה המונגו שלך: אובייקט Links באות גדולה, שדות פנימיים באות קטנה
      Links: this.fb.group({
        survey: [''],
        website: ['']
      })
    });
  }

  // Getter נוח למערך המארגנים
  get organizersFormArray(): FormArray {
    return this.conferenceForm.get('Organizers') as FormArray;
  }

  // הוספת מארגן חדש (בשביל ה-UI)
  addOrganizer(value: string = ''): void {
    this.organizersFormArray.push(this.fb.control(value));
  }

  // הסרת מארגן
  removeOrganizer(index: number): void {
    this.organizersFormArray.removeAt(index);
  }

  // טעינת הפרטים מהשרת והצגתם בטופס
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
            Conference: data.Conference,
            Description: data.Description,
            Abstract_submission: data.Abstract_submission !== undefined ? data.Abstract_submission : data.AbstractSubmission,
            Links: {
              survey: data.Links?.survey || '',
              website: data.Links?.website || ''
            }
          });
        }
      },
      error: (err) => console.error('שגיאה בטעינת נתוני הכנס לעריכה:', err)
    });
  }

  onSubmit(): void {
    if (this.conferenceForm.invalid) return;

    const formData = this.conferenceForm.value;

    if (this.isEditMode) {
      this.apiService.updateSurvey(this.conferenceId!, formData).subscribe({
        next: () => this.router.navigate(['/admin/dashboard']),
        error: (err) => console.error('שגיאה בעדכון כנס:', err)
      });
    } else {
      this.apiService.createConference(formData).subscribe({ 
        next: () => this.router.navigate(['/admin/dashboard']),
        error: (err) => console.error('שגיאה ביצירת כנס:', err)
      });
    }
  }
}