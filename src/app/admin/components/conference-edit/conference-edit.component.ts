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
      id: [null],
      type: [''],
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
      abstractGuidelines: [''],
      abstractMaxLimit: [2500],
      abstract_submission: [false],
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
        next: (data) => {
          if (!data) return;

          // 1. מיפוי שדות פשוטים וקישורים (Links)
          this.conferenceForm.patchValue({
            id: data.Id || data._id || data.id,
            // type: data.Type || data.type,
            category: data.Category || data.category,
            conference: data.Name || data.Conference || data.name || data.conference || '',
            tagline: data.Tagline || data.tagline,
            description: data.Description || data.description,
            date: data.Date || data.date,
            location: data.Location || data.location,
            audience: data.Audience || data.audience,
            abstractDeadline: data.AbstractDeadline || data.abstractDeadline,
            registrationDeadline: data.RegistrationDeadline || data.registrationDeadline,
            contactName: data.ContactName || data.contactName,
            contactEmail: data.ContactEmail || data.contactEmail,
            abstractGuidelines: data.AbstractGuidelines || data.abstractGuidelines,
            abstractMaxLimit: data.AbstractMaxLimit || data.abstractMaxLimit || 2500,
            abstract_submission: data.Abstract_submission || data.abstract_submission || false,
            links: data.Links || data.links || { survey: '', website: '' }
          });

          // 2. טעינת מערך המארגנים (Organizers)
          // מוודאים שקיימים נתונים לפני שמנקים וממלאים את המערך
          if (Array.isArray(data.Organizers)) {
            this.organizers.clear();
            data.Organizers.forEach((o: string) => {
              this.organizers.push(this.fb.control(o));
            });
          }

          // 3. טעינת מערך בלוקים של תוכנית (ProgramBlocks)
          // מוודאים שקיימים נתונים לפני שמנקים וממלאים את המערך
          if (Array.isArray(data.ProgramBlocks)) {
            this.program.clear();
            data.ProgramBlocks.forEach((pb: any) => {
              this.program.push(this.fb.group({
                startTime: [pb.StartTime || ''],
                endTime: [pb.EndTime || ''],
                title: [pb.Title || '']
              }));
            });
          }
        },
        error: (err) => {
          console.error('שגיאה בטעינת נתוני הכנס:', err);
        }
      });
    }
  }

  get organizers(): FormArray { return this.conferenceForm.get('organizers') as FormArray; }
  get program(): FormArray { return this.conferenceForm.get('programBlocks') as FormArray; }

  addOrganizer(val = '') { this.organizers.push(this.fb.control(val)); }
  addProgramBlock() { this.program.push(this.fb.group({ startTime: '', endTime: '', title: '' })); }

  nextStep() { if (this.currentStep < 3) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

  saveConference() {
    if (this.conferenceForm.valid) {
      const rawValue = this.conferenceForm.value;

      // מכין את ה-payload - שימוש בערכים נקיים
      const payload = {
        ...this.conferenceForm.value,
        Name: this.conferenceForm.value.conference // זה המפתח להחזרת השם ל-DB
      };
      delete payload.conference; // מנקה את השם הישן

      // מוודא שאין null ב-ID
      const idToUse = rawValue.id;

      // קריאה ל-API - השתמש בפונקציות המעודכנות
      const action = this.isEditMode
        ? this.apiService.updateConference(idToUse, payload)
        : this.apiService.createConference(payload);

      action.subscribe({
        next: () => alert('הכנס נשמר בהצלחה!'),
        error: (err) => console.error('Error saving:', err)
      });
    }
  }
}