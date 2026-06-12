import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://conference-backend-8339.onrender.com/api';
  // private apiUrl = 'https://localhost:7222/api';
  private loggedin = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // auth.service.ts
  login(credentials: any): Observable<any> {
    // שינינו מ-account/login ל-Auth/login כדי להתאים לקונטרולר ב-C#
    return this.http.post(`${this.apiUrl}/Auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.loggedin.next(true); // זה מה שיגרום לנאבבר להציג את הלינקים מיד
        }
      })
    );
  }

  logOut() {
    localStorage.removeItem('token');
    this.loggedin.next(false);
  }

  // מחזיר Observable כדי שקומפוננטות יוכלו לעשות Subscribe לשינויי סטטוס
  isLoggedIn() {
    return this.loggedin.asObservable();
  }

  // פונקציית עזר ל-Interceptor
  getToken() {
    return localStorage.getItem('token');
  }

createUser(userData: any): Observable < any > {
  return this.http.post(`${this.apiUrl}/Admin/create-user`, userData);
}

getAllUsers(): Observable < any[] > {
  return this.http.get<any[]>(`${this.apiUrl}/Admin/all-users`);
}

updateUser(userId: string | number, userData: any): Observable < any > {
  return this.http.put(`${this.apiUrl}/Admin/update-user/${userId}`, userData);
}

deleteUser(id: string | number): Observable < any > {
  return this.http.delete(`${this.apiUrl}/Admin/delete-user/${id}`);
}
}
