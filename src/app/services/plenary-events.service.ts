import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// חשוב: שמות השדות כאן הם PascalCase בכוונה - הם חייבים להתאים בדיוק
// לשמות ה-properties במודל PlenaryEvent.cs בשרת, כי הפרויקט הזה לא ממיר
// אוטומטית בין camelCase ל-PascalCase (כמו שרואים גם ב-Survey.IsExternalOnly
// בקומפוננטת conference-events).

export interface ScheduleItem {
  Time: string;
  Label: string;
}

export interface PlenaryEvent {
  Id?: string;
  Title: string;
  Kicker?: string;
  Description: string;
  Date: string;
  Schedule: ScheduleItem[];
  Venue: string;
  Address?: string;
  Organizers?: string[];
  RegistrationNote?: string;
  CtaLabel: string;
  CtaUrl: string;
  ImageData?: string;
  ImageAlt?: string;
  SortOrder?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlenaryEventsService {

  // ⭐ התאם לכתובת ה-API האמיתית של הפרויקט (כמו ששאר השירותים משתמשים בה)
  private readonly baseUrl = 'https://conference-backend-8339.onrender.com/api/plenaryevents';

  constructor(private http: HttpClient) { }

  getAll(): Observable<PlenaryEvent[]> {
    return this.http.get<PlenaryEvent[]>(this.baseUrl);
  }

  getById(id: string): Observable<PlenaryEvent> {
    return this.http.get<PlenaryEvent>(`${this.baseUrl}/${id}`);
  }

  create(event: PlenaryEvent): Observable<PlenaryEvent> {
    return this.http.post<PlenaryEvent>(this.baseUrl, event);
  }

  update(id: string, event: PlenaryEvent): Observable<PlenaryEvent> {
    return this.http.put<PlenaryEvent>(`${this.baseUrl}/${id}`, event);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}