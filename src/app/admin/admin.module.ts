import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminRootComponent } from './admin-root/admin-root.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AttendeeListComponent } from './components/attendee-list/attendee-list.component';
import { ManageConferenceComponent } from './components/manage-conference/manage-conference.component';
import { LoginComponent } from './components/login/login.component';
import { AdminNavBarComponent } from './components/admin-nav-bar/admin-nav-bar.component';

// ייבוא רכיבי Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

// שאר הקומפוננטות שלך...

// Material Imports

@NgModule({
  declarations: [
    AdminRootComponent,
    DashboardComponent,
    AttendeeListComponent,
    ManageConferenceComponent,
    LoginComponent,
    AdminNavBarComponent,
    CreateUserComponent,
    UserManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule, // פותר את שגיאת formGroup
    MatFormFieldModule,  // פותר את שגיאת mat-form-field
    MatInputModule
  ]
})
export class AdminModule { }