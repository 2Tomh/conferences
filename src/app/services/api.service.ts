import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://conference-backend-8339.onrender.com/api';
  // private apiUrl = 'https://localhost:7222/api';

  constructor(private http: HttpClient) { }

  // ==========================================
  // CONFERENCES ENDPOINTS (הכנסים הישנים)
  // ==========================================
  getAllConferences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Conferences`);
  }

  getConferences(): Observable<any[]> {
    return this.getAllConferences();
  }

  getMyConferences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Conferences/my-conferences`);
  }

  createConference(conference: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Surveys`, conference); // שיניתי מ-Conferences ל-Surveys
  }

  // getConferenceById(id: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/Conferences/${id}`);
  // }

  updateConference(id: string, conference: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Conferences/${id}`, conference);
  }

  deleteConference(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Conferences/${id}`);
  }

  registerToSession(data: any) {
    return this.http.post(`${this.apiUrl}/Conferences/register`, data);
  }

  enrollToConference(conferenceId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Enrollments/${conferenceId}`, {});
  }

  // ==========================================
  // SURVEYS ENDPOINTS (הסקרים האמיתיים מהמונגו)
  // ==========================================

  // 1. משיכת כל הסקרים עבור הדאשבורד
  getMySurveys(): Observable<any[]> {
    return this.getSurveys();
  }

  getSurveys(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Surveys`);
  }

  // 2. משיכת סקר בודד לפי ה-_id של מונגו לצורך עריכה
  getSurveyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Surveys/${id}`);
  }

  // 3. עדכון סקר קיים
  updateSurvey(id: string, surveyData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Surveys/${id}`, surveyData);
  }

  // 4. מחיקת סקר מהמונגו
  deleteSurvey(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Surveys/${id}`);
  }

  // ==========================================
  // OTHER LOOKUPS & UTILS
  // ==========================================
  getDepartmentReport(conferenceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Registration/department-report/${conferenceId}`);
  }

  getDepartmentsLookup(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/departments/lookup`);
  }

  getHomeSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Settings/home`);
  }

  getFaculties(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Admin/faculties`);
  }

  getAllAttendees(filters?: { conferenceId?: string; paymentStatus?: string; search?: string }) {
    let params = new HttpParams();
    if (filters?.conferenceId) params = params.set('conferenceId', filters.conferenceId);
    if (filters?.paymentStatus) params = params.set('paymentStatus', filters.paymentStatus);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<any[]>(`${this.apiUrl}/registration/all`, { params });
  }

  registerAttendee(attendee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration/register`, attendee);
  }

  getPartners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/partners`);
  }
  // אם ה-ID הוא בעצם שם הכנס:
  getConferenceById(id: string): Observable<any> {
    // וודא שאתה מקודד את השם אם יש בו רווחים
    return this.http.get(`${this.apiUrl}/Conferences/${encodeURIComponent(id)}`);
  }
}