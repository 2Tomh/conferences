import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './admin/interceptors/auth.interceptor';
import { HomeComponent } from './client/components/home/home.component';
import { UnderConstructionComponent } from './client/components/under-construction-component/under-construction-component.component';
import { RegistrationFormComponent } from './client/components/registration-form/registration-form.component';
import { ConferenceDetailsComponent } from './client/components/conference-details/conference-details.component';
import { CommonModule } from '@angular/common';
import { ConferenceListComponent } from './client/components/conference-list/conference-list.component';
import { ClientModule } from './client/client.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }