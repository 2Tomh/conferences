import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  constructor(private translate: TranslateService) {}

init(): void {
  // נסה לקבל את השפה השמורה מהדפדפן, אם אין - ברירת מחדל 'he'
  const savedLang = localStorage.getItem('lang') || 'en';
  this.translate.use(savedLang);

  this.translate.onLangChange.subscribe(({ lang }) => {
    localStorage.setItem('lang', lang); // שמור בכל שינוי
    document.body.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;
  });
}
}