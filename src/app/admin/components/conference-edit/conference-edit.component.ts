// // import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
// // import { ApiService } from 'src/app/services/api.service';

// // @Component({
// //   selector: 'app-conference-edit',
// //   templateUrl: './conference-edit.component.html',
// //   styleUrls: ['./conference-edit.component.css']
// // })
// // export class ConferenceEditComponent implements OnInit {
// //   conferenceForm: FormGroup;
// //   allSurveys: any[] = [];

// //   constructor(private fb: FormBuilder, private apiService: ApiService) {
// //     this.conferenceForm = this.fb.group({
// //       name: [''],
// //       tagline: [''],
// //       description: [''],
// //       date: [''],
// //       location: [''],
// //       organizersDetails: this.fb.array([]), // כאן נוסיף שדות דינמיים
// //       programBlocks: this.fb.array([]),
// //       surveyId: ['']
// //     });
// //   }
// //   ngOnInit(): void {
// //     this.apiService.getSurveys().subscribe(data => {
// //       this.allSurveys = data;
// //     });
// //   }
// //   addOrganizer() {
// //     const orgs = this.conferenceForm.get('organizersDetails') as FormArray;
// //     orgs.push(this.fb.group({ name: '', affiliation: '' }));
// //   }
// //   get organizers(): FormArray {
// //     return this.conferenceForm.get('organizersDetails') as FormArray;
// //   }
// //   get programBlocks(): FormArray {
// //     return this.conferenceForm.get('programBlocks') as FormArray;
// //   }
// //   saveConference() {
// //     if (this.conferenceForm.valid) {
// //       this.apiService.createConference(this.conferenceForm.value).subscribe(res => {
// //         alert('הכנס עלה בהצלחה!');
// //       });
// //     }
// //   }
// // }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
// import { ApiService } from 'src/app/services/api.service';

// @Component({
//   selector: 'app-conference-edit',
//   templateUrl: './conference-edit.component.html',
//   styleUrls: ['./conference-edit.component.css']
// })
// export class ConferenceEditComponent implements OnInit {
//   conferenceForm: FormGroup;
//   currentStep = 1; // העמוד הנוכחי בטופס

//   constructor(private fb: FormBuilder, private apiService: ApiService) {
//     this.conferenceForm = this.fb.group({
//       title: [''],
//       tagline: [''],
//       description: [''],
//       date: [''],
//       venue: [''],
//       audience: [''],
//       abstractDeadline: [''],
//       acceptsAbstracts: [false],
//       contactName: [''],
//       contactEmail: [''],
//       organizersDetails: this.fb.array([]),
//       programBlocks: this.fb.array([])
//     });
//   }

//   ngOnInit(): void { }

//   get organizers(): FormArray { return this.conferenceForm.get('organizersDetails') as FormArray; }
//   get program(): FormArray { return this.conferenceForm.get('programBlocks') as FormArray; }

//   addOrganizer() { this.organizers.push(this.fb.group({ name: '', affiliation: '' })); }
//   addProgramBlock() { this.program.push(this.fb.group({ startTime: '', endTime: '', title: '' })); }

//   // פונקציות הניווט בטופס
//   nextStep() { if (this.currentStep < 3) this.currentStep++; }
//   prevStep() { if (this.currentStep > 1) this.currentStep--; }

//   saveConference() {
//     if (this.conferenceForm.valid) {
//       const rawValue = this.conferenceForm.value;

//       // פונקציה עזר לניקוי שדות תאריך ריקים
//       const cleanDate = (dateValue: any) => {
//         return (dateValue && dateValue !== '') ? dateValue : null;
//       };

//       const payload = {
//         ...rawValue,
//         // דריסה של שדות התאריך בערך נקי
//         date: cleanDate(rawValue.date),
//         abstractDeadline: cleanDate(rawValue.abstractDeadline),
//         // המיפוי של המארגנים (כפי שנדרש בשרת שלך)
//         organizers: rawValue.organizersDetails.map((o: any) => `${o.name} (${o.affiliation})`)
//       };

//       // מחיקת השדות שלא קיימים בשרת (אם יש צורך)
//       delete payload.organizersDetails;

//       console.log('Sending to server:', payload);

//       this.apiService.createConference(payload).subscribe({
//         next: () => alert('הכנס עודכן בהצלחה!'),
//         error: (err) => console.error('Error saving:', err)
//       });
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-conference-edit',
  templateUrl: './conference-edit.component.html',
  styleUrls: ['./conference-edit.component.css']
})
export class ConferenceEditComponent implements OnInit {
  conferenceForm: FormGroup;
  currentStep = 1;
  isEditMode = false;

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.conferenceForm = this.fb.group({
      id: [null], // חשוב ל-Update
      title: [''],
      tagline: [''],
      description: [''],
      date: [''],
      venue: [''],
      audience: [''],
      abstractDeadline: [''],
      acceptsAbstracts: [false],
      contactName: [''],
      contactEmail: [''],
      organizersDetails: this.fb.array([]),
      programBlocks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.apiService.getSurveyById(id).subscribe(data => {
        // כאן תמפה את הנתונים מהשרת חזרה לטופס
        this.conferenceForm.patchValue(data);
      });
    }
  }

  get organizers(): FormArray { return this.conferenceForm.get('organizersDetails') as FormArray; }
  get program(): FormArray { return this.conferenceForm.get('programBlocks') as FormArray; }

  addOrganizer() { this.organizers.push(this.fb.group({ name: '', affiliation: '' })); }
  addProgramBlock() { this.program.push(this.fb.group({ startTime: '', endTime: '', title: '' })); }

  nextStep() { if (this.currentStep < 3) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

  saveConference() {
    if (this.conferenceForm.valid) {
      const raw = this.conferenceForm.value;
      const payload = {
        ...raw,
        date: (raw.date && raw.date !== '') ? raw.date : null,
        abstractDeadline: (raw.abstractDeadline && raw.abstractDeadline !== '') ? raw.abstractDeadline : null,
        organizers: raw.organizersDetails.map((o: any) => `${o.name} (${o.affiliation})`)
      };
      delete payload.organizersDetails;

      const action = this.isEditMode 
        ? this.apiService.updateConference(raw.id, payload) 
        : this.apiService.createConference(payload);

      action.subscribe({
        next: () => alert('נשמר בהצלחה!'),
        error: (err) => console.error(err)
      });
    }
  }
}