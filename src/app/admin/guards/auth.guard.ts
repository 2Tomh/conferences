// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.authService.getToken()) {
//       return true; // יש טוקן, הכל טוב
//     }

//     // כאן הטעות בדרך כלל! וודא שאתה מפנה לנתיב הזה:
//     this.router.navigate(['/admin/login']);
//     return false;
//   }
// }

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken();
    
    // 1. בדיקה האם מחובר
    if (!token) {
      this.router.navigate(['/admin/login']);
      return false;
    }

    // 2. בדיקת הרשאות (Roles)
    const expectedRoles = route.data['expectedRoles'] as Array<string>;
    const userRole = this.authService.getRole(); // וודא שהפונקציה הזו קיימת ב-AuthService שלך

    if (expectedRoles && expectedRoles.length > 0) {
      if (userRole && expectedRoles.includes(userRole)) {
        return true; // יש למשתמש הרשאה מתאימה
      } else {
        // מחובר אבל אין הרשאה - לזרוק אותו מהדף (למשל לדאשבורד הראשי)
        this.router.navigate(['/admin/dashboard']); 
        return false;
      }
    }

    return true;
  }
}