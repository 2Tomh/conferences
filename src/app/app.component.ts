import { Component, OnInit } from '@angular/core';
import { LanguageTransformService } from './services/language-transform.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mind-il';

  constructor(private langService: LanguageTransformService) {}

  ngOnInit() {
    // אתחול השפה עם טעינת האפליקציה
    this.langService.init();
  }
}