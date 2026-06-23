import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // בדיקה: האם זו שגיאת 401?
        if (error.status === 401) {
          
          // בדיקה: האם המשתמש נמצא כרגע בנתיב של ה-Admin?
          // אם כן - נבצע Logout ונפנה ללוגין.
          // אם לא - נשאיר אותו בדף הלקוח (הוא פשוט לא יראה נתונים מוגנים).
          if (this.router.url.includes('/admin')) {
            console.warn('Unauthorized access to admin area, logging out...');
            this.authService.logOut();
            this.router.navigate(['/admin/login']);
          } else {
            console.warn('Unauthorized access in public area, staying on page.');
          }
        }

        return throwError(() => error);
      })
    );
  }
}