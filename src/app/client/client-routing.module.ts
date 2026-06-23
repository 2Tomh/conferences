import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// קומפוננטות ראשיות ותשתית
import { ClientRootComponent } from './client-root.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UnderConstructionComponent } from './components/under-construction-component/under-construction-component.component';

// קומפוננטות כנסים
import { ConferenceListComponent } from './components/conference-list/conference-list.component';
import { ConferenceDetailsComponent } from './components/conference-details/conference-details.component';
import { ConferenceEventsComponent } from './components/conference-events/conference-events.component';
import { AboutConferenceComponent } from '../client/components/about-conference/about-conference.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';

// קומפוננטות תשלום
import { TranzilaPaymentComponent } from '../client/components/tranzila-payment/tranzila-payment.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentFailedComponent } from './components/payment-failed/payment-failed.component';

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
      // נתיבי תשלום - ממוקמים בבטחה לפני ה-Wildcard
      { path: 'payment', component: TranzilaPaymentComponent },
      { path: 'payment/success', component: PaymentSuccessComponent },
      { path: 'payment/failed', component: PaymentFailedComponent },

      // ה-Wildcard חייב להיות תמיד, אבל תמיד, האיבר האחרון במערך!
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }