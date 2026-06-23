import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRootComponent } from './admin-root/admin-root.component';
import { LoginComponent } from './components/login/login.component'; // שים לב לנתיב המעודכן
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard'; // וודא שהנתיב נכון
import { ManageConferenceComponent } from './components/manage-conference/manage-conference.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AttendeeListComponent } from '../admin/components/attendee-list/attendee-list.component';
import { ConferenceEditComponent } from './components/conference-edit/conference-edit.component'
const routes: Routes = [
  {
    path: '',
    component: AdminRootComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'manage-conference', component: ManageConferenceComponent, canActivate: [AuthGuard] },
      { path: 'manage-conference/:id', component: ManageConferenceComponent, canActivate: [AuthGuard] },
      { path: 'create-user', component: CreateUserComponent, canActivate: [AuthGuard] },
      { path: 'users', component: UserManagementComponent, canActivate: [AuthGuard] },
      { path: 'attendees', component: AttendeeListComponent, canActivate: [AuthGuard] },
      { path: 'create-conference', component: ManageConferenceComponent, canActivate: [AuthGuard] },
      { path: 'edit-conference', component: ConferenceEditComponent, canActivate: [AuthGuard] }, // דף בחירת הכנס לעריכה
      { path: 'edit-conference/:id', component: ConferenceEditComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
