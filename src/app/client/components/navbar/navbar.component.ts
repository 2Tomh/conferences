import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}

  onToggleLanguage(): void {
    const nextLang = this.translate.currentLang === 'en' ? 'he' : 'en';
    this.translate.use(nextLang);
  }
}