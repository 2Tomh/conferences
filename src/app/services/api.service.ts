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
  // CONFERENCES ENDPOINTS
  // ==========================================
  getAllConferences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/surveys`);
  }

  getConferences(): Observable<any[]> {
    return this.getAllConferences();
  }

  getMyConferences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Conferences/my-conferences`);
  }

  createConference(data: any) {
    return this.http.post(`${this.apiUrl}/Surveys`, data);
  }

  updateConference(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/Surveys/${id}`, data);
  }

  deleteConference(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Surveys/${id}`);
  }

  registerToSession(data: any) {
    return this.http.post(`${this.apiUrl}/Conferences/register`, data);
  }

  enrollToConference(conferenceId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Enrollments/${conferenceId}`, {});
  }

  // ==========================================
  // SURVEYS ENDPOINTS
  // ==========================================
  getMySurveys(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Surveys`);
  }

  getSurveys(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Surveys`);
  }

  getSurveyById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Surveys/${id}`);
  }

  updateSurvey(id: string, surveyData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Surveys/${id}`, surveyData);
  }

  deleteSurvey(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Surveys/${id}`);
  }

  // ==========================================
  // ATTACHMENT (PDF) ENDPOINTS
  // ==========================================
  uploadAttachment(id: string, file: File, description: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description || '');
    return this.http.post(`${this.apiUrl}/Surveys/${id}/attachment`, formData);
  }

  deleteAttachment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Surveys/${id}/attachment`);
  }

  getAttachmentUrl(id: string): string {
    return `${this.apiUrl}/Surveys/${encodeURIComponent(id)}/attachment`;
  }

  // ==========================================
  // OTHER
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

  // ⭐ חדש: מוסיף/מעדכן תקציר עבור נרשם קיים, ע"י מנהל (למקרה ששכח לצרף
  // תקציר בזמן ההרשמה עצמה)
  addAbstractForAttendee(attendeeId: string, data: { title: string; body: string; notes?: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/registration/abstract/${attendeeId}`, data);
  }

  // ⭐ חדש: מוחק תקציר קיים (משאיר את הנרשם עצמו)
  deleteAbstractForAttendee(attendeeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/registration/abstract/${attendeeId}`);
  }

  getPartners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/partners`);
  }

  // ⭐ חדש: ניהול שותפים (Create/Update/Delete) - GET כבר קיים למעלה
  createPartner(data: { name: string; logo: string; url: string; order: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/partners`, data);
  }

  updatePartner(id: string, data: { name: string; logo: string; url: string; order: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/partners/${id}`, data);
  }

  deletePartner(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/partners/${id}`);
  }

  // ⭐ חדש: מאמת סיסמת-עמוד (כמו Transactions) מול hash שמור ב-Mongo,
  // בלי שהסיסמה עצמה תישמר בקוד ה-Frontend
  verifyPageAccess(pageKey: string, password: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/page-access/verify`, { pageKey, password });
  }

  getConferenceById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Surveys/${encodeURIComponent(id)}`);
  }

  // ==========================================
  // PAYMENT
  // ==========================================
  // ⭐ עודכן: נוסף פרמטר force אופציונלי - כשהוא true, השרת שולח מחדש
  // גם אם EmailSent כבר true (למקרה של כפתור "Resend" ידני ע"י אדמין).
  // בשימוש הרגיל (בלי force) ההתנהגות זהה למה שהיה קודם.
  sendPaymentConfirmation(orderId: string, force: boolean = false): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/send-confirmation`, { orderId, force });
  }

  // ⭐ שולף את כל רשומות ה-Transactions, עם תמיכה בסינון לפי סטטוס/חיפוש
  getAllTransactions(filters?: { status?: string; search?: string }): Observable<any[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<any[]>(`${this.apiUrl}/payment/transactions`, { params });
  }

  // ⭐ חדש: מוחק עסקה לפי OrderId
  deleteTransaction(orderId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/payment/transactions/${encodeURIComponent(orderId)}`);
  }

  // ==========================================
  // Statistics
  // ==========================================
  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/registration/statistics`);
  }
}