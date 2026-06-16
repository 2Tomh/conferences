// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, BehaviorSubject } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'https://conference-backend-8339.onrender.com/api';
//   // private apiUrl = 'https://localhost:7222/api';
//   private loggedin = new BehaviorSubject<boolean>(this.hasToken());

//   constructor(private http: HttpClient) { }

//   private hasToken(): boolean {
//     return !!localStorage.getItem('token');
//   }

//   // auth.service.ts
//   login(credentials: any): Observable<any> {
//     // שינינו מ-account/login ל-Auth/login כדי להתאים לקונטרולר ב-C#
//     return this.http.post(`${this.apiUrl}/Auth/login`, credentials).pipe(
//       tap((response: any) => {
//         if (response && response.token) {
//           localStorage.setItem('token', response.token);
//           this.loggedin.next(true); // זה מה שיגרום לנאבבר להציג את הלינקים מיד
//         }
//       })
//     );
//   }

//   logOut() {
//     localStorage.removeItem('token');
//     this.loggedin.next(false);
//   }

//   // מחזיר Observable כדי שקומפוננטות יוכלו לעשות Subscribe לשינויי סטטוס
//   isLoggedIn() {
//     return this.loggedin.asObservable();
//   }

//   // פונקציית עזר ל-Interceptor
//   getToken() {
//     return localStorage.getItem('token');
//   }

// createUser(userData: any): Observable < any > {
//   return this.http.post(`${this.apiUrl}/Admin/create-user`, userData);
// }

// getAllUsers(): Observable < any[] > {
//   return this.http.get<any[]>(`${this.apiUrl}/Admin/all-users`);
// }

// updateUser(userId: string | number, userData: any): Observable < any > {
//   return this.http.put(`${this.apiUrl}/Admin/update-user/${userId}`, userData);
// }

// deleteUser(id: string | number): Observable < any > {
//   return this.http.delete(`${this.apiUrl}/Admin/delete-user/${id}`);
// }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://conference-backend-8339.onrender.com/api';
  // private apiUrl = 'https://localhost:7222/api';
  private loggedin = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          this.loggedin.next(true);
        }
      })
    );
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.loggedin.next(false);
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedin.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // --- פונקציות עזר להרשאות (השימוש ב-HTML יהיה: *ngIf="authService.isAdmin()") ---

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  isFacultyManager(): boolean {
    return this.getRole() === 'FacultyManager';
  }

  isAnyManager(): boolean {
    return this.isAdmin() || this.isFacultyManager();
  }
  // בתוך auth.service.ts
  getCurrentUser(): any {
    const token = localStorage.getItem('token'); // או השם שבו אתה שומר את הטוקן
    if (!token) return null;

    try {
      // פענוח ידני של ה-Payload של הטוקן
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        scope: payload['ScopeId']
      };
    } catch (e) {
      return null;
    }
  }
  // --- מתודות ה-API ---

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Admin/create-user`, userData);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Admin/all-users`);
  }

  updateUser(userId: string | number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Admin/update-user/${userId}`, userData);
  }

  deleteUser(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Admin/delete-user/${id}`);
  }
}