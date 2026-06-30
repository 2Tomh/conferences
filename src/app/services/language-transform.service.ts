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

  // ── הוסף את זה ──
  get currentLang(): string {
    return this.translate.currentLang || 'en';
  }

  init() {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.useLanguage(savedLang);
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