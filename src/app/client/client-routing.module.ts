// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

// const routes: Routes = [];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class ClientRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ConferenceListComponent } from './components/conference-list/conference-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { ConferenceEventsComponent } from './components/conference-events/conference-events.component';
import { UnderConstructionComponent } from './components/under-construction-component/under-construction-component.component';
import { ClientRootComponent } from './client-root.component';
import {AboutConferenceComponent} from '../client/components/about-conference/about-conference.component'
import { ConferenceDetailsComponent } from './components/conference-details/conference-details.component';
const routes: Routes = [
  {
    path: '',
    component: ClientRootComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'coming-soon', component: UnderConstructionComponent },
      { path: 'ConferenceEvents', component: ConferenceEventsComponent },
      { path: 'all-conferences', component: ConferenceListComponent },
      { path: 'register/:sessionId', component: RegistrationFormComponent },
      { path: 'about', component: AboutConferenceComponent },
      { path: 'conference/:id', component: ConferenceDetailsComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }