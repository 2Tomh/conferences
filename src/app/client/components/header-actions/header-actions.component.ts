import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LanguageTransformService } from '../../../services/language-transform.service';

@Component({
  selector: 'app-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.css']
})
export class HeaderActionsComponent implements OnInit {
@Output() toggleDarkMode = new EventEmitter<void>();

  constructor(public langService: LanguageTransformService) { }

  ngOnInit(): void { }

  onToggleLanguage(): void {
    this.langService.toggleLanguage();
  }

  onToggleDarkMode(): void {
    this.toggleDarkMode.emit();
  }
}
