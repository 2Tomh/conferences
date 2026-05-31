import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // הוסף את ה-Schema
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // חייב להיות כאן!

import { ClientRoutingModule } from './client-routing.module';
import { ConferenceEventsComponent } from '../client/components/conference-events/conference-events.component';
import { ConferenceDetailsComponent } from './components/conference-details/conference-details.component';
import { ConferenceListComponent } from './components/conference-list/conference-list.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { UnderConstructionComponent } from './components/under-construction-component/under-construction-component.component';
import { ClientRootComponent } from './client-root.component';
import { AboutConferenceComponent } from './components/about-conference/about-conference.component';
import { TranslateModule } from '@ngx-translate/core';
import {SharedModule} from '../shared/shared.module';
@NgModule({
  declarations: [
    ClientRootComponent,
    ConferenceEventsComponent,
    ConferenceDetailsComponent,
    ConferenceListComponent,
    FooterComponent,
    HomeComponent,
    NavbarComponent,
    PageNotFoundComponent,
    RegistrationFormComponent,
    UnderConstructionComponent,
    AboutConferenceComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // זה יעלים את השגיאה של app-under-construction אם יש בעיית תזמון
})
export class ClientModule { }

