import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // 1. בדיקה: האם אנחנו באזור ניהול?
    // אם הנתיב לא מתחיל ב-'/admin', אנחנו בדפי הלקוח - נאפשר גישה חופשית.
    console.log('Guard checking route:', state.url); // הוסף את זה
    if (!state.url.startsWith('/admin')) {
      console.log('Public route - allowing access');
      return true;
    }

    // 2. אם הגענו לכאן, אנחנו באזור הניהול. נבדוק אם יש טוקן.
    const token = this.authService.getToken();
    if (!token) {
      console.log('Admin route without token - redirecting to login');
      this.router.navigate(['/admin/login']);
      return false;
    }

    // 3. בדיקת הרשאות (Roles/Departments)
    const expectedRoles = route.data['expectedRoles'] as Array<string>;
    const userRole = this.authService.getRole();

    if (expectedRoles && expectedRoles.length > 0) {
      if (userRole && expectedRoles.includes(userRole)) {
        return true; // יש למשתמש הרשאה מתאימה
      } else {
        // מחובר אבל אין הרשאה - חזרה לדאשבורד
        this.router.navigate(['/admin/dashboard']);
        return false;
      }
    }

    return true; // מחובר ויש טוקן - גישה מאושרת
  }
}