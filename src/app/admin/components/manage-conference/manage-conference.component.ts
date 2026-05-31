import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-manage-conference',
  templateUrl: './manage-conference.component.html',
  styleUrls: ['./manage-conference.component.css']
})
export class ManageConferenceComponent implements OnInit {
  conferenceForm!: FormGroup;
  isEditMode = false;
  conferenceId!: string;
  minDate: string = new Date().toISOString().split('T')[0];

  facultyData: { [key: string]: string[] } = {};
  faculties: string[] = [];
  schools: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadFaculties();

    this.conferenceId = this.route.snapshot.params.id;
    if (this.conferenceId) {
      this.isEditMode = true;
      this.apiService.getConferenceById(this.conferenceId).subscribe(data => {
        if (data) {
          const dateVal = data.date || data.Date;
          if (dateVal) {
            const d = new Date(dateVal);
            this.conferenceForm.patchValue({
              title: data.name || data.Name,
              description: data.description || data.Description,
              dateOnly: d.toISOString().split('T')[0],
              timeOnly: d.toTimeString().slice(0, 5),
              location: data.location || data.Location,
              maxParticipants: data.maxParticipants || data.MaxParticipants,
              facultyName: data.facultyName || data.FacultyName || '',
              schoolName: data.schoolName || data.SchoolName || ''
            });
            // טען בתי ספר לפי פקולטה
            const faculty = data.facultyName || data.FacultyName;
            if (faculty && this.facultyData[faculty]) {
              this.schools = [...new Set(this.facultyData[faculty])];
            }
          }
        }
      }, error => console.error('שגיאה בטעינת כנס:', error));
    }
  }

  loadFaculties(): void {
    this.apiService.getFaculties().subscribe({
      next: (data) => {
        this.facultyData = data;
        this.faculties = Object.keys(data);
      },
      error: (err) => console.error('שגיאה בטעינת פקולטות:', err)
    });
  }

  onFacultyChange(): void {
    const selected = this.conferenceForm.get('facultyName')?.value;
    this.schools = selected ? [...new Set(this.facultyData[selected])] : [];
    this.conferenceForm.patchValue({ schoolName: '' });
  }

  initForm() {
    this.conferenceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      dateOnly: ['', [Validators.required, this.futureDateValidator]],
      timeOnly: ['12:00', Validators.required],
      location: ['', Validators.required],
      maxParticipants: [50, [Validators.required, Validators.min(1)]],
      facultyName: ['', Validators.required],
      schoolName: ['', Validators.required]
    });
  }

  futureDateValidator(control: any) {
    if (!control.value) { return null; }
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today ? null : { pastDate: true };
  }

  onSubmit() {
    if (this.conferenceForm.invalid) {
      this.conferenceForm.markAllAsTouched();
      return;
    }
    const val = this.conferenceForm.value;
    const combinedDate = new Date(`${val.dateOnly}T${val.timeOnly}`);
    const conferenceDto = {
      Name: val.title,
      Description: val.description,
      Date: combinedDate.toISOString(),
      Location: val.location,
      MaxParticipants: val.maxParticipants,
      FacultyName: val.facultyName,
      SchoolName: val.schoolName,
      Sessions: [],
      OwnerId: null
    };

    if (this.isEditMode) {
      this.apiService.updateConference(this.conferenceId, conferenceDto).subscribe({
        next: () => this.router.navigate(['/admin/dashboard']),
        error: (err) => console.error('שגיאה בעדכון:', err)
      });
    } else {
      this.apiService.createConference(conferenceDto).subscribe({
        next: () => this.router.navigate(['/admin/dashboard']),
        error: (err) => console.error('שגיאה ביצירה:', err)
      });
    }
  }
}
