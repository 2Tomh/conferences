import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

interface Partner {
  id?: string;
  name: string;
  logo: string;
  url: string;
  order: number;
}

@Component({
  selector: 'app-partners-management',
  templateUrl: './partners-management.component.html',
  styleUrls: ['./partners-management.component.css']
})
export class PartnersManagementComponent implements OnInit {
  partners: any[] = [];
  isLoading = false;
  error = '';

  // ⭐ טופס הוספה/עריכה - אותו טופס משמש לשני המצבים, editingId מבחין ביניהם
  showForm = false;
  editingId: string | null = null;
  formName = '';
  formUrl = '';
  formOrder = 0;
  formLogoDataUri = ''; // ⭐ ה-Base64 שנבנה מתוך הקובץ שנבחר
  formLogoPreview = ''; // תצוגה מקדימה - זהה ל-DataUri בפועל, אבל שם נפרד לבהירות
  formError = '';
  isSaving = false;

  deletingId: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.isLoading = true;
    this.error = '';
    this.apiService.getPartners().subscribe({
      next: (data: any[]) => {
        this.partners = (data || []).sort((a, b) => (a.order ?? a.Order ?? 0) - (b.order ?? b.Order ?? 0));
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading partners';
        console.error('Error calling the API:', err);
        this.isLoading = false;
      }
    });
  }

  // ══ טופס הוספה ══
  openAddForm(): void {
    this.editingId = null;
    this.formName = '';
    this.formUrl = '';
    this.formOrder = this.partners.length + 1;
    this.formLogoDataUri = '';
    this.formLogoPreview = '';
    this.formError = '';
    this.showForm = true;
  }

  // ══ טופס עריכה - טוען את הערכים הקיימים ══
  openEditForm(partner: any): void {
    this.editingId = partner.id || partner._id || partner.Id;
    this.formName = partner.name || partner.Name || '';
    this.formUrl = partner.url || partner.Url || '';
    this.formOrder = partner.order ?? partner.Order ?? 0;
    this.formLogoDataUri = ''; // ריק = "לא נבחר קובץ חדש", העדכון ישמור על הלוגו הקיים
    this.formLogoPreview = partner.logo || partner.Logo || '';
    this.formError = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  // ⭐ חדש: קורא את הקובץ שנבחר וממיר אותו ל-Base64 Data URI בצד הלקוח
  onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.formError = 'Please select an image file';
      return;
    }

    // הגבלת גודל סבירה - לוגו לא אמור לחרוג מ-2MB, כדי לא להעמיס על המסמך ב-Mongo
    if (file.size > 2 * 1024 * 1024) {
      this.formError = 'Image is too large — please use a file under 2MB';
      return;
    }

    this.formError = '';
    const reader = new FileReader();
    reader.onload = () => {
      this.formLogoDataUri = reader.result as string;
      this.formLogoPreview = this.formLogoDataUri;
    };
    reader.readAsDataURL(file);
  }

  savePartner(): void {
    if (!this.formName.trim()) {
      this.formError = 'Partner name is required';
      return;
    }
    // ביצירה חדשה חובה לוגו; בעריכה מותר להשאיר ריק (משמעו: לא לשנות את הקיים)
    if (!this.editingId && !this.formLogoDataUri) {
      this.formError = 'Please select a logo image';
      return;
    }

    this.isSaving = true;
    this.formError = '';

    const payload = {
      name: this.formName.trim(),
      logo: this.formLogoDataUri, // ריק בעריכה = לא לשנות (מטופל בבקאנד)
      url: this.formUrl.trim(),
      order: this.formOrder
    };

    const request = this.editingId
      ? this.apiService.updatePartner(this.editingId, payload)
      : this.apiService.createPartner(payload);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.showForm = false;
        this.loadPartners();
      },
      error: (err: any) => {
        this.isSaving = false;
        this.formError = 'Failed to save partner';
        console.error('Error saving partner:', err);
      }
    });
  }

  confirmDelete(partner: any): void {
    this.deletingId = partner.id || partner._id || partner.Id;
  }

  cancelDelete(): void {
    this.deletingId = null;
  }

  deletePartner(): void {
    if (!this.deletingId) return;
    const id = this.deletingId;
    this.apiService.deletePartner(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.loadPartners();
      },
      error: (err: any) => {
        console.error('Error deleting partner:', err);
        this.deletingId = null;
      }
    });
  }

  getPartnerId(partner: any): string {
    return partner.id || partner._id || partner.Id || '';
  }
}