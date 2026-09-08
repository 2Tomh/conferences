import { Component, OnInit } from '@angular/core';
import { PlenaryEventsService, PlenaryEvent, ScheduleItem } from '../../../services/plenary-events.service';

@Component({
  selector: 'app-admin-plenary-events',
  templateUrl: './admin-plenary-events.component.html',
  styleUrls: ['./admin-plenary-events.component.css']
})
export class AdminPlenaryEventsComponent implements OnInit {

  events: PlenaryEvent[] = [];
  loading = false;
  saving = false;
  errorMessage = '';

  showForm = false;
  editingId: string | null = null;

  form: PlenaryEvent = this.emptyForm();
  imagePreview: string | null = null;

  constructor(private plenaryEventsService: PlenaryEventsService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  private emptyForm(): PlenaryEvent {
    return {
      Title: '',
      Kicker: '',
      Description: '',
      Date: '',
      Schedule: [{ Time: '', Label: '' }],
      Venue: '',
      Address: '',
      Organizers: [],
      RegistrationNote: '',
      CtaLabel: 'Register for the Event',
      CtaUrl: '',
      ImageData: '',
      ImageAlt: '',
      SortOrder: 0
    };
  }

  loadEvents(): void {
    this.loading = true;
    this.plenaryEventsService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load events.';
        this.loading = false;
      }
    });
  }

  openAddForm(): void {
    this.form = this.emptyForm();
    this.imagePreview = null;
    this.editingId = null;
    this.showForm = true;
    this.errorMessage = '';
  }

  openEditForm(event: PlenaryEvent): void {
    this.form = JSON.parse(JSON.stringify(event));
    if (!this.form.Schedule || this.form.Schedule.length === 0) {
      this.form.Schedule = [{ Time: '', Label: '' }];
    }
    if (!this.form.Organizers) {
      this.form.Organizers = [];
    }
    this.imagePreview = event.ImageData || null;
    this.editingId = event.Id || null;
    this.showForm = true;
    this.errorMessage = '';
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  addScheduleRow(): void {
    this.form.Schedule.push({ Time: '', Label: '' });
  }

  removeScheduleRow(index: number): void {
    this.form.Schedule.splice(index, 1);
    if (this.form.Schedule.length === 0) {
      this.form.Schedule.push({ Time: '', Label: '' });
    }
  }

  addOrganizer(): void {
    if (!this.form.Organizers) this.form.Organizers = [];
    this.form.Organizers.push('');
  }

  removeOrganizer(index: number): void {
    this.form.Organizers?.splice(index, 1);
  }

  async onImageSelected(fileInput: HTMLInputElement): Promise<void> {
    const file = fileInput.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select an image file.';
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      this.errorMessage = 'Image is too large. Please use a file under 4MB.';
      return;
    }

    try {
      const base64 = await this.plenaryEventsService.fileToBase64(file);
      this.form.ImageData = base64;
      this.imagePreview = base64;
      this.errorMessage = '';
    } catch {
      this.errorMessage = 'Failed to read the image file.';
    }
  }

  removeImage(): void {
    this.form.ImageData = '';
    this.imagePreview = null;
  }

  save(): void {
    if (!this.form.Title.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }
    if (!this.form.Description.trim()) {
      this.errorMessage = 'Description is required.';
      return;
    }

    const payload: PlenaryEvent = {
      ...this.form,
      Schedule: this.form.Schedule.filter(s => s.Time.trim() || s.Label.trim()),
      Organizers: (this.form.Organizers || []).filter(o => o.trim())
    };

    this.saving = true;
    this.errorMessage = '';

    const request$ = this.editingId
      ? this.plenaryEventsService.update(this.editingId, payload)
      : this.plenaryEventsService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.loadEvents();
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Failed to save the event. Please try again.';
      }
    });
  }

  deleteEvent(event: PlenaryEvent): void {
    if (!event.Id) return;
    if (!confirm(`Delete "${event.Title}"? This cannot be undone.`)) return;

    this.plenaryEventsService.delete(event.Id).subscribe({
      next: () => this.loadEvents(),
      error: () => this.errorMessage = 'Failed to delete the event.'
    });
  }
}