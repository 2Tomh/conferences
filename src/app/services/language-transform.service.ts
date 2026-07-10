import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class LanguageTransformService {
  private isEnglishSubject = new BehaviorSubject<boolean>(true);
  isEnglish$ = this.isEnglishSubject.asObservable();
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'he']);
    this.translate.setDefaultLang('en');
  }
  get currentLang(): string {
    return this.translate.currentLang || 'en';
  }
  init() {
    // שינוי: תמיד אנגלית בכל טעינה מחדש של האתר, בלי קשר לבחירה קודמת
    // (localStorage עדיין נשמר כדי שהחלפת שפה תוך כדי גלישה תעבוד, אבל
    // אינו נקרא יותר בעת האתחול הראשוני)
    this.useLanguage('en');
  }
  toggleLanguage() {
    const nextLang = this.translate.currentLang === 'en' ? 'he' : 'en';
    this.useLanguage(nextLang);
  }
  private useLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.isEnglishSubject.next(lang === 'en');
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;
  }
}