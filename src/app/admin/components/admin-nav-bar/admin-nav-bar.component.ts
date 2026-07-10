// import { Component, OnInit } from '@angular/core';
// import { Router, NavigationEnd } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { Observable } from 'rxjs';
// import { filter } from 'rxjs/operators';
// import { TranslateService } from '@ngx-translate/core';
// @Component({
//   selector: 'app-admin-nav-bar',
//   templateUrl: './admin-nav-bar.component.html',
//   styleUrls: ['./admin-nav-bar.component.css']
// })
// export class AdminNavBarComponent implements OnInit {
//   isLoggedIn$!: Observable<boolean>;
//   isLoginPage = false;
//   constructor(
//     public authService: AuthService, 
//     private router: Router,
//     private translate: TranslateService
//   ) {
//     this.router.events.pipe(
//       filter(event => event instanceof NavigationEnd)
//     ).subscribe((event: any) => {
//       this.isLoginPage = event.urlAfterRedirects.includes('/admin/login');
//     });
//   }
//   ngOnInit(): void {
//     this.isLoggedIn$ = this.authService.isLoggedIn();
//   }
//   onLogout(): void {
//     this.authService.logOut();
//     this.router.navigate(['/admin/login']);
//   }
//   onToggleLanguage(): void {
//     const nextLang = this.translate.currentLang === 'en' ? 'he' : 'en';
//     this.translate.use(nextLang);
//   }

//   get currentDir(): string {
//     const lang = this.translate.currentLang || this.translate.defaultLang || 'he';
//     return lang === 'he' ? 'rtl' : 'ltr';
//   }
// }
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-admin-nav-bar',
  templateUrl: './admin-nav-bar.component.html',
  styleUrls: ['./admin-nav-bar.component.css']
})
export class AdminNavBarComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  isLoginPage = false;
  constructor(
    public authService: AuthService, // שים לב לשינוי ל-public
    private router: Router,
    private translate: TranslateService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.urlAfterRedirects.includes('/admin/login');
    });
  }
  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }
  onLogout(): void {
    this.authService.logOut();
    this.router.navigate(['/admin/login']);
  }
  onToggleLanguage(): void {
    const nextLang = this.translate.currentLang === 'en' ? 'he' : 'en';
    this.translate.use(nextLang);
  }
  get currentDir(): string {
    // ברירת המחדל של האתר היא אנגלית/LTR (בהתאם ל-LanguageTransformService),
    // לכן ה-fallback כאן הוא 'en' ולא 'he' כמו קודם
    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    return lang === 'he' ? 'ltr' : 'ltr';
  }
}