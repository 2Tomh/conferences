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
  showAlreadyRegisteredPopup = false; // ⭐ הפופ-אפ החדש לזיהוי רישום כפול

  conferenceSearch = '';
  wantsAbstract: boolean | null = null;
  wantsPoster: boolean | null = null;
  abstractSaved = false;
  posterSaved = false;
  isLifetimeMember = false;

  readonly REGULAR_PRICE = 50;
  readonly LIFETIME_PRICE = 250;
  readonly REGULAR_PRICE_ILS = 150;
  readonly LIFETIME_PRICE_ILS = 750;

  get registrationDisplayPrice(): number {
    return this.isLifetimeMember ? this.LIFETIME_PRICE : this.REGULAR_PRICE;
  }
  get registrationAmount(): number {
    return this.isLifetimeMember ? this.LIFETIME_PRICE_ILS : this.REGULAR_PRICE_ILS;
  }
  get canSubmitPoster(): boolean {
    return !this.abstractSaved && (this.selectedConference?.allowsPoster === true);
  }
  get fullNameWordCount(): number {
    const val = this.regForm?.get('fullName')?.value || '';
    return val.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
  }

  currentStep = 1;
  totalSteps = 3;
  paymentInputData: any = null;

  private readonly EXCLUDED_CONFERENCE_NAMES: string[] = [
    'Law',
    'Network Dynamics in Socio-Technical Systems: From Resilient Control to Incentives and Information Design',
    'Cancer Biology Across Scales',
    'Mid-Chain DeFi Conference',
        'Applied Mathematics'
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.setupRoleOtherValidation();
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
      fullName: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'".-]+(?:\s[\u0590-\u05FF\u05F0-\u05F4a-zA-Z'".-]+)+$/), maxWords(25)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/)]],
      affiliation: ['', [Validators.required, Validators.maxLength(35)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^.+[\s,].+$/)]],
      conferenceId: ['', Validators.required],
      role: ['', Validators.required],
      roleOther: ['']
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

  private setupRoleOtherValidation(): void {
    this.regForm.get('role')?.valueChanges.subscribe((val: string) => {
      const otherCtrl = this.regForm.get('roleOther');
      if (val === 'Other') {
        otherCtrl?.setValidators([Validators.required, Validators.maxLength(60)]);
      } else {
        otherCtrl?.clearValidators();
        otherCtrl?.setValue('');
      }
      otherCtrl?.updateValueAndValidity();
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
        }))
          .filter(conf => !this.EXCLUDED_CONFERENCE_NAMES.some(excluded => excluded.toLowerCase() === (conf.name || '').toLowerCase()));

        this.filteredConferences = [...this.allConferences];
        this.isLoading = false;
        this.applyPreselection();
      }
    });
  }

  private applyPreselection(): void {
    if (!this.preselectedConferenceId) return;
    const match = this.allConferences.find(c => c.id === this.preselectedConferenceId || c._id === this.preselectedConferenceId);
    if (match) {
      this.selectConference(match);
      if (this.autoOpenAbstract) this.onAbstractChoice(true);
    }
  }

  openConferencePopup() { this.conferenceSearch = ''; this.filteredConferences = [...this.allConferences]; this.showConferencePopup = true; }
  closeConferencePopup() { this.showConferencePopup = false; }

  onConferenceSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredConferences = !term ? [...this.allConferences] : this.allConferences.filter(c => c.name?.toLowerCase().includes(term));
  }

  selectConference(conf: any) {
    this.selectedConference = conf;
    this.regForm.patchValue({ conferenceId: conf.id || conf._id });
    this.wantsAbstract = null; this.wantsPoster = null;
    this.abstractSaved = false; this.posterSaved = false;
    this.showConferencePopup = false;
  }

  selectPlan(isLifetime: boolean): void { this.isLifetimeMember = isLifetime; }

  onAbstractChoice(wants: boolean) {
    this.wantsAbstract = wants;
    if (wants) { this.abstractForm.reset(); this.showAbstractPopup = true; }
  }

  saveAbstract() {
    if (this.abstractForm.invalid) { this.abstractForm.markAllAsTouched(); return; }
    this.abstractSaved = true; this.showAbstractPopup = false; this.showAbstractPendingPopup = true;
  }

  closeAbstractPendingPopup() { this.showAbstractPendingPopup = false; this.showAbstractNotice = true; }
  closeAbstractNotice() { this.showAbstractNotice = false; }

  onPosterOnlyChoice() { this.wantsAbstract = false; this.wantsPoster = true; this.showPosterPopup = true; }
  onNoSubmission() { this.wantsAbstract = false; this.wantsPoster = false; this.showAbstractPopup = false; this.showPosterPopup = false; }

  savePoster() {
    if (this.posterForm.invalid) { this.posterForm.markAllAsTouched(); return; }
    this.posterSaved = true; this.showPosterPopup = false; this.showPosterNotice = true;
  }

  // ניווט לבית
  redirectToHome(): void {
    this.showAlreadyRegisteredPopup = false;
    this.router.navigate(['/']);
  }

  private stepFields: { [key: number]: string[] } = {
    1: ['conferenceId'],
    2: ['fullName', 'email', 'affiliation', 'address', 'role', 'roleOther'],
    3: []
  };

  isStepValid(step: number): boolean { return this.stepFields[step].every(field => this.regForm.get(field)?.valid); }
  nextStep(): void {
    this.stepFields[this.currentStep].forEach(field => this.regForm.get(field)?.markAsTouched());
    if (this.isStepValid(this.currentStep) && this.currentStep < this.totalSteps) this.currentStep++;
  }
  prevStep(): void { if (this.currentStep > 1) this.currentStep--; }
  goToStep(step: number): void {
    for (let i = 1; i < step; i++) if (!this.isStepValid(i)) return;
    this.currentStep = step;
  }

onSubmit() {
  if (this.regForm.invalid) { this.regForm.markAllAsTouched(); return; }
  const formVal = this.regForm.value;
  const abstract = this.abstractSaved ? this.abstractForm.value : null;
  const poster = this.posterSaved ? this.posterForm.value : null;
  
  this.paymentInputData = {
    ...formVal,
    Role: formVal.role === 'Other' ? formVal.roleOther : formVal.role,
    RoleCategory: formVal.role,
    IsLifetimeMember: this.isLifetimeMember,
    HasAbstract: this.abstractSaved,
    AbstractTitle: abstract?.title || null,
    AbstractBody: abstract?.body || null,      // ⬅️ להוסיף
    AbstractNotes: abstract?.notes || null,    // ⬅️ להוסיף
    HasPoster: this.posterSaved,
    PosterTitle: poster?.title || null,        // ⬅️ להוסיף
    PosterAuthors: poster?.authors || null,    // ⬅️ להוסיף
    PosterNotes: poster?.notes || null,        // ⬅️ להוסיף
    amount: this.registrationAmount,
    currency: 'ILS'
  };
  this.currentStep = 3;
}

  get f() { return this.regForm.controls; }
  get af() { return this.abstractForm.controls; }
  get pf() { return this.posterForm.controls; }
}