// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { ApiService } from '../../../services/api.service';
// import { Router } from '@angular/router';

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
//   posterForm!: FormGroup;

//   allConferences: any[] = [];
//   filteredConferences: any[] = [];
//   selectedConference: any = null;

//   isLoading = false;
//   showConferencePopup = false;
//   showAbstractPopup = false;
//   showPosterPopup = false;
//   showAbstractNotice = false;

//   conferenceSearch = '';
//   wantsAbstract: boolean | null = null;
//   abstractSaved = false;
  
//   // תוספות חדשות
//   wantsPoster: boolean | null = null;
//   posterSaved = false;
//   isLifetime: boolean = false;

//   currentStep = 1;
//   totalSteps = 3;

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
//       fullName: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'"-]+(?:\s[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'"-]+)+$/)]],
//       email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/)]],
//       phone: ['', [Validators.required, Validators.pattern(/^0[0-9]{9}$/)]],
//       address: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^.+[\s,].+$/)]],
//       institution: [''],
//       conferenceId: ['', Validators.required]
//     });

//     this.abstractForm = this.fb.group({
//       title: ['', [Validators.required, maxWords(25)]],
//       body: ['', [Validators.required, abstractValidator(250, 2500)]],
//       notes: ['']
//     });

//     this.posterForm = this.fb.group({
//       title: ['', Validators.required],
//       authors: ['', Validators.required],
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
//           abstractGuidelines: conf.AbstractGuidelines || '',
//           allowsPoster: conf.AllowsPoster || false, // מוודא שקיים
//           posterGuidelines: conf.PosterGuidelines || ''
//         }));
//         this.filteredConferences = [...this.allConferences];
//         this.isLoading = false;
//       },
//       error: (err) => { console.error('שגיאה בטעינת כנסים', err); this.isLoading = false; }
//     });
//   }

//   openConferencePopup() { this.showConferencePopup = true; }
//   closeConferencePopup() { this.showConferencePopup = false; }
  
//   selectConference(conf: any) {
//     this.selectedConference = conf;
//     this.regForm.patchValue({ conferenceId: conf.id || conf._id });
//     this.showConferencePopup = false;
//   }

//   onAbstractChoice(wants: boolean) {
//     this.wantsAbstract = wants;
//     if (wants) { this.abstractForm.reset(); this.showAbstractPopup = true; }
//   }

//   onPosterChoice(wants: boolean) {
//     this.wantsPoster = wants;
//     if (wants) { this.posterForm.reset(); this.showPosterPopup = true; }
//   }

//   saveAbstract() {
//     if (this.abstractForm.invalid) return;
//     this.abstractSaved = true;
//     this.showAbstractPopup = false;
//     this.showAbstractNotice = true;
//   }

//   savePoster() {
//     if (this.posterForm.invalid) return;
//     this.posterSaved = true;
//     this.showPosterPopup = false;
//   }

//   // ══ STEP NAVIGATION ══
//   private stepFields: { [key: number]: string[] } = {
//     1: ['conferenceId'],
//     2: ['fullName', 'email', 'phone'],
//     3: ['address', 'institution']
//   };

//   isStepValid(step: number): boolean {
//     return this.stepFields[step].every(field => this.regForm.get(field)?.valid);
//   }

//   nextStep(): void {
//     if (!this.isStepValid(this.currentStep)) return;
//     if (this.currentStep < this.totalSteps) this.currentStep++;
//   }

//   prevStep(): void { if (this.currentStep > 1) this.currentStep--; }

//   goToStep(step: number): void {
//     if (step < this.currentStep) { this.currentStep = step; return; }
//     for (let i = 1; i < step; i++) { if (!this.isStepValid(i)) return; }
//     this.currentStep = step;
//   }

//   onSubmit() {
//     if (this.regForm.invalid) return;
//     this.isLoading = true;
    
//     const formVal = this.regForm.value;
//     const abstract = this.abstractSaved ? this.abstractForm.value : null;
//     const poster = this.posterSaved ? this.posterForm.value : null;

//     const payload = {
//       ...formVal,
//       HasAbstract: this.abstractSaved,
//       AbstractTitle: abstract?.title,
//       AbstractBody: abstract?.body,
//       HasPoster: this.posterSaved,
//       PosterTitle: poster?.title,
//       PosterAuthors: poster?.authors,
//       IsLifetimeMember: this.isLifetime
//     };

//     const finalAmount = this.isLifetime ? 1.1 : (this.selectedConference?.price || 0.7);

//     this.apiService.registerAttendee(payload).subscribe({
//       next: (res: any) => {
//         this.isLoading = false;
//         this.paymentInputData = { ...payload, orderId: res.orderId || res.OrderId, amount: finalAmount };
//         this.showPaymentModal = true;
//       },
//       error: (err) => { this.isLoading = false; alert('Error'); }
//     });
//   }

//   closePaymentModal(): void { this.showPaymentModal = false; }
//   get f() { return this.regForm.controls; }
//   get af() { return this.abstractForm.controls; }
// }

import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class RegistrationFormComponent implements OnInit, OnChanges {

  @Input() preselectedConferenceId: string | null = null;
  @Input() autoOpenAbstract: boolean = false;

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
  showPosterNotice = false;

  conferenceSearch = '';

  wantsAbstract: boolean | null = null;
  wantsPoster: boolean | null = null;
  abstractSaved = false;
  posterSaved = false;

  isLifetimeMember = false;

  readonly REGULAR_PRICE = 50;
  readonly LIFETIME_PRICE = 250;

  get registrationAmount(): number {
    return this.isLifetimeMember ? this.LIFETIME_PRICE : this.REGULAR_PRICE;
  }

  get canSubmitPoster(): boolean {
    return !this.abstractSaved && (this.selectedConference?.allowsPoster === true);
  }

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preselectedConferenceId'] && this.allConferences.length) {
      this.applyPreselection();
    }
  }

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

    this.posterForm = this.fb.group({
      title: ['', [Validators.required, maxWords(25)]],
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
          name: conf.Name || conf.name || conf.Conference || 'Unnamed Conference',
          location: conf.Location || conf.location || '',
          description: conf.Description || conf.description || '',
          abstractGuidelines: conf.AbstractGuidelines || conf.abstractGuidelines || '',
          allowsPoster: conf.AllowsPoster || conf.allowsPoster || false,
          posterGuidelines: conf.PosterGuidelines || conf.posterGuidelines || ''
        }));
        this.filteredConferences = [...this.allConferences];
        this.isLoading = false;
        this.applyPreselection();
      },
      error: (err) => {
        console.error('Error loading conferences', err);
        this.isLoading = false;
      }
    });
  }

  private applyPreselection(): void {
    if (!this.preselectedConferenceId) return;
    const match = this.allConferences.find(c =>
      c.id === this.preselectedConferenceId || c._id === this.preselectedConferenceId
    );
    if (match) {
      this.selectConference(match);
      if (this.autoOpenAbstract) {
        this.onAbstractChoice(true);
      }
    }
  }

  openConferencePopup() {
    this.conferenceSearch = '';
    this.filteredConferences = [...this.allConferences];
    this.showConferencePopup = true;
  }

  closeConferencePopup() { this.showConferencePopup = false; }

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
    this.regForm.patchValue({ conferenceId: id });
    this.wantsAbstract = null;
    this.wantsPoster = null;
    this.abstractSaved = false;
    this.posterSaved = false;
    this.showAbstractNotice = false;
    this.showPosterNotice = false;
    this.showConferencePopup = false;
  }

  // ══ ABSTRACT ══
  onAbstractChoice(wants: boolean) {
    this.wantsAbstract = wants;
    if (wants) {
      this.abstractForm.reset();
      this.showAbstractPopup = true;
      this.wantsPoster = null;
      this.posterSaved = false;
      this.showPosterNotice = false;
    }
  }

  closeAbstractPopup() { this.showAbstractPopup = false; }

  saveAbstract() {
    if (this.abstractForm.invalid) {
      this.abstractForm.markAllAsTouched();
      return;
    }
    this.abstractSaved = true;
    this.showAbstractPopup = false;
    this.showAbstractNotice = true;
  }

  closeAbstractNotice() { this.showAbstractNotice = false; }

  // ══ POSTER ══
  onPosterChoice(wants: boolean) {
    this.wantsPoster = wants;
    if (wants) {
      this.posterForm.reset();
      this.showPosterPopup = true;
    }
  }

  closePosterPopup() { this.showPosterPopup = false; }

  savePoster() {
    if (this.posterForm.invalid) {
      this.posterForm.markAllAsTouched();
      return;
    }
    this.posterSaved = true;
    this.showPosterPopup = false;
    this.showPosterNotice = true;
  }

  closePosterNotice() { this.showPosterNotice = false; }

  // ══ STEPS ══
  private stepFields: { [key: number]: string[] } = {
    1: ['conferenceId'],
    2: ['fullName', 'email', 'phone'],
    3: ['address', 'institution']
  };

  isStepValid(step: number): boolean {
    return this.stepFields[step].every(field => this.regForm.get(field)?.valid);
  }

  nextStep(): void {
    this.stepFields[this.currentStep].forEach(field => this.regForm.get(field)?.markAsTouched());
    if (!this.isStepValid(this.currentStep)) return;
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  goToStep(step: number): void {
    if (step < this.currentStep) { this.currentStep = step; return; }
    for (let i = 1; i < step; i++) {
      if (!this.isStepValid(i)) return;
    }
    this.currentStep = step;
  }

  // ══ SUBMIT ══
  onSubmit() {
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      for (let step = 1; step <= this.totalSteps; step++) {
        if (!this.isStepValid(step)) { this.currentStep = step; break; }
      }
      return;
    }

    this.isLoading = true;
    const formVal = this.regForm.value;
    const abstract = this.abstractSaved ? this.abstractForm.value : null;
    const poster = this.posterSaved ? this.posterForm.value : null;

    const payload = {
      FullName: formVal.fullName,
      Email: formVal.email,
      Phone: formVal.phone,
      Address: formVal.address,
      Institution: formVal.institution || '',
      ConferenceId: formVal.conferenceId,
      IsLifetimeMember: this.isLifetimeMember,
      HasAbstract: this.abstractSaved,
      AbstractTitle: abstract?.title || null,
      AbstractBody: abstract?.body || null,
      AbstractNotes: abstract?.notes || null,
      HasPoster: this.posterSaved,
      PosterTitle: poster?.title || null,
      PosterAuthors: poster?.authors || null,
      PosterNotes: poster?.notes || null
    };

    this.apiService.registerAttendee(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const orderId = res.orderId || res.OrderId;

        this.paymentInputData = {
          ...payload,
          orderId: orderId,
          amount: this.registrationAmount
        };
        this.showPaymentModal = true;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Server error details:', err);
        const msg = err.error?.Message || err.error || 'Error saving registration details';
        alert(msg);
      }
    });
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentInputData = null;
  }

  get f() { return this.regForm.controls; }
  get af() { return this.abstractForm.controls; }
  get pf() { return this.posterForm.controls; }
}