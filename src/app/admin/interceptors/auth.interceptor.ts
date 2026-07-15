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
        // Check: is this a 401 error?
        if (error.status === 401) {

          // Check: is the user currently on an Admin route?
          // If so - log out and redirect to login.
          // If not - leave them on the public page (they just won't see protected data).
          if (this.router.url.includes('/admin')) {
            console.warn('Unauthorized access to admin area, logging out...');
            this.authService.logOut();
            this.router.navigate(['/admin/login']);
          } else {
            console.warn('Unauthorized access in public area, staying on page.');
          }
        }

        // FIXED: pass the error value directly instead of a factory function.
        // This project's RxJS version expects throwError(value), not throwError(() => value).
        // Using the factory-function syntax on this version caused the function itself
        // to be thrown instead of the actual HttpErrorResponse, so every .subscribe({ error })
        // handler in the app was receiving `undefined` for err.status / err.error / etc.
        return throwError(error);
      })
    );
  }
}