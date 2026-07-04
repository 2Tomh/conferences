// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ApiService } from '../../../services/api.service';
// import { Router } from '@angular/router';
// import { AbstractControl, ValidationErrors } from '@angular/forms';

// export function abstractValidator(maxWordsLimit: number, maxCharsLimit: number) {
//   return (control: AbstractControl): ValidationErrors | null => {
//     if (!control.value) return null;
//     const text = control.value;
//     const wordCount = text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
//     const charCount = text.length;
//     if (wordCount > maxWordsLimit) return { maxWords: { limit: maxWordsLimit } };
//     if (charCount > maxCharsLimit) return { maxChars: { limit: maxCharsLimit } };
//     return null;
//   };
// }

// export function maxWords(limit: number) {
//   return (control: AbstractControl): ValidationErrors | null => {
//     if (!control.value) return null;
//     const wordCount = control.value.trim().split(/\s+/).length;
//     return wordCount > limit ? { maxWords: { required: limit, actual: wordCount } } : null;
//   };
// }

// @Component({
//   selector: 'app-registration-form',
//   templateUrl: './registration-form.component.html',
//   styleUrls: ['./registration-form.component.css']
// })
// export class RegistrationFormComponent implements OnInit {

//   regForm!: FormGroup;
//   abstractForm!: FormGroup;

//   allConferences: any[] = [];
//   filteredConferences: any[] = [];
//   selectedConference: any = null;

//   isLoading = false;

//   showConferencePopup = false;
//   showAbstractPopup = false;
//   showAbstractNotice = false;

//   conferenceSearch = '';

//   wantsAbstract: boolean | null = null;
//   abstractSaved = false;

//   currentStep = 1;
//   totalSteps = 3;

//   // ══ PAYMENT MODAL STATE ══
//   showPaymentModal = false;
//   paymentInputData: any = null;

//   constructor(
//     private fb: FormBuilder,
//     private apiService: ApiService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     this.initForms();
//     this.loadConferences();
//   }

//   initForms() {
//     this.regForm = this.fb.group({
//       fullName: ['', [
//         Validators.required,
//         Validators.minLength(5),
//         Validators.pattern(/^[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'"-]+(?:\s[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'"-]+)+$/)
//       ]],
//       email: ['', [
//         Validators.required,
//         Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/)
//       ]],
//       phone: ['', [
//         Validators.required,
//         Validators.pattern(/^0[0-9]{9}$/)
//       ]],
//       address: ['', [
//         Validators.required,
//         Validators.minLength(5),
//         Validators.pattern(/^.+[\s,].+$/)
//       ]],
//       institution: [''],
//       conferenceId: ['', Validators.required]
//     });

//     this.abstractForm = this.fb.group({
//       title: ['', [Validators.required, maxWords(25)]],
//       body: ['', [Validators.required, abstractValidator(250, 2500)]],
//       notes: ['']
//     });
//   }

//   loadConferences() {
//     this.isLoading = true;
//     this.apiService.getSurveys().subscribe({
//       next: (data) => {
//         this.allConferences = data.map(conf => ({
//           ...conf,
//           id: conf.Id || conf._id || conf.id,
//           name: conf.Name || conf.name || conf.Conference || 'כנס ללא שם',
//           location: conf.Location || conf.location || 'מיקום לא מוגדר',
//           description: conf.Description || conf.description || '',
//           abstractGuidelines: conf.AbstractGuidelines || ''
//         }));

//         this.filteredConferences = [...this.allConferences];
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('שגיאה בטעינת כנסים', err);
//         this.isLoading = false;
//       }
//     });
//   }

//   openConferencePopup() {
//     this.conferenceSearch = '';
//     this.filteredConferences = [...this.allConferences];
//     this.showConferencePopup = true;
//   }

//   closeConferencePopup() {
//     this.showConferencePopup = false;
//   }

//   onConferenceSearch(event: Event) {
//     const inputElement = event.target as HTMLInputElement;
//     const term = inputElement.value.toLowerCase();

//     if (!term) {
//       this.filteredConferences = [...this.allConferences];
//     } else {
//       this.filteredConferences = this.allConferences.filter(c =>
//         c.name?.toLowerCase().includes(term) ||
//         c.location?.toLowerCase().includes(term) ||
//         c.description?.toLowerCase().includes(term)
//       );
//     }
//   }

//   selectConference(conf: any) {
//     this.selectedConference = conf;
//     const id = conf.id || conf._id;
//     this.regForm.patchValue({ conferenceId: id, sessionId: '' });
//     this.wantsAbstract = null;
//     this.abstractSaved = false;
//     this.showAbstractNotice = false;
//     this.showConferencePopup = false;
//   }

//   onAbstractChoice(wants: boolean) {
//     this.wantsAbstract = wants;
//     if (wants) {
//       this.abstractForm.reset();
//       this.showAbstractPopup = true;
//     }
//   }

//   closeAbstractPopup() {
//     this.showAbstractPopup = false;
//   }

//   saveAbstract() {
//     if (this.abstractForm.invalid) {
//       this.abstractForm.markAllAsTouched();
//       return;
//     }
//     this.abstractSaved = true;
//     this.showAbstractPopup = false;
//     this.showAbstractNotice = true;
//   }

//   closeAbstractNotice() {
//     this.showAbstractNotice = false;
//   }

//   private stepFields: { [key: number]: string[] } = {
//     1: ['conferenceId'],
//     2: ['fullName', 'email', 'phone'],
//     3: ['address', 'institution']
//   };

//   isStepValid(step: number): boolean {
//     const fields = this.stepFields[step];
//     return fields.every(field => this.regForm.get(field)?.valid);
//   }

//   nextStep(): void {
//     const fields = this.stepFields[this.currentStep];
//     fields.forEach(field => this.regForm.get(field)?.markAsTouched());

//     if (!this.isStepValid(this.currentStep)) {
//       return;
//     }

//     if (this.currentStep < this.totalSteps) {
//       this.currentStep++;
//     }
//   }

//   prevStep(): void {
//     if (this.currentStep > 1) {
//       this.currentStep--;
//     }
//   }

//   goToStep(step: number): void {
//     if (step < this.currentStep) {
//       this.currentStep = step;
//       return;
//     }
//     for (let i = 1; i < step; i++) {
//       if (!this.isStepValid(i)) {
//         return;
//       }
//     }
//     this.currentStep = step;
//   }

//   onSubmit() {
//     if (this.regForm.invalid) {
//       this.regForm.markAllAsTouched();
//       for (let step = 1; step <= this.totalSteps; step++) {
//         if (!this.isStepValid(step)) {
//           this.currentStep = step;
//           break;
//         }
//       }
//       return;
//     }

//     this.isLoading = true;
//     const formVal = this.regForm.value;
//     const abstract = this.abstractSaved ? this.abstractForm.value : null;

//     const payload = {
//       FullName: formVal.fullName,
//       Email: formVal.email,
//       Phone: formVal.phone,
//       Address: formVal.address,
//       Institution: formVal.institution || '',
//       ConferenceId: formVal.conferenceId,
//       HasAbstract: this.abstractSaved,
//       AbstractTitle: abstract?.title || null,
//       AbstractBody: abstract?.body || null,
//       AbstractNotes: abstract?.notes || null
//     };

//     this.apiService.registerAttendee(payload).subscribe({
//       next: (res: any) => {
//         this.isLoading = false;
//         const attendeeId = res.attendeeId || res.AttendeeId;
//         const orderId = res.orderId || res.OrderId;

//         // ══ פותח מודל תשלום במקום לנווט ══
//         this.paymentInputData = {
//           ...payload,
//           attendeeId: attendeeId,
//           orderId: orderId,
//           amount: this.selectedConference?.price || 1
//         };
//         this.showPaymentModal = true;
//       },
//       error: (err) => {
//         this.isLoading = false;
//         console.error('Server error details:', err);
//         const msg = err.error?.Message || err.error || 'שגיאה בשמירת פרטי ההרשמה';
//         alert(msg);
//       }
//     });
//   }

//   closePaymentModal(): void {
//     this.showPaymentModal = false;
//     this.paymentInputData = null;
//   }

//   get f() { return this.regForm.controls; }
//   get af() { return this.abstractForm.controls; }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

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
  posterForm!: FormGroup;

  allConferences: any[] = [];
  filteredConferences: any[] = [];
  selectedConference: any = null;

  isLoading = false;
  showConferencePopup = false;
  showAbstractPopup = false;
  showPosterPopup = false;
  showAbstractNotice = false;

  conferenceSearch = '';
  wantsAbstract: boolean | null = null;
  abstractSaved = false;
  
  // תוספות חדשות
  wantsPoster: boolean | null = null;
  posterSaved = false;
  isLifetime: boolean = false;

  currentStep = 1;
  totalSteps = 3;

  showPaymentModal = false;
  paymentInputData: any = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadConferences();
  }

  initForms() {
    this.regForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'"-]+(?:\s[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'"-]+)+$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^.+[\s,].+$/)]],
      institution: [''],
      conferenceId: ['', Validators.required]
    });

    this.abstractForm = this.fb.group({
      title: ['', [Validators.required, maxWords(25)]],
      body: ['', [Validators.required, abstractValidator(250, 2500)]],
      notes: ['']
    });

    this.posterForm = this.fb.group({
      title: ['', Validators.required],
      authors: ['', Validators.required],
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
          abstractGuidelines: conf.AbstractGuidelines || '',
          allowsPoster: conf.AllowsPoster || false, // מוודא שקיים
          posterGuidelines: conf.PosterGuidelines || ''
        }));
        this.filteredConferences = [...this.allConferences];
        this.isLoading = false;
      },
      error: (err) => { console.error('שגיאה בטעינת כנסים', err); this.isLoading = false; }
    });
  }

  openConferencePopup() { this.showConferencePopup = true; }
  closeConferencePopup() { this.showConferencePopup = false; }
  
  selectConference(conf: any) {
    this.selectedConference = conf;
    this.regForm.patchValue({ conferenceId: conf.id || conf._id });
    this.showConferencePopup = false;
  }

  onAbstractChoice(wants: boolean) {
    this.wantsAbstract = wants;
    if (wants) { this.abstractForm.reset(); this.showAbstractPopup = true; }
  }

  onPosterChoice(wants: boolean) {
    this.wantsPoster = wants;
    if (wants) { this.posterForm.reset(); this.showPosterPopup = true; }
  }

  saveAbstract() {
    if (this.abstractForm.invalid) return;
    this.abstractSaved = true;
    this.showAbstractPopup = false;
    this.showAbstractNotice = true;
  }

  savePoster() {
    if (this.posterForm.invalid) return;
    this.posterSaved = true;
    this.showPosterPopup = false;
  }

  // ══ STEP NAVIGATION ══
  private stepFields: { [key: number]: string[] } = {
    1: ['conferenceId'],
    2: ['fullName', 'email', 'phone'],
    3: ['address', 'institution']
  };

  isStepValid(step: number): boolean {
    return this.stepFields[step].every(field => this.regForm.get(field)?.valid);
  }

  nextStep(): void {
    if (!this.isStepValid(this.currentStep)) return;
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep(): void { if (this.currentStep > 1) this.currentStep--; }

  goToStep(step: number): void {
    if (step < this.currentStep) { this.currentStep = step; return; }
    for (let i = 1; i < step; i++) { if (!this.isStepValid(i)) return; }
    this.currentStep = step;
  }

  onSubmit() {
    if (this.regForm.invalid) return;
    this.isLoading = true;
    
    const formVal = this.regForm.value;
    const abstract = this.abstractSaved ? this.abstractForm.value : null;
    const poster = this.posterSaved ? this.posterForm.value : null;

    const payload = {
      ...formVal,
      HasAbstract: this.abstractSaved,
      AbstractTitle: abstract?.title,
      AbstractBody: abstract?.body,
      HasPoster: this.posterSaved,
      PosterTitle: poster?.title,
      PosterAuthors: poster?.authors,
      IsLifetimeMember: this.isLifetime
    };

    const finalAmount = this.isLifetime ? 1.1 : (this.selectedConference?.price || 0.7);

    this.apiService.registerAttendee(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.paymentInputData = { ...payload, orderId: res.orderId || res.OrderId, amount: finalAmount };
        this.showPaymentModal = true;
      },
      error: (err) => { this.isLoading = false; alert('Error'); }
    });
  }

  closePaymentModal(): void { this.showPaymentModal = false; }
  get f() { return this.regForm.controls; }
  get af() { return this.abstractForm.controls; }
}