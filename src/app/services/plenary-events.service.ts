import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// חשוב: שמות השדות כאן הם PascalCase בכוונה - הם חייבים להתאים בדיוק
// לשמות ה-properties במודל PlenaryEvent.cs בשרת.

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
  // ברשימה (getAll) זה קישור לתמונה; בשמירה זה Base64 של תמונה חדשה
  ImageData?: string;
  ImageAlt?: string;
  SortOrder?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlenaryEventsService {

  private readonly backendOrigin = 'https://conference-backend-8339.onrender.com';
  private readonly baseUrl = `${this.backendOrigin}/api/plenaryevents`;

  constructor(private http: HttpClient) { }

  // ⭐ שינוי: השרת מחזיר קישור יחסי לתמונה (/api/plenaryevents/{id}/image?v=...),
  // וכאן משלימים אותו לכתובת מלאה של השרת כדי שה-<img> יטען אותה
  getAll(): Observable<PlenaryEvent[]> {
    return this.http.get<PlenaryEvent[]>(this.baseUrl).pipe(
      map(events => (events || []).map(e => ({
        ...e,
        ImageData: e.ImageData && e.ImageData.startsWith('/')
          ? this.backendOrigin + e.ImageData
          : e.ImageData
      })))
    );
  }

  getById(id: string): Observable<PlenaryEvent> {
    return this.http.get<PlenaryEvent>(`${this.baseUrl}/${id}`);
  }

  create(event: PlenaryEvent): Observable<any> {
    return this.http.post<any>(this.baseUrl, event);
  }

  update(id: string, event: PlenaryEvent): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, event);
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