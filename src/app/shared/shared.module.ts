import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderActionsComponent } from '../client/components/header-actions/header-actions.component';

@NgModule({
  declarations: [HeaderActionsComponent],
  imports: [CommonModule, TranslateModule.forChild()],
  exports: [HeaderActionsComponent]
})
export class SharedModule { }
