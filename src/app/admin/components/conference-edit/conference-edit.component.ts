// // import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
// // import { ActivatedRoute } from '@angular/router';
// // import { ApiService } from '../../../services/api.service';

// // export type SubmissionType = 'abstract' | 'abstractOrPoster' | 'none';

// // @Component({
// //   selector: 'app-conference-edit',
// //   templateUrl: './conference-edit.component.html',
// //   styleUrls: ['./conference-edit.component.css']
// // })
// // export class ConferenceEditComponent implements OnInit {
// //   conferenceForm: FormGroup;
// //   currentStep = 1;
// //   totalSteps = 5;
// //   isEditMode = false;

// //   constructor(
// //     private fb: FormBuilder,
// //     private apiService: ApiService,
// //     private route: ActivatedRoute
// //   ) {
// //     this.conferenceForm = this.fb.group({
// //       id: [null],
// //       type: [''], // הוסף את השדה הזה
// //       category: [''],
// //       conference: [''],
// //       tagline: [''],
// //       description: [''],
// //       date: [''],
// //       location: [''],
// //       audience: [''],
// //       abstractDeadline: [''],
// //       registrationDeadline: [''],
// //       contactName: [''],
// //       contactEmail: [''],
// //       submissionType: ['none' as SubmissionType],
// //       abstractGuidelines: [''],
// //       abstractMaxLimit: [2500],
// //       posterGuidelines: [''],
// //       organizers: this.fb.array([]),
// //       programBlocks: this.fb.array([]),
// //       links: this.fb.group({
// //         survey: [''],
// //         website: ['']
// //       })
// //     });
// //   }

// //   ngOnInit(): void {
// //     const id = this.route.snapshot.paramMap.get('id');
// //     if (id) {
// //       this.isEditMode = true;
// //       this.apiService.getSurveyById(id).subscribe({
// //         next: (data) => this.populateForm(data),
// //         error: (err) => console.error('Error loading data:', err)
// //       });
// //     }
// //   }

// //   private populateForm(data: any): void {
// //     if (!data) return;

// //     const abstractOn = !!(data.Abstract_submission || data.abstract_submission);
// //     const posterOn = !!(data.AllowsPoster || data.allowsPoster);
// //     let submissionType: SubmissionType = 'none';
// //     if (abstractOn && posterOn) submissionType = 'abstractOrPoster';
// //     else if (abstractOn) submissionType = 'abstract';

// //     this.conferenceForm.patchValue({
// //       id: data._id || data.id || data.Id,
// //       category: data.Category || data.category,
// //       conference: data.Name || data.Conference || data.name || data.conference,
// //       tagline: data.Tagline || data.tagline,
// //       description: data.Description || data.description,
// //       date: data.Date || data.date,
// //       location: data.Location || data.location,
// //       audience: data.Audience || data.audience,
// //       abstractDeadline: data.AbstractDeadline || data.abstractDeadline,
// //       registrationDeadline: data.RegistrationDeadline || data.registrationDeadline,
// //       contactName: data.ContactName || data.contactName,
// //       contactEmail: data.ContactEmail || data.contactEmail,
// //       submissionType,
// //       abstractGuidelines: data.AbstractGuidelines || data.abstractGuidelines,
// //       abstractMaxLimit: data.AbstractMaxLimit || data.abstractMaxLimit || 2500,
// //       posterGuidelines: data.PosterGuidelines || data.posterGuidelines || '',
// //       links: data.Links || data.links || { survey: '', website: '' }
// //     });

// //     this.organizers.clear();
// //     const organizersList = data.Organizers || data.organizers || [];
// //     if (Array.isArray(organizersList)) {
// //       organizersList.forEach((o: string) => this.organizers.push(this.fb.control(o)));
// //     }

// //     this.program.clear();
// //     const programList = data.ProgramBlocks || data.programBlocks || [];
// //     if (Array.isArray(programList)) {
// //       programList.forEach((pb: any) => {
// //         this.program.push(this.fb.group({
// //           startTime: [pb.StartTime || pb.startTime || ''],
// //           endTime: [pb.EndTime || pb.endTime || ''],
// //           title: [pb.Title || pb.title || '']
// //         }));
// //       });
// //     }
// //   }

// //   get organizers(): FormArray { return this.conferenceForm.get('organizers') as FormArray; }
// //   get program(): FormArray { return this.conferenceForm.get('programBlocks') as FormArray; }

// //   addOrganizer(val = '') { this.organizers.push(this.fb.control(val)); }
// //   addProgramBlock() { this.program.push(this.fb.group({ startTime: '', endTime: '', title: '' })); }

// //   nextStep() { if (this.currentStep < this.totalSteps) this.currentStep++; }
// //   prevStep() { if (this.currentStep > 1) this.currentStep--; }

// //   setSubmissionType(type: SubmissionType): void {
// //     this.conferenceForm.get('submissionType')?.setValue(type);
// //   }

// //   saveConference() {
// //     if (this.conferenceForm.invalid) return;
// //     const formValue = this.conferenceForm.value;
// //     const submissionType: SubmissionType = formValue.submissionType;

// //     const payload = {
// //       Name: formValue.conference,
// //       Category: formValue.category,
// //       Tagline: formValue.tagline,
// //       Description: formValue.description,
// //       Date: formValue.date,
// //       Location: formValue.location,
// //       Audience: formValue.audience,
// //       AbstractDeadline: formValue.abstractDeadline,
// //       RegistrationDeadline: formValue.registrationDeadline,
// //       ContactName: formValue.contactName,
// //       ContactEmail: formValue.contactEmail,
// //       Abstract_submission: submissionType === 'abstract' || submissionType === 'abstractOrPoster',
// //       AllowsPoster: submissionType === 'abstractOrPoster',
// //       AbstractGuidelines: formValue.abstractGuidelines,
// //       AbstractMaxLimit: formValue.abstractMaxLimit,
// //       PosterGuidelines: formValue.posterGuidelines,
// //       Organizers: formValue.organizers,
// //       ProgramBlocks: formValue.programBlocks.map((pb: any) => ({
// //         StartTime: pb.startTime,
// //         EndTime: pb.endTime,
// //         Title: pb.title
// //       })),
// //       Links: formValue.links
// //     };

// //     const action = this.isEditMode
// //       ? this.apiService.updateConference(formValue.id, payload)
// //       : this.apiService.createConference(payload);

// //     action.subscribe({
// //       next: () => alert('הכנס נשמר בהצלחה!'),
// //       error: (err) => console.error('Error:', err)
// //     });
// //   }
// // }
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ApiService } from '../../../services/api.service';

// export type SubmissionType = 'abstract' | 'abstractOrPoster' | 'none';

// @Component({
//   selector: 'app-conference-edit',
//   templateUrl: './conference-edit.component.html',
//   styleUrls: ['./conference-edit.component.css']
// })
// export class ConferenceEditComponent implements OnInit {
//   conferenceForm: FormGroup;
//   currentStep = 1;
//   totalSteps = 5;
//   isEditMode = false;

//   constructor(
//     private fb: FormBuilder,
//     private apiService: ApiService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     this.conferenceForm = this.fb.group({
//       id: [null],
//       type: [''], // הוסף את השדה הזה
//       category: [''],
//       conference: [''],
//       tagline: [''],
//       description: [''],
//       date: [''],
//       location: [''],
//       audience: [''],
//       abstractDeadline: [''],
//       registrationDeadline: [''],
//       contactName: [''],
//       contactEmail: [''],
//       submissionType: ['none' as SubmissionType],
//       abstractGuidelines: [''],
//       abstractMaxLimit: [2500],
//       posterGuidelines: [''],
//       organizers: this.fb.array([]),
//       programBlocks: this.fb.array([]),
//       links: this.fb.group({
//         survey: [''],
//         website: ['']
//       })
//     });
//   }

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.isEditMode = true;
//       this.apiService.getSurveyById(id).subscribe({
//         next: (data) => this.populateForm(data),
//         error: (err) => console.error('Error loading data:', err)
//       });
//     }
//   }

//   private populateForm(data: any): void {
//     if (!data) return;

//     const abstractOn = !!(data.Abstract_submission || data.abstract_submission);
//     const posterOn = !!(data.AllowsPoster || data.allowsPoster);
//     let submissionType: SubmissionType = 'none';
//     if (abstractOn && posterOn) submissionType = 'abstractOrPoster';
//     else if (abstractOn) submissionType = 'abstract';

//     this.conferenceForm.patchValue({
//       id: data._id || data.id || data.Id,
//       type: data.Type || data.type || '',
//       category: data.Category || data.category,
//       conference: data.Name || data.Conference || data.name || data.conference,
//       tagline: data.Tagline || data.tagline,
//       description: data.Description || data.description,
//       date: data.Date || data.date,
//       location: data.Location || data.location,
//       audience: data.Audience || data.audience,
//       abstractDeadline: data.AbstractDeadline || data.abstractDeadline,
//       registrationDeadline: data.RegistrationDeadline || data.registrationDeadline,
//       contactName: data.ContactName || data.contactName,
//       contactEmail: data.ContactEmail || data.contactEmail,
//       submissionType,
//       abstractGuidelines: data.AbstractGuidelines || data.abstractGuidelines,
//       abstractMaxLimit: data.AbstractMaxLimit || data.abstractMaxLimit || 2500,
//       posterGuidelines: data.PosterGuidelines || data.posterGuidelines || '',
//       links: data.Links || data.links || { survey: '', website: '' }
//     });

//     this.organizers.clear();
//     const organizersList = data.Organizers || data.organizers || [];
//     if (Array.isArray(organizersList)) {
//       organizersList.forEach((o: string) => this.organizers.push(this.fb.control(o)));
//     }

//     this.program.clear();
//     const programList = data.ProgramBlocks || data.programBlocks || [];
//     if (Array.isArray(programList)) {
//       programList.forEach((pb: any) => {
//         this.program.push(this.fb.group({
//           startTime: [pb.StartTime || pb.startTime || ''],
//           endTime: [pb.EndTime || pb.endTime || ''],
//           title: [pb.Title || pb.title || '']
//         }));
//       });
//     }
//   }

//   get organizers(): FormArray { return this.conferenceForm.get('organizers') as FormArray; }
//   get program(): FormArray { return this.conferenceForm.get('programBlocks') as FormArray; }

//   addOrganizer(val = '') { this.organizers.push(this.fb.control(val)); }
//   addProgramBlock() { this.program.push(this.fb.group({ startTime: '', endTime: '', title: '' })); }

//   nextStep() { if (this.currentStep < this.totalSteps) this.currentStep++; }
//   prevStep() { if (this.currentStep > 1) this.currentStep--; }

//   setSubmissionType(type: SubmissionType): void {
//     this.conferenceForm.get('submissionType')?.setValue(type);
//   }

//   saveConference() {
//     if (this.conferenceForm.invalid) return;
//     const formValue = this.conferenceForm.value;
//     const submissionType: SubmissionType = formValue.submissionType;

//     const payload = {
//       Name: formValue.conference,
//       Type: formValue.type,
//       Category: formValue.category,
//       Tagline: formValue.tagline,
//       Description: formValue.description,
//       Date: formValue.date,
//       Location: formValue.location,
//       Audience: formValue.audience,
//       AbstractDeadline: formValue.abstractDeadline,
//       RegistrationDeadline: formValue.registrationDeadline,
//       ContactName: formValue.contactName,
//       ContactEmail: formValue.contactEmail,
//       Abstract_submission: submissionType === 'abstract' || submissionType === 'abstractOrPoster',
//       AllowsPoster: submissionType === 'abstractOrPoster',
//       AbstractGuidelines: formValue.abstractGuidelines,
//       AbstractMaxLimit: formValue.abstractMaxLimit,
//       PosterGuidelines: formValue.posterGuidelines,
//       Organizers: formValue.organizers,
//       ProgramBlocks: formValue.programBlocks.map((pb: any) => ({
//         StartTime: pb.startTime,
//         EndTime: pb.endTime,
//         Title: pb.title
//       })),
//       Links: formValue.links
//     };

//     const action = this.isEditMode
//       ? this.apiService.updateConference(formValue.id, payload)
//       : this.apiService.createConference(payload);

//     action.subscribe({
//       next: () => {
//         alert('הכנס נשמר בהצלחה!');
//         console.log('Save succeeded, navigating to /admin/dashboard...');
//         this.router.navigate(['/admin/dashboard']).then(success => {
//           console.log('Navigation result:', success);
//         }).catch(err => {
//           console.error('Navigation failed:', err);
//         });
//       },
//       error: (err) => console.error('Error:', err)
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

export type SubmissionType = 'abstract' | 'abstractOrPoster' | 'none';

@Component({
  selector: 'app-conference-edit',
  templateUrl: './conference-edit.component.html',
  styleUrls: ['./conference-edit.component.css']
})
export class ConferenceEditComponent implements OnInit {
  conferenceForm: FormGroup;
  currentStep = 1;
  totalSteps = 5;
  isEditMode = false;

  // חדש: תמיכה בכמה קטגוריות לכנס אחד. רשימת הקטגוריות הקבועה תואמת
  // למה שכבר קיים ב-category-navbar בעמוד הציבורי (conference-events).
  availableCategories = ['Humanities and Arts', 'Social Sciences & Law', 'BioMed', 'Engineering', 'Exact Sciences'];
  selectedCategories: string[] = [];

  toggleCategory(cat: string): void {
    const i = this.selectedCategories.indexOf(cat);
    if (i > -1) {
      this.selectedCategories.splice(i, 1);
    } else {
      this.selectedCategories.push(cat);
    }
  }

  isCategorySelected(cat: string): boolean {
    return this.selectedCategories.includes(cat);
  }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.conferenceForm = this.fb.group({
      id: [null],
      type: [''], // הוסף את השדה הזה
      category: [''],
      conference: [''],
      tagline: [''],
      description: [''],
      date: [''],
      location: [''],
      audience: [''],
      abstractDeadline: [''],
      registrationDeadline: [''],
      contactName: [''],
      contactEmail: [''],
      submissionType: ['none' as SubmissionType],
      abstractGuidelines: [''],
      abstractMaxLimit: [2500],
      posterGuidelines: [''],
      organizers: this.fb.array([]),
      programBlocks: this.fb.array([]),
      links: this.fb.group({
        survey: [''],
        website: ['']
      })
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.apiService.getSurveyById(id).subscribe({
        next: (data) => this.populateForm(data),
        error: (err) => console.error('Error loading data:', err)
      });
    }
  }

  private populateForm(data: any): void {
    if (!data) return;

    const abstractOn = !!(data.Abstract_submission || data.abstract_submission);
    const posterOn = !!(data.AllowsPoster || data.allowsPoster);
    let submissionType: SubmissionType = 'none';
    if (abstractOn && posterOn) submissionType = 'abstractOrPoster';
    else if (abstractOn) submissionType = 'abstract';

    // חדש: טעינת מערך קטגוריות, עם תאימות לאחור לשדה Category הישן (מחרוזת בודדת)
    const cats = data.Categories || data.categories || (data.Category || data.category ? [data.Category || data.category] : []);
    this.selectedCategories = Array.isArray(cats) ? [...cats] : [];

    this.conferenceForm.patchValue({
      id: data._id || data.id || data.Id,
      type: data.Type || data.type || '',
      category: data.Category || data.category,
      conference: data.Name || data.Conference || data.name || data.conference,
      tagline: data.Tagline || data.tagline,
      description: data.Description || data.description,
      date: data.Date || data.date,
      location: data.Location || data.location,
      audience: data.Audience || data.audience,
      abstractDeadline: data.AbstractDeadline || data.abstractDeadline,
      registrationDeadline: data.RegistrationDeadline || data.registrationDeadline,
      contactName: data.ContactName || data.contactName,
      contactEmail: data.ContactEmail || data.contactEmail,
      submissionType,
      abstractGuidelines: data.AbstractGuidelines || data.abstractGuidelines,
      abstractMaxLimit: data.AbstractMaxLimit || data.abstractMaxLimit || 2500,
      posterGuidelines: data.PosterGuidelines || data.posterGuidelines || '',
      links: data.Links || data.links || { survey: '', website: '' }
    });

    this.organizers.clear();
    const organizersList = data.Organizers || data.organizers || [];
    if (Array.isArray(organizersList)) {
      organizersList.forEach((o: string) => this.organizers.push(this.fb.control(o)));
    }

    this.program.clear();
    const programList = data.ProgramBlocks || data.programBlocks || [];
    if (Array.isArray(programList)) {
      programList.forEach((pb: any) => {
        this.program.push(this.fb.group({
          startTime: [pb.StartTime || pb.startTime || ''],
          endTime: [pb.EndTime || pb.endTime || ''],
          title: [pb.Title || pb.title || '']
        }));
      });
    }
  }

  get organizers(): FormArray { return this.conferenceForm.get('organizers') as FormArray; }
  get program(): FormArray { return this.conferenceForm.get('programBlocks') as FormArray; }

  addOrganizer(val = '') { this.organizers.push(this.fb.control(val)); }
  addProgramBlock() { this.program.push(this.fb.group({ startTime: '', endTime: '', title: '' })); }

  nextStep() { if (this.currentStep < this.totalSteps) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

  setSubmissionType(type: SubmissionType): void {
    this.conferenceForm.get('submissionType')?.setValue(type);
  }

  saveConference() {
    if (this.conferenceForm.invalid) return;
    const formValue = this.conferenceForm.value;
    const submissionType: SubmissionType = formValue.submissionType;

    const payload = {
      Name: formValue.conference,
      Type: formValue.type,
      Category: this.selectedCategories[0] || formValue.category || '', // תאימות לאחור
      Categories: this.selectedCategories, // חדש: מערך קטגוריות מלא
      Tagline: formValue.tagline,
      Description: formValue.description,
      Date: formValue.date,
      Location: formValue.location,
      Audience: formValue.audience,
      AbstractDeadline: formValue.abstractDeadline,
      RegistrationDeadline: formValue.registrationDeadline,
      ContactName: formValue.contactName,
      ContactEmail: formValue.contactEmail,
      Abstract_submission: submissionType === 'abstract' || submissionType === 'abstractOrPoster',
      AllowsPoster: submissionType === 'abstractOrPoster',
      AbstractGuidelines: formValue.abstractGuidelines,
      AbstractMaxLimit: formValue.abstractMaxLimit,
      PosterGuidelines: formValue.posterGuidelines,
      Organizers: formValue.organizers,
      ProgramBlocks: formValue.programBlocks.map((pb: any) => ({
        StartTime: pb.startTime,
        EndTime: pb.endTime,
        Title: pb.title
      })),
      Links: formValue.links
    };

    const action = this.isEditMode
      ? this.apiService.updateConference(formValue.id, payload)
      : this.apiService.createConference(payload);

    action.subscribe({
      next: () => {
        alert('הכנס נשמר בהצלחה!');
        console.log('Save succeeded, navigating to /admin/dashboard...');
        this.router.navigate(['/admin/dashboard']).then(success => {
          console.log('Navigation result:', success);
        }).catch(err => {
          console.error('Navigation failed:', err);
        });
      },
      error: (err) => console.error('Error:', err)
    });
  }
}