import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function abstractValidator(maxWordsLimit: number, maxCharsLimit: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const text = control.value;
    const wordCount = text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
    const charCount = text.length;

    if (wordCount > maxWordsLimit) return { maxWords: { limit: maxWordsLimit } };
    if (charCount > maxCharsLimit) return { maxChars: { limit: maxCharsLimit } };

    return null;
  };
}
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
  //     fullName: ['', [Validators.required, Validators.minLength(5)]],
  //     email: ['', [
  //       Validators.required,
  //       Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/)
  //     ]],
  //     phone: ['', [
  //       Validators.required,
  //       Validators.pattern(/^0[0-9]{9,10}$|^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/)
  //     ]],
  //     address: ['', Validators.required],
  //     institution: [''],
  //     conferenceId: ['', Validators.required]
  //   });

  //   this.abstractForm = this.fb.group({
  //     // כותרת עד 25 מילים
  //     title: ['', [Validators.required, maxWords(25)]],
  //     // גוף עד 250 מילים או 2500 תווים
  //     body: ['', [Validators.required, abstractValidator(250, 2500)]],
  //     notes: ['']
  //   });
  // }

  // ===== פופאפ בחירת כנס =====
  // loadConferences() {
  //   this.isLoading = true;
  //   this.apiService.getSurveys().subscribe({
  //     next: (data) => {
  //       this.allConferences = data.map(conf => ({
  //         ...conf,
  //         id: conf.Id || conf._id || conf.id,
  //         name: conf.Name || conf.name || conf.Conference || 'כנס ללא שם',
  //         location: conf.Location || conf.location || 'מיקום לא מוגדר',
  //         description: conf.Description || conf.description || '',
  //         // משיכת ההנחיות שהאדמין הגדיר
  //         abstractGuidelines: conf.AbstractGuidelines || ''
  //       }));

  //       this.filteredConferences = [...this.allConferences];
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('שגיאה בטעינת כנסים', err);
  //       this.isLoading = false;
  //     }
  //   });
  // }
  // החלף את initForms() בזה:

  initForms() {
    this.regForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'"-]+(?:\s[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'"-]+)+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^0[0-9]{9}$/)
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^.+[\s,].+$/)
      ]],
      institution: [''],
      conferenceId: ['', Validators.required]
    });

    this.abstractForm = this.fb.group({
      title: ['', [Validators.required, maxWords(25)]],
      body: ['', [Validators.required, abstractValidator(250, 2500)]],
      notes: ['']
    });
  }
  loadConferences() {
    this.isLoading = true;
    this.apiService.getSurveys().subscribe({
      next: (data) => {
        this.allConferences = data.map(conf => ({
          ...conf,
          id: conf.Id || conf._id || conf.id,
          name: conf.Name || conf.name || conf.Conference || 'כנס ללא שם',
          location: conf.Location || conf.location || 'מיקום לא מוגדר',
          description: conf.Description || conf.description || '',
          // הנה התיקון הקריטי: אנחנו מוודאים שהשדה מועבר לאובייקט החדש
          abstractGuidelines: conf.AbstractGuidelines || ''
        }));

        this.filteredConferences = [...this.allConferences];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('שגיאה בטעינת כנסים', err);
        this.isLoading = false;
      }
    });
  }
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

  onSubmit() {
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formVal = this.regForm.value;
    const abstract = this.abstractSaved ? this.abstractForm.value : null;

    // התאמה מדויקת לשמות המשתנים ב-C# (אותיות גדולות בהתחלה)
    // כך שה-Deserializer של השרת יזהה אותם בוודאות
    const payload = {
      FullName: formVal.fullName,
      Email: formVal.email,
      Phone: formVal.phone,
      Address: formVal.address,
      Institution: formVal.institution || '',
      ConferenceId: formVal.conferenceId,
      HasAbstract: this.abstractSaved,
      AbstractTitle: abstract?.title || null,
      AbstractBody: abstract?.body || null,
      AbstractNotes: abstract?.notes || null
    };

    this.apiService.registerAttendee(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const attendeeId = res.attendeeId || res.AttendeeId;
        const orderId = res.orderId || res.OrderId; // ← קח את ה-OrderId מהשרת!

        this.router.navigate(['/payment'], {
          state: {
            data: {
              ...payload,
              attendeeId: attendeeId,
              orderId: orderId,  // ← שלח אותו לדף התשלום
              amount: this.selectedConference?.price || 1
            }
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        // נדפיס את השגיאה המלאה לקונסול כדי לראות אם השרת החזיר לנו הודעת וולידציה
        console.error('Server error details:', err);
        const msg = err.error?.Message || err.error || 'שגיאה בשמירת פרטי ההרשמה';
        alert(msg);
      }
    });
  }
  // helpers
  get f() { return this.regForm.controls; }
  get af() { return this.abstractForm.controls; }
}

