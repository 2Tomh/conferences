import { Component } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mind-il';
  currentLang = 'en';
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'he']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    // הגדר כיוון בטעינה ראשונית ← חדש
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
      document.documentElement.dir = event.lang === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = event.lang;
    });
  }

  switchLang(lang: 'en' | 'he') {
    this.currentLang = lang;
    this.translate.use(lang);
  }
}