import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './client/components/home/home.component';
import { ConferenceListComponent } from './client/components/conference-list/conference-list.component';
import { PageNotFoundComponent } from './client/components/page-not-found/page-not-found.component';
import { RegistrationFormComponent } from './client/components/registration-form/registration-form.component';
import { ConferenceEventsComponent } from './client/components/conference-events/conference-events.component';
import { UnderConstructionComponent } from './client/components/under-construction-component/under-construction-component.component';
import { ConferenceDetailsComponent } from './client/components/conference-details/conference-details.component';
// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'coming-soon', component: UnderConstructionComponent },
//   { path: 'ConferenceEvents', component: ConferenceEventsComponent },
//   { path: 'conference/:id', component: ConferenceDetailsComponent },
//   { path: 'all-conferences', component: ConferenceListComponent },
//   { path: 'register/:sessionId', component: RegistrationFormComponent },
//   { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },

//   { path: '**', component: PageNotFoundComponent }
// ];
const routes: Routes = [
  // כל הלקוח נטען דרך ה-ClientModule
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: '', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) },
  { path: '**', redirectTo: '' } // הכל הולך ללקוח
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

// const routes: Routes = [
//   { path: '', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) },
//   { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
//   { path: '**', redirectTo: '' }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
