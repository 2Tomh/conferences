import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';

// וולידטור למספר מילים מקסימלי
export function maxWords(limit: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const wordCount = control.value.trim().split(/\s+/).length;
    return wordCount > limit ? { maxWords: { required: limit, actual: wordCount } } : null;
  };
}
@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  regForm!: FormGroup;
  abstractForm!: FormGroup;

  allConferences: any[] = [];
  filteredConferences: any[] = [];
  selectedConference: any = null;

  isLoading = false;

  // מצב פופאפים
  showConferencePopup = false;
  showAbstractPopup = false;
  showAbstractNotice = false; // הודעה לאחר שמירת תקציר

  // חיפוש בפופאפ כנסים
  conferenceSearch = '';

  // האם המשתמש בחר לשלוח תקציר
  wantsAbstract: boolean | null = null;
  abstractSaved = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadConferences();
  }

  // initForms() {
  //   this.regForm = this.fb.group({
  //     fullName: ['', [Validators.required, Validators.minLength(2)]],
  //     email: ['', [Validators.required, Validators.email]],
  //     address: ['', Validators.required],
  //     phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{7,15}$/)]],
  //     institution: [''],
  //     conferenceId: ['', Validators.required],
  //     sessionId: ['']
  //   });

  //   this.abstractForm = this.fb.group({
  //     title: ['', Validators.required],
  //     body: ['', Validators.required],
  //     notes: ['']
  //   });
  // }

  initForms() {
    this.regForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      // email: ['', [Validators.required, Validators.email]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/)
      ]],
      // ה-Pattern הזה תופס גם מספרים עם מקף וגם בלי:
      phone: ['', [
        Validators.required,
        Validators.pattern(/^0[0-9]{9,10}$|^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/)
      ]],
      address: ['', Validators.required],
      institution: [''],
      conferenceId: ['', Validators.required]
    });
    this.abstractForm = this.fb.group({
      // כותרת עד 25 מילים
      title: ['', [Validators.required, maxWords(25)]],
      // גוף עד 250 מילים
      body: ['', [Validators.required, maxWords(250)]],
      notes: ['']
    });
  }
  loadConferences() {
    this.isLoading = true;
    this.apiService.getAllConferences().subscribe({
      next: (data) => {
        this.allConferences = data;
        this.filteredConferences = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('שגיאה בטעינת כנסים', err);
        this.isLoading = false;
      }
    });
  }

  // ===== פופאפ בחירת כנס =====

  openConferencePopup() {
    this.conferenceSearch = '';
    this.filteredConferences = [...this.allConferences];
    this.showConferencePopup = true;
  }

  closeConferencePopup() {
    this.showConferencePopup = false;
  }

  onConferenceSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const term = inputElement.value.toLowerCase();

    if (!term) {
      this.filteredConferences = [...this.allConferences];
    } else {
      this.filteredConferences = this.allConferences.filter(c =>
        c.name?.toLowerCase().includes(term) ||
        c.location?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      );
    }
  }

  selectConference(conf: any) {
    this.selectedConference = conf;
    const id = conf.id || conf._id;
    this.regForm.patchValue({ conferenceId: id, sessionId: '' });
    this.wantsAbstract = null;
    this.abstractSaved = false;
    this.showAbstractNotice = false;
    this.showConferencePopup = false;
  }

  // ===== תקציר =====

  onAbstractChoice(wants: boolean) {
    this.wantsAbstract = wants;
    if (wants) {
      this.abstractForm.reset();
      this.showAbstractPopup = true;
    }
  }

  closeAbstractPopup() {
    this.showAbstractPopup = false;
  }

  saveAbstract() {
    if (this.abstractForm.invalid) {
      this.abstractForm.markAllAsTouched();
      return;
    }
    // הנתונים מהשדה 'notes' כבר נכללים ב-abstractForm.value
    this.abstractSaved = true;
    this.showAbstractPopup = false;
    this.showAbstractNotice = true;
  }

  closeAbstractNotice() {
    this.showAbstractNotice = false;
  }

  // ===== שליחת הטופס =====

  // onSubmit() {
  //   if (this.regForm.invalid) {
  //     this.regForm.markAllAsTouched();
  //     return;
  //   }

  //   const formVal = this.regForm.value;
  //   const abstract = this.abstractSaved ? this.abstractForm.value : null;

  //   this.router.navigate(['/payment'], {
  //     state: {
  //       data: {
  //         fullName:      formVal.fullName,
  //         email:         formVal.email,
  //         address:       formVal.address,
  //         phone:         formVal.phone,
  //         institution:   formVal.institution,
  //         conferenceId:  formVal.conferenceId,
  //         sessionId:     formVal.sessionId || '',
  //         amount:        this.selectedConference?.price || 50,
  //         hasAbstract:   this.abstractSaved,
  //         abstractTitle: abstract?.title || null,
  //         abstractBody:  abstract?.body  || null,
  //         abstractNotes: abstract?.notes || null
  //       }
  //     }
  //   });
  // }
  onSubmit() {
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      return;
    }

    this.isLoading = true; // נציג מצב טעינה למשתמש
    const formVal = this.regForm.value;
    const abstract = this.abstractSaved ? this.abstractForm.value : null;

    // הכנת האובייקט לשליחה לשרת
    const payload = {
      ...formVal,
      hasAbstract: this.abstractSaved,
      abstractTitle: abstract?.title || null,
      abstractBody: abstract?.body || null,
      abstractNotes: abstract?.notes || null,
      paymentStatus: 'pending' // חשוב: השרת מגדיר זאת, אבל כדאי לדעת
    };

    // 1. קריאה לשרת לשמירת הנתונים ב-DB בסטטוס pending
    this.apiService.registerAttendee(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const attendeeId = res.attendeeId; // וודא שהשרת מחזיר את ה-ID החדש
        sessionStorage.setItem('pendingAttendeeId', attendeeId);
        // 2. ניווט לעמוד התשלום עם ה-ID שנוצר
        this.router.navigate(['/payment'], {
          state: {
            data: {
              ...payload,
              attendeeId: attendeeId, // מעבירים את ה-ID כדי שנוכל לעדכן אותו אח"כ
              amount: this.selectedConference?.price || 50
            }
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        alert('שגיאה בשמירת פרטי ההרשמה, אנא נסה שוב');
        console.error(err);
      }
    });
  }
  // helpers
  get f() { return this.regForm.controls; }
  get af() { return this.abstractForm.controls; }
}
