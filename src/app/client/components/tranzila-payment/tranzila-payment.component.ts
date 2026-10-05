import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService, PaymentPreparationResponse } from '../../../services/payment.service';

@Component({
  selector: 'app-tranzila-payment',
  templateUrl: './tranzila-payment.component.html',
  styleUrls: ['./tranzila-payment.component.css']
})
export class TranzilaPaymentComponent implements OnInit, OnChanges {
  @Input() paymentInputData: any = null;
  @ViewChild('paymentForm') paymentForm!: ElementRef<HTMLFormElement>;

  loading: boolean = false;
  error: string | null = null;
  alreadyRegistered: boolean = false;

  // שלב בחירת המטבע - מוצג לפני שהטופס נשלח אוטומטית לטרנזילה
  showCurrencyStep: boolean = true;
  selectedCurrency: 'ILS' | 'USD' = 'ILS';

  paymentData: PaymentPreparationResponse = {
    terminal: '',
    orderId: '',
    amount: 0,
    notifyUrl: '',
    successUrl: '',
    failureUrl: '',
    email: '',
    fullName: '',
    affiliation: '',
    // קוד המטבע המספרי שטרנזילה מצפה לו (1 = ILS, 2 = USD)
    currencyCode: '1'
  };

  constructor(private paymentService: PaymentService, private router: Router) { }

  ngOnInit() {
    if (!this.paymentInputData) {
      this.paymentInputData = history.state?.data;
    }
    // אם המטבע כבר נבחר קודם (ב-registration-form), מדלגים ישר לתשלום
    const incomingCurrency = this.paymentInputData?.currency;
    if (incomingCurrency === 'ILS' || incomingCurrency === 'USD') {
      this.selectedCurrency = incomingCurrency;
      this.showCurrencyStep = false;
      this.startPaymentFlow();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paymentInputData'] && this.paymentInputData && !changes['paymentInputData'].firstChange) {
      this.showCurrencyStep = true;
    }
  }

  chooseCurrency(currency: 'ILS' | 'USD'): void {
    this.selectedCurrency = currency;
  }

  confirmCurrencyAndProceed(): void {
    this.showCurrencyStep = false;
    this.startPaymentFlow();
  }

  startPaymentFlow() {
    const data = this.paymentInputData;
    if (!data) {
      this.error = 'No payment data found.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;
    this.alreadyRegistered = false;

    const payload = {
      orderId: data.orderId,
      amount: data.amount || 1,
      fullName: data.FullName || data.fullName || '',
      email: data.Email || data.email || '',
      phone: data.Phone || data.phone || '',
      conferenceId: data.ConferenceId || data.conferenceId || null,
      isLifetimeMember: data.IsLifetimeMember || false,
      affiliation: data.Affiliation || data.affiliation || '',
      address: data.Address || data.address || '',
      role: data.Role || data.role || '',
      roleCategory: data.RoleCategory || data.roleCategory || '',
      hasAbstract: data.HasAbstract || false,
      abstractTitle: data.AbstractTitle || null,
      abstractAuthors: data.FullName || data.fullName || null,
      abstractBody: data.AbstractBody || null,
      abstractNotes: data.AbstractNotes || null,
      currency: this.selectedCurrency
    };

    this.paymentService.preparePayment(payload).subscribe({
      next: (res) => {
        res.amount = res.amount || 1;
        res.currencyCode = res.currencyCode || (this.selectedCurrency === 'USD' ? '2' : '1');
        this.paymentData = res;
        this.loading = false;

        // שליחת הטופס באופן אוטומטי לדף הסליקה של טרנזילה
        setTimeout(() => {
          this.paymentForm?.nativeElement.submit();
        }, 300);
      },
      error: (err) => {
        console.error("Payment error:", err);
        this.loading = false;

        const code = err?.error?.code;
        if (code === 'ALREADY_REGISTERED') {
          this.alreadyRegistered = true;
        } else if (code === 'REGISTRATION_CLOSED') {
          // ⭐ חדש: האדמין סגר את ההרשמה לכנס (גם אם הטופס היה פתוח בדפדפן)
          this.error = 'Registration for this conference is closed. No payment was made.';
        } else {
          this.error = "An error occurred while loading the payment page.";
        }
      }
    });
  }

  closeAlreadyRegisteredPopup() {
    this.alreadyRegistered = false;
    this.router.navigate(['/ConferenceEvents']);
  }
}