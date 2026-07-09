// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { HttpParams } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//   private apiUrl = 'https://conference-backend-8339.onrender.com/api';
//   // private apiUrl = 'https://localhost:7222/api';

//   constructor(private http: HttpClient) { }

//   // ==========================================
//   // CONFERENCES ENDPOINTS
//   // ==========================================
//   getAllConferences(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/Conferences`);
//   }

//   getConferences(): Observable<any[]> {
//     return this.getAllConferences();
//   }

//   getMyConferences(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/Conferences/my-conferences`);
//   }

//   createConference(data: any) {
//     return this.http.post(`${this.apiUrl}/Surveys`, data);
//   }

//   updateConference(id: string, data: any) {
//     return this.http.put(`${this.apiUrl}/Surveys/${id}`, data);
//   }

//   deleteConference(id: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/Conferences/${id}`);
//   }

//   registerToSession(data: any) {
//     return this.http.post(`${this.apiUrl}/Conferences/register`, data);
//   }

//   enrollToConference(conferenceId: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/Enrollments/${conferenceId}`, {});
//   }

//   // ==========================================
//   // SURVEYS ENDPOINTS
//   // ==========================================
//   getMySurveys(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/Surveys`);
//   }

//   getSurveys(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/Surveys`);
//   }

//   getSurveyById(id: string): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/Surveys/${id}`);
//   }

//   updateSurvey(id: string, surveyData: any): Observable<any> {
//     return this.http.put<any>(`${this.apiUrl}/Surveys/${id}`, surveyData);
//   }

//   deleteSurvey(id: string): Observable<any> {
//     return this.http.delete<any>(`${this.apiUrl}/Surveys/${id}`);
//   }

//   // ==========================================
//   // OTHER
//   // ==========================================
//   getDepartmentReport(conferenceId: string): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/Registration/department-report/${conferenceId}`);
//   }

//   getDepartmentsLookup(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/departments/lookup`);
//   }

//   getHomeSettings(): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/Settings/home`);
//   }

//   getFaculties(): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/Admin/faculties`);
//   }

//   getAllAttendees(filters?: { conferenceId?: string; paymentStatus?: string; search?: string }) {
//     let params = new HttpParams();
//     if (filters?.conferenceId)  params = params.set('conferenceId',  filters.conferenceId);
//     if (filters?.paymentStatus) params = params.set('paymentStatus', filters.paymentStatus);
//     if (filters?.search)        params = params.set('search',        filters.search);
//     return this.http.get<any[]>(`${this.apiUrl}/registration/all`, { params });
//   }

//   registerAttendee(attendee: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/registration/register`, attendee);
//   }

//   getPartners(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/partners`);
//   }

//   getConferenceById(id: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}/Conferences/${encodeURIComponent(id)}`);
//   }

//   // ==========================================
//   // PAYMENT
//   // ==========================================
//   sendPaymentConfirmation(orderId: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/payment/send-confirmation`, { orderId });
//   }
// }

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
    // תוקן: /Conferences החזיר 404 (לא קיים בשרת בכלל). /Surveys הוא ה-endpoint
    // הנכון בפועל — בדיוק כמו getSurveys() למטה, שכבר עובד בכל שאר האתר.
    return this.http.get<any[]>(`${this.apiUrl}/Surveys`);
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
    return this.http.delete(`${this.apiUrl}/Conferences/${id}`);
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
    if (filters?.conferenceId)  params = params.set('conferenceId',  filters.conferenceId);
    if (filters?.paymentStatus) params = params.set('paymentStatus', filters.paymentStatus);
    if (filters?.search)        params = params.set('search',        filters.search);
    return this.http.get<any[]>(`${this.apiUrl}/registration/all`, { params });
  }
  registerAttendee(attendee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration/register`, attendee);
  }
  getPartners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/partners`);
  }
  getConferenceById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Conferences/${encodeURIComponent(id)}`);
  }
  // ==========================================
  // PAYMENT
  // ==========================================
  sendPaymentConfirmation(orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment/send-confirmation`, { orderId });
  }
}