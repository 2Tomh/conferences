import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRootComponent } from './admin-root/admin-root.component';
import { LoginComponent } from './components/login/login.component'; // שים לב לנתיב המעודכן
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard'; // וודא שהנתיב נכון
import { ManageConferenceComponent } from './components/manage-conference/manage-conference.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
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
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
