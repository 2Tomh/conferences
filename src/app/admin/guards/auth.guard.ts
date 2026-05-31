import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      return true; // יש טוקן, הכל טוב
    }

    // כאן הטעות בדרך כלל! וודא שאתה מפנה לנתיב הזה:
    this.router.navigate(['/admin/login']);
    return false;
  }
}
