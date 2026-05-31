// import { Component, OnInit } from '@angular/core';
// import { NavigationEnd, Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { Observable } from 'rxjs';
// import { every, filter } from 'rxjs/operators';

// @Component({
//   selector: 'app-admin-nav-bar',
//   templateUrl: './admin-nav-bar.component.html',
//   styleUrls: ['./admin-nav-bar.component.css']
// })
// export class AdminNavBarComponent implements OnInit {
//   isLoggedIn$!: Observable<boolean>;
//   showNavBar: boolean = true;

//   constructor(private authService: AuthService, private router: Router) {
//     this.router.events.pipe(
//       filter(event => event instanceof NavigationEnd)
//     ).subscribe((event: any)=>{
//       this.showNavBar = !event.urlAfterRedirects.includes('/admin/login')
//     })
//    }


//   ngOnInit(): void {
//     this.isLoggedIn$ = this.authService.isLoggedIn();
//   }
//   onLogout() {
//     this.authService.logOut();
//     this.router.navigate(['/admin/login']);
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

  // constructor(
  //   private authService: AuthService,
  //   private router: Router,
  //   private translate: TranslateService
  // ) {
  //   this.router.events.pipe(
  //     filter(event => event instanceof NavigationEnd)
  //   ).subscribe((event: any) => {
  //     this.isLoginPage = event.urlAfterRedirects.includes('/admin/login');
  //   });
  // }
  constructor(
    private authService: AuthService,
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

  onLogout():void {
    this.authService.logOut();
    this.router.navigate(['/admin/login']);
  }
  onToggleLanguage(): void {
    const nextLang = this.translate.currentLang === 'en' ? 'he' : 'en';
    this.translate.use(nextLang);
  }

}
