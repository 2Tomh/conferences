import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageTransformService {
  private renderer: Renderer2;
  private isEnglishSubject = new BehaviorSubject<boolean>(false);
  isEnglish$ = this.isEnglishSubject.asObservable();

constructor(
  rendererFactory: RendererFactory2,
  private translate: TranslateService
) {
  this.renderer = rendererFactory.createRenderer(null, null);
  this.translate.addLangs(['he', 'en']);
  this.translate.setDefaultLang('he');
  this.translate.use('he');
  
  this.renderer.addClass(document.body, 'rtl');
}

  toggleLanguage() {
    const nextState = !this.isEnglishSubject.value;
    this.isEnglishSubject.next(nextState);
    this.updateGlobalStyles(nextState);

    const lang = nextState ? 'en' : 'he';
    this.translate.use(lang);
  }

  private updateGlobalStyles(isEnglish: boolean) {
    const dir = isEnglish ? 'ltr' : 'rtl';
    const lang = isEnglish ? 'en' : 'he';

    this.renderer.setAttribute(document.documentElement, 'dir', dir);
    this.renderer.setAttribute(document.documentElement, 'lang', lang);
    this.renderer.setAttribute(document.body, 'dir', dir);
    document.body.style.direction = dir;

    if (isEnglish) {
      this.renderer.removeClass(document.body, 'rtl');
      this.renderer.addClass(document.body, 'ltr');
    } else {
      this.renderer.removeClass(document.body, 'ltr');
      this.renderer.addClass(document.body, 'rtl');
    }
  }
}