import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction-component.component.html',
  styleUrls: ['./under-construction-component.component.css']
})
export class UnderConstructionComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }
}