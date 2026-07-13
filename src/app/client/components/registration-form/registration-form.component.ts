// // import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
// // import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// // import { ApiService } from '../../../services/api.service';
// // import { Router } from '@angular/router';

// // export function abstractValidator(maxWordsLimit: number, maxCharsLimit: number) {
// //   return (control: AbstractControl): ValidationErrors | null => {
// //     if (!control.value) return null;
// //     const text = control.value;
// //     const wordCount = text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
// //     const charCount = text.length;
// //     if (wordCount > maxWordsLimit) return { maxWords: { limit: maxWordsLimit } };
// //     if (charCount > maxCharsLimit) return { maxChars: { limit: maxCharsLimit } };
// //     return null;
// //   };
// // }

// // export function maxWords(limit: number) {
// //   return (control: AbstractControl): ValidationErrors | null => {
// //     if (!control.value) return null;
// //     const wordCount = control.value.trim().split(/\s+/).length;
// //     return wordCount > limit ? { maxWords: { required: limit, actual: wordCount } } : null;
// //   };
// // }

// // @Component({
// //   selector: 'app-registration-form',
// //   templateUrl: './registration-form.component.html',
// //   styleUrls: ['./registration-form.component.css']
// // })
// // export class RegistrationFormComponent implements OnInit, OnChanges {

// //   @Input() preselectedConferenceId: string | null = null;
// //   @Input() autoOpenAbstract: boolean = false;

// //   regForm!: FormGroup;
// //   abstractForm!: FormGroup;
// //   posterForm!: FormGroup;

// //   allConferences: any[] = [];
// //   filteredConferences: any[] = [];
// //   selectedConference: any = null;

// //   isLoading = false;

// //   showConferencePopup = false;
// //   showAbstractPopup = false;
// //   showAbstractPendingPopup = false;
// //   showPosterPopup = false;
// //   showAbstractNotice = false;
// //   showPosterNotice = false;

// //   conferenceSearch = '';

// //   wantsAbstract: boolean | null = null;
// //   wantsPoster: boolean | null = null;
// //   abstractSaved = false;
// //   posterSaved = false;

// //   isLifetimeMember = false;

// //   // מחירים לתצוגה בלבד (מוצג למשתמש ב-$)
// //   readonly REGULAR_PRICE = 50;
// //   readonly LIFETIME_PRICE = 250;

// //   // מחירים בפועל לחיוב (נגבה בפועל ב-₪ דרך Tranzila)
// //   readonly REGULAR_PRICE_ILS = 150;
// //   readonly LIFETIME_PRICE_ILS = 750;

// //   // מחיר לתצוגה בלבד ($), אינו משמש לחיוב בפועל
// //   get registrationDisplayPrice(): number {
// //     return this.isLifetimeMember ? this.LIFETIME_PRICE : this.REGULAR_PRICE;
// //   }

// //   // הסכום שנשלח בפועל לתשלום (₪)
// //   get registrationAmount(): number {
// //     return this.isLifetimeMember ? this.LIFETIME_PRICE_ILS : this.REGULAR_PRICE_ILS;
// //   }

// //   get canSubmitPoster(): boolean {
// //     return !this.abstractSaved && (this.selectedConference?.allowsPoster === true);
// //   }

// //   // ספירת מילים חיה עבור שדה Full Name (מוצג במונה מתחת לשדה)
// //   get fullNameWordCount(): number {
// //     const val = this.regForm?.get('fullName')?.value || '';
// //     return val.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
// //   }

// //   currentStep = 1;
// //   totalSteps = 3;

// //   paymentInputData: any = null;

// //   constructor(
// //     private fb: FormBuilder,
// //     private apiService: ApiService,
// //     private router: Router
// //   ) { }

// //   ngOnInit(): void {
// //     this.initForms();
// //     this.loadConferences();
// //   }

// //   ngOnChanges(changes: SimpleChanges): void {
// //     if (changes['preselectedConferenceId'] && this.allConferences.length) {
// //       this.applyPreselection();
// //     }
// //   }

// //   initForms() {
// //     this.regForm = this.fb.group({
// //       fullName: ['', [
// //         Validators.required,
// //         Validators.minLength(5),
// //         // מאפשר אותיות (עברית/אנגלית), גרש, מרכאות, נקודה ומקף
// //         Validators.pattern(/^[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'".-]+(?:\s[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'".-]+)+$/),
// //         maxWords(25)
// //       ]],
// //       email: ['', [
// //         Validators.required,
// //         Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/)
// //       ]],
// //       affiliation: ['', [
// //         Validators.required,
// //         Validators.maxLength(35)
// //       ]],
// //       address: ['', [
// //         Validators.required,
// //         Validators.minLength(5),
// //         Validators.pattern(/^.+[\s,].+$/)
// //       ]],
// //       conferenceId: ['', Validators.required]
// //     });

// //     this.abstractForm = this.fb.group({
// //       title: ['', [Validators.required, maxWords(25)]],
// //       body: ['', [Validators.required, abstractValidator(250, 2500)]],
// //       notes: ['']
// //     });

// //     this.posterForm = this.fb.group({
// //       title: ['', [Validators.required, maxWords(25)]],
// //       authors: ['', Validators.required],
// //       notes: ['']
// //     });
// //   }

// //   loadConferences() {
// //     this.isLoading = true;
// //     this.apiService.getSurveys().subscribe({
// //       next: (data) => {
// //         this.allConferences = data.map(conf => ({
// //           ...conf,
// //           id: conf.Id || conf._id || conf.id,
// //           name: conf.Name || conf.name || conf.Conference || 'Unnamed Conference',
// //           location: conf.Location || conf.location || '',
// //           description: conf.Description || conf.description || '',
// //           abstractGuidelines: conf.AbstractGuidelines || conf.abstractGuidelines || '',
// //           allowsAbstract: conf.AbstractSubmission || conf.Abstract_submission || conf.abstract_submission || false,
// //           allowsPoster: conf.AllowsPoster || conf.allowsPoster || false,
// //           posterGuidelines: conf.PosterGuidelines || conf.posterGuidelines || ''
// //         }));
// //         this.filteredConferences = [...this.allConferences];
// //         this.isLoading = false;
// //         this.applyPreselection();
// //       },
// //       error: (err) => {
// //         console.error('Error loading conferences', err);
// //         this.isLoading = false;
// //       }
// //     });
// //   }

// //   private applyPreselection(): void {
// //     if (!this.preselectedConferenceId) return;
// //     const match = this.allConferences.find(c =>
// //       c.id === this.preselectedConferenceId || c._id === this.preselectedConferenceId
// //     );
// //     if (match) {
// //       this.selectConference(match);
// //       if (this.autoOpenAbstract) {
// //         this.onAbstractChoice(true);
// //       }
// //     }
// //   }

// //   openConferencePopup() {
// //     this.conferenceSearch = '';
// //     this.filteredConferences = [...this.allConferences];
// //     this.showConferencePopup = true;
// //   }

// //   closeConferencePopup() { this.showConferencePopup = false; }

// //   onConferenceSearch(event: Event) {
// //     const inputElement = event.target as HTMLInputElement;
// //     const term = inputElement.value.toLowerCase();
// //     if (!term) {
// //       this.filteredConferences = [...this.allConferences];
// //     } else {
// //       this.filteredConferences = this.allConferences.filter(c =>
// //         c.name?.toLowerCase().includes(term) ||
// //         c.location?.toLowerCase().includes(term) ||
// //         c.description?.toLowerCase().includes(term)
// //       );
// //     }
// //   }

// //   selectConference(conf: any) {
// //     this.selectedConference = conf;
// //     const id = conf.id || conf._id;
// //     this.regForm.patchValue({ conferenceId: id });
// //     this.wantsAbstract = null;
// //     this.wantsPoster = null;
// //     this.abstractSaved = false;
// //     this.posterSaved = false;
// //     this.showAbstractNotice = false;
// //     this.showPosterNotice = false;
// //     this.showConferencePopup = false;
// //   }

// //   // ══ PLAN SELECTION (Standard / Mind-IL Honored) ══
// //   selectPlan(isLifetime: boolean): void {
// //     this.isLifetimeMember = isLifetime;
// //     // הערה: אין יותר איפוס של wantsAbstract/wantsPoster כאן —
// //     // הגשת תקציר/פוסטר תלויה עכשיו בכנס הנבחר בלבד, לא במסלול הרישום
// //   }

// //   // ══ ABSTRACT ══
// //   onAbstractChoice(wants: boolean) {
// //     this.wantsAbstract = wants;
// //     if (wants) {
// //       this.abstractForm.reset();
// //       this.showAbstractPopup = true;
// //       this.wantsPoster = null;
// //       this.posterSaved = false;
// //       this.showPosterNotice = false;
// //       this.showPosterPopup = false;
// //     } else {
// //       this.showAbstractPopup = false;
// //       this.abstractSaved = false;
// //       this.showAbstractNotice = false;
// //     }
// //   }

// //   closeAbstractPopup() {
// //     this.showAbstractPopup = false;
// //     if (!this.abstractSaved) {
// //       this.wantsAbstract = null;
// //     }
// //   }

// //   saveAbstract() {
// //     if (this.abstractForm.invalid) {
// //       this.abstractForm.markAllAsTouched();
// //       return;
// //     }
// //     this.abstractSaved = true;
// //     this.showAbstractPopup = false;
// //     // מציגים פופאפ שמסביר שהתקציר עובר אישור,
// //     // ושכדי לבקש הצגה כפוסטר יש לציין זאת ב-Additional Notes
// //     this.showAbstractPendingPopup = true;
// //   }

// //   closeAbstractPendingPopup() {
// //     this.showAbstractPendingPopup = false;
// //     // לאחר סגירת הפופאפ, מציגים את הודעת האישור הרגילה על התקציר שנשמר
// //     this.showAbstractNotice = true;
// //   }

// //   closeAbstractNotice() { this.showAbstractNotice = false; }

// //   // ══ POSTER ══
// //   onPosterOnlyChoice() {
// //     this.wantsAbstract = false;
// //     this.wantsPoster = true;
// //     this.posterForm.reset();
// //     this.showPosterPopup = true;
// //     this.abstractSaved = false;
// //     this.showAbstractNotice = false;
// //     this.showAbstractPopup = false;
// //   }

// //   onNoSubmission() {
// //     this.wantsAbstract = false;
// //     this.wantsPoster = false;
// //     this.abstractSaved = false;
// //     this.posterSaved = false;
// //     this.showAbstractPopup = false;
// //     this.showPosterPopup = false;
// //     this.showAbstractNotice = false;
// //     this.showPosterNotice = false;
// //   }

// //   closePosterPopup() {
// //     this.showPosterPopup = false;
// //     if (!this.posterSaved) {
// //       this.wantsPoster = null;
// //     }
// //   }

// //   savePoster() {
// //     if (this.posterForm.invalid) {
// //       this.posterForm.markAllAsTouched();
// //       return;
// //     }
// //     this.posterSaved = true;
// //     this.showPosterPopup = false;
// //     this.showPosterNotice = true;
// //   }

// //   closePosterNotice() { this.showPosterNotice = false; }

// //   // ══ STEPS ══
// //   private stepFields: { [key: number]: string[] } = {
// //     1: ['conferenceId'],
// //     2: ['fullName', 'email', 'affiliation', 'address'],
// //     3: []
// //   };

// //   isStepValid(step: number): boolean {
// //     return this.stepFields[step].every(field => this.regForm.get(field)?.valid);
// //   }

// //   nextStep(): void {
// //     this.stepFields[this.currentStep].forEach(field => this.regForm.get(field)?.markAsTouched());
// //     if (!this.isStepValid(this.currentStep)) return;
// //     if (this.currentStep < this.totalSteps) this.currentStep++;
// //   }

// //   prevStep(): void {
// //     if (this.currentStep > 1) this.currentStep--;
// //   }

// //   goToStep(step: number): void {
// //     if (step < this.currentStep) { this.currentStep = step; return; }
// //     for (let i = 1; i < step; i++) {
// //       if (!this.isStepValid(i)) return;
// //     }
// //     this.currentStep = step;
// //   }

// //   // ══ SUBMIT ══
// //   onSubmit() {
// //     if (this.regForm.invalid) {
// //       this.regForm.markAllAsTouched();
// //       for (let step = 1; step <= this.totalSteps; step++) {
// //         if (!this.isStepValid(step)) { this.currentStep = step; break; }
// //       }
// //       return;
// //     }

// //     this.isLoading = true;
// //     const formVal = this.regForm.value;
// //     const abstract = this.abstractSaved ? this.abstractForm.value : null;
// //     const poster = this.posterSaved ? this.posterForm.value : null;

// //     const payload = {
// //       FullName: formVal.fullName,
// //       Email: formVal.email,
// //       Affiliation: formVal.affiliation,
// //       Address: formVal.address,
// //       ConferenceId: formVal.conferenceId,
// //       IsLifetimeMember: this.isLifetimeMember,
// //       HasAbstract: this.abstractSaved,
// //       AbstractTitle: abstract?.title || null,
// //       AbstractBody: abstract?.body || null,
// //       AbstractNotes: abstract?.notes || null,
// //       HasPoster: this.posterSaved,
// //       PosterTitle: poster?.title || null,
// //       PosterAuthors: poster?.authors || null,
// //       PosterNotes: poster?.notes || null
// //     };

// //     this.apiService.registerAttendee(payload).subscribe({
// //       next: (res: any) => {
// //         this.isLoading = false;
// //         const orderId = res.orderId || res.OrderId;
// //         this.paymentInputData = {
// //           ...payload,
// //           orderId: orderId,
// //           // הסכום שנשלח בפועל לתשלום הוא בש"ח (150 / 750),
// //           // בעוד שבטופס הרישום מוצג למשתמש $50 / $250 בלבד
// //           amount: this.registrationAmount,
// //           currency: 'ILS'
// //         };
// //         // מעבר לשלב 3 (Payment) — עמוד התשלום של Tranzila ייטען ישירות בתוך האשף,
// //         // במקום להיפתח בחלון מודלי נפרד
// //         this.currentStep = 3;
// //       },
// //       error: (err) => {
// //         this.isLoading = false;
// //         console.error('Server error details:', err);
// //         const msg = err.error?.Message || err.error || 'Error saving registration details';
// //         alert(msg);
// //       }
// //     });
// //   }

// //   get f() { return this.regForm.controls; }
// //   get af() { return this.abstractForm.controls; }
// //   get pf() { return this.posterForm.controls; }
// // }
// import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
// export class RegistrationFormComponent implements OnInit, OnChanges {

//   @Input() preselectedConferenceId: string | null = null;
//   @Input() autoOpenAbstract: boolean = false;

//   regForm!: FormGroup;
//   abstractForm!: FormGroup;
//   posterForm!: FormGroup;

//   allConferences: any[] = [];
//   filteredConferences: any[] = [];
//   selectedConference: any = null;

//   isLoading = false;

//   showConferencePopup = false;
//   showAbstractPopup = false;
//   showAbstractPendingPopup = false;
//   showPosterPopup = false;
//   showAbstractNotice = false;
//   showPosterNotice = false;

//   conferenceSearch = '';

//   wantsAbstract: boolean | null = null;
//   wantsPoster: boolean | null = null;
//   abstractSaved = false;
//   posterSaved = false;

//   isLifetimeMember = false;

//   // מחירים לתצוגה בלבד (מוצג למשתמש ב-$)
//   readonly REGULAR_PRICE = 50;
//   readonly LIFETIME_PRICE = 250;

//   // מחירים בפועל לחיוב (נגבה בפועל ב-₪ דרך Tranzila)
//   readonly REGULAR_PRICE_ILS = 150;
//   readonly LIFETIME_PRICE_ILS = 750;

//   // מחיר לתצוגה בלבד ($), אינו משמש לחיוב בפועל
//   get registrationDisplayPrice(): number {
//     return this.isLifetimeMember ? this.LIFETIME_PRICE : this.REGULAR_PRICE;
//   }

//   // הסכום שנשלח בפועל לתשלום (₪)
//   get registrationAmount(): number {
//     return this.isLifetimeMember ? this.LIFETIME_PRICE_ILS : this.REGULAR_PRICE_ILS;
//   }

//   get canSubmitPoster(): boolean {
//     return !this.abstractSaved && (this.selectedConference?.allowsPoster === true);
//   }

//   // ספירת מילים חיה עבור שדה Full Name (מוצג במונה מתחת לשדה)
//   get fullNameWordCount(): number {
//     const val = this.regForm?.get('fullName')?.value || '';
//     return val.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
//   }

//   currentStep = 1;
//   totalSteps = 3;

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

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['preselectedConferenceId'] && this.allConferences.length) {
//       this.applyPreselection();
//     }
//   }

//   initForms() {
//     this.regForm = this.fb.group({
//       fullName: ['', [
//         Validators.required,
//         Validators.minLength(5),
//         // מאפשר אותיות (עברית/אנגלית), גרש, מרכאות, נקודה ומקף
//         Validators.pattern(/^[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'".-]+(?:\s[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'".-]+)+$/),
//         maxWords(25)
//       ]],
//       email: ['', [
//         Validators.required,
//         Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/)
//       ]],
//       affiliation: ['', [
//         Validators.required,
//         Validators.maxLength(35)
//       ]],
//       address: ['', [
//         Validators.required,
//         Validators.minLength(5),
//         Validators.pattern(/^.+[\s,].+$/)
//       ]],
//       conferenceId: ['', Validators.required]
//     });

//     this.abstractForm = this.fb.group({
//       title: ['', [Validators.required, maxWords(25)]],
//       body: ['', [Validators.required, abstractValidator(250, 2500)]],
//       notes: ['']
//     });

//     this.posterForm = this.fb.group({
//       title: ['', [Validators.required, maxWords(25)]],
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
//           name: conf.Name || conf.name || conf.Conference || 'Unnamed Conference',
//           location: conf.Location || conf.location || '',
//           description: conf.Description || conf.description || '',
//           abstractGuidelines: conf.AbstractGuidelines || conf.abstractGuidelines || '',
//           allowsAbstract: conf.AbstractSubmission || conf.Abstract_submission || conf.abstract_submission || false,
//           allowsPoster: conf.AllowsPoster || conf.allowsPoster || false,
//           posterGuidelines: conf.PosterGuidelines || conf.posterGuidelines || ''
//         }));
//         this.filteredConferences = [...this.allConferences];
//         this.isLoading = false;
//         this.applyPreselection();
//       },
//       error: (err) => {
//         console.error('Error loading conferences', err);
//         this.isLoading = false;
//       }
//     });
//   }

//   private applyPreselection(): void {
//     if (!this.preselectedConferenceId) return;
//     const match = this.allConferences.find(c =>
//       c.id === this.preselectedConferenceId || c._id === this.preselectedConferenceId
//     );
//     if (match) {
//       this.selectConference(match);
//       if (this.autoOpenAbstract) {
//         this.onAbstractChoice(true);
//       }
//     }
//   }

//   openConferencePopup() {
//     this.conferenceSearch = '';
//     this.filteredConferences = [...this.allConferences];
//     this.showConferencePopup = true;
//   }

//   closeConferencePopup() { this.showConferencePopup = false; }

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
//     this.regForm.patchValue({ conferenceId: id });
//     this.wantsAbstract = null;
//     this.wantsPoster = null;
//     this.abstractSaved = false;
//     this.posterSaved = false;
//     this.showAbstractNotice = false;
//     this.showPosterNotice = false;
//     this.showConferencePopup = false;
//   }

//   // ══ PLAN SELECTION (Standard / Mind-IL Honored) ══
//   selectPlan(isLifetime: boolean): void {
//     this.isLifetimeMember = isLifetime;
//     // הערה: אין יותר איפוס של wantsAbstract/wantsPoster כאן —
//     // הגשת תקציר/פוסטר תלויה עכשיו בכנס הנבחר בלבד, לא במסלול הרישום
//   }

//   // ══ ABSTRACT ══
//   onAbstractChoice(wants: boolean) {
//     this.wantsAbstract = wants;
//     if (wants) {
//       this.abstractForm.reset();
//       this.showAbstractPopup = true;
//       this.wantsPoster = null;
//       this.posterSaved = false;
//       this.showPosterNotice = false;
//       this.showPosterPopup = false;
//     } else {
//       this.showAbstractPopup = false;
//       this.abstractSaved = false;
//       this.showAbstractNotice = false;
//     }
//   }

//   closeAbstractPopup() {
//     this.showAbstractPopup = false;
//     if (!this.abstractSaved) {
//       this.wantsAbstract = null;
//     }
//   }

//   saveAbstract() {
//     if (this.abstractForm.invalid) {
//       this.abstractForm.markAllAsTouched();
//       return;
//     }
//     this.abstractSaved = true;
//     this.showAbstractPopup = false;
//     // מציגים פופאפ שמסביר שהתקציר עובר אישור,
//     // ושכדי לבקש הצגה כפוסטר יש לציין זאת ב-Additional Notes
//     this.showAbstractPendingPopup = true;
//   }

//   closeAbstractPendingPopup() {
//     this.showAbstractPendingPopup = false;
//     // לאחר סגירת הפופאפ, מציגים את הודעת האישור הרגילה על התקציר שנשמר
//     this.showAbstractNotice = true;
//   }

//   closeAbstractNotice() { this.showAbstractNotice = false; }

//   // ══ POSTER ══
//   onPosterOnlyChoice() {
//     this.wantsAbstract = false;
//     this.wantsPoster = true;
//     this.posterForm.reset();
//     this.showPosterPopup = true;
//     this.abstractSaved = false;
//     this.showAbstractNotice = false;
//     this.showAbstractPopup = false;
//   }

//   onNoSubmission() {
//     this.wantsAbstract = false;
//     this.wantsPoster = false;
//     this.abstractSaved = false;
//     this.posterSaved = false;
//     this.showAbstractPopup = false;
//     this.showPosterPopup = false;
//     this.showAbstractNotice = false;
//     this.showPosterNotice = false;
//   }

//   closePosterPopup() {
//     this.showPosterPopup = false;
//     if (!this.posterSaved) {
//       this.wantsPoster = null;
//     }
//   }

//   savePoster() {
//     if (this.posterForm.invalid) {
//       this.posterForm.markAllAsTouched();
//       return;
//     }
//     this.posterSaved = true;
//     this.showPosterPopup = false;
//     this.showPosterNotice = true;
//   }

//   closePosterNotice() { this.showPosterNotice = false; }

//   // ══ STEPS ══
//   private stepFields: { [key: number]: string[] } = {
//     1: ['conferenceId'],
//     2: ['fullName', 'email', 'affiliation', 'address'],
//     3: []
//   };

//   isStepValid(step: number): boolean {
//     return this.stepFields[step].every(field => this.regForm.get(field)?.valid);
//   }

//   nextStep(): void {
//     this.stepFields[this.currentStep].forEach(field => this.regForm.get(field)?.markAsTouched());
//     if (!this.isStepValid(this.currentStep)) return;
//     if (this.currentStep < this.totalSteps) this.currentStep++;
//   }

//   prevStep(): void {
//     if (this.currentStep > 1) this.currentStep--;
//   }

//   goToStep(step: number): void {
//     if (step < this.currentStep) { this.currentStep = step; return; }
//     for (let i = 1; i < step; i++) {
//       if (!this.isStepValid(i)) return;
//     }
//     this.currentStep = step;
//   }

//   // ══ SUBMIT ══
//   onSubmit() {
//     if (this.regForm.invalid) {
//       this.regForm.markAllAsTouched();
//       for (let step = 1; step <= this.totalSteps; step++) {
//         if (!this.isStepValid(step)) { this.currentStep = step; break; }
//       }
//       return;
//     }

//     this.isLoading = true;
//     const formVal = this.regForm.value;
//     const abstract = this.abstractSaved ? this.abstractForm.value : null;
//     const poster = this.posterSaved ? this.posterForm.value : null;

//     const payload = {
//       FullName: formVal.fullName,
//       Email: formVal.email,
//       Affiliation: formVal.affiliation,
//       Address: formVal.address,
//       ConferenceId: formVal.conferenceId,
//       IsLifetimeMember: this.isLifetimeMember,
//       HasAbstract: this.abstractSaved,
//       AbstractTitle: abstract?.title || null,
//       AbstractBody: abstract?.body || null,
//       AbstractNotes: abstract?.notes || null,
//       HasPoster: this.posterSaved,
//       PosterTitle: poster?.title || null,
//       PosterAuthors: poster?.authors || null,
//       PosterNotes: poster?.notes || null
//     };

//     this.apiService.registerAttendee(payload).subscribe({
//       next: (res: any) => {
//         this.isLoading = false;
//         const orderId = res.orderId || res.OrderId;
//         this.paymentInputData = {
//           ...payload,
//           orderId: orderId,
//           // הסכום שנשלח בפועל לתשלום הוא בש"ח (150 / 750),
//           // בעוד שבטופס הרישום מוצג למשתמש $50 / $250 בלבד
//           amount: this.registrationAmount,
//           currency: 'ILS'
//         };
//         // מעבר לשלב 3 (Payment) — עמוד התשלום של Tranzila ייטען ישירות בתוך האשף,
//         // במקום להיפתח בחלון מודלי נפרד
//         this.currentStep = 3;
//       },
//       error: (err) => {
//         this.isLoading = false;
//         console.error('Server error details:', err);
//         const msg = err.error?.Message || err.error || 'Error saving registration details';
//         alert(msg);
//       }
//     });
//   }

//   get f() { return this.regForm.controls; }
//   get af() { return this.abstractForm.controls; }
//   get pf() { return this.posterForm.controls; }
// }

import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  showAbstractPendingPopup = false;
  showPosterPopup = false;
  showAbstractNotice = false;
  showPosterNotice = false;

  conferenceSearch = '';

  wantsAbstract: boolean | null = null;
  wantsPoster: boolean | null = null;
  abstractSaved = false;
  posterSaved = false;

  isLifetimeMember = false;

  // מחירים לתצוגה בלבד (מוצג למשתמש ב-$)
  readonly REGULAR_PRICE = 50;
  readonly LIFETIME_PRICE = 250;

  // מחירים בפועל לחיוב (נגבה בפועל ב-₪ דרך Tranzila)
  readonly REGULAR_PRICE_ILS = 150;
  readonly LIFETIME_PRICE_ILS = 750;

  // מחיר לתצוגה בלבד ($), אינו משמש לחיוב בפועל
  get registrationDisplayPrice(): number {
    return this.isLifetimeMember ? this.LIFETIME_PRICE : this.REGULAR_PRICE;
  }

  // הסכום שנשלח בפועל לתשלום (₪)
  get registrationAmount(): number {
    return this.isLifetimeMember ? this.LIFETIME_PRICE_ILS : this.REGULAR_PRICE_ILS;
  }

  get canSubmitPoster(): boolean {
    return !this.abstractSaved && (this.selectedConference?.allowsPoster === true);
  }

  // ספירת מילים חיה עבור שדה Full Name (מוצג במונה מתחת לשדה)
  get fullNameWordCount(): number {
    const val = this.regForm?.get('fullName')?.value || '';
    return val.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
  }

  currentStep = 1;
  totalSteps = 3;

  paymentInputData: any = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute // ⭐ חדש - כדי לקרוא את ה-sessionId מה-URL
  ) { }

  ngOnInit(): void {
    this.initForms();

    // ⭐ חדש: הראוט מוגדר כ-register/:sessionId, אבל הקומפוננטה מוגדרת עם
    // @Input() preselectedConferenceId שאף אחד לא מזריק כשהיא נטענת ישירות
    // דרך ה-Router (בלי קומפוננטת-אב). לכן קוראים את הפרמטר מה-URL בעצמנו
    // ומשתמשים בו כ-preselection - זו הסיבה שכפתור ה-Register בעמוד הכנס
    // מעולם לא פתח את הטופס עם הכנס הספציפי שנבחר.
    const sessionIdFromRoute = this.route.snapshot.paramMap.get('sessionId');
    if (sessionIdFromRoute && !this.preselectedConferenceId) {
      this.preselectedConferenceId = sessionIdFromRoute;
    }

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
        // מאפשר אותיות (עברית/אנגלית), גרש, מרכאות, נקודה ומקף
        Validators.pattern(/^[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'".-]+(?:\s[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'".-]+)+$/),
        maxWords(25)
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/)
      ]],
      affiliation: ['', [
        Validators.required,
        Validators.maxLength(35)
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^.+[\s,].+$/)
      ]],
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
          allowsAbstract: conf.AbstractSubmission || conf.Abstract_submission || conf.abstract_submission || false,
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

  // ══ PLAN SELECTION (Standard / Mind-IL Honored) ══
  selectPlan(isLifetime: boolean): void {
    this.isLifetimeMember = isLifetime;
    // הערה: אין יותר איפוס של wantsAbstract/wantsPoster כאן —
    // הגשת תקציר/פוסטר תלויה עכשיו בכנס הנבחר בלבד, לא במסלול הרישום
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
      this.showPosterPopup = false;
    } else {
      this.showAbstractPopup = false;
      this.abstractSaved = false;
      this.showAbstractNotice = false;
    }
  }

  closeAbstractPopup() {
    this.showAbstractPopup = false;
    if (!this.abstractSaved) {
      this.wantsAbstract = null;
    }
  }

  saveAbstract() {
    if (this.abstractForm.invalid) {
      this.abstractForm.markAllAsTouched();
      return;
    }
    this.abstractSaved = true;
    this.showAbstractPopup = false;
    // מציגים פופאפ שמסביר שהתקציר עובר אישור,
    // ושכדי לבקש הצגה כפוסטר יש לציין זאת ב-Additional Notes
    this.showAbstractPendingPopup = true;
  }

  closeAbstractPendingPopup() {
    this.showAbstractPendingPopup = false;
    // לאחר סגירת הפופאפ, מציגים את הודעת האישור הרגילה על התקציר שנשמר
    this.showAbstractNotice = true;
  }

  closeAbstractNotice() { this.showAbstractNotice = false; }

  // ══ POSTER ══
  onPosterOnlyChoice() {
    this.wantsAbstract = false;
    this.wantsPoster = true;
    this.posterForm.reset();
    this.showPosterPopup = true;
    this.abstractSaved = false;
    this.showAbstractNotice = false;
    this.showAbstractPopup = false;
  }

  onNoSubmission() {
    this.wantsAbstract = false;
    this.wantsPoster = false;
    this.abstractSaved = false;
    this.posterSaved = false;
    this.showAbstractPopup = false;
    this.showPosterPopup = false;
    this.showAbstractNotice = false;
    this.showPosterNotice = false;
  }

  closePosterPopup() {
    this.showPosterPopup = false;
    if (!this.posterSaved) {
      this.wantsPoster = null;
    }
  }

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
    2: ['fullName', 'email', 'affiliation', 'address'],
    3: []
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
      Affiliation: formVal.affiliation,
      Address: formVal.address,
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
          // הסכום שנשלח בפועל לתשלום הוא בש"ח (150 / 750),
          // בעוד שבטופס הרישום מוצג למשתמש $50 / $250 בלבד
          amount: this.registrationAmount,
          currency: 'ILS'
        };
        // מעבר לשלב 3 (Payment) — עמוד התשלום של Tranzila ייטען ישירות בתוך האשף,
        // במקום להיפתח בחלון מודלי נפרד
        this.currentStep = 3;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Server error details:', err);
        const msg = err.error?.Message || err.error || 'Error saving registration details';
        alert(msg);
      }
    });
  }

  get f() { return this.regForm.controls; }
  get af() { return this.abstractForm.controls; }
  get pf() { return this.posterForm.controls; }
}