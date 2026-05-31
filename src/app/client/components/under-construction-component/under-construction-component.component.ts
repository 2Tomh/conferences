import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction-component.component.html',
  styleUrls: ['./under-construction-component.component.css']
})
export class UnderConstructionComponent {
  constructor(private router: Router,public translate: TranslateService) {}

  goHome(): void {
    this.router.navigate(['/']);
  }
}