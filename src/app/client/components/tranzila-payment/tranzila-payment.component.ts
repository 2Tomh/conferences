import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PaymentService } from '../../../services/payment.service';
// וודא שהנתיב הזה נכון לפי מבנה התיקיות שלך:
import { PaymentInitRequest } from '../../../interfaces/PaymentInitRequest';

@Component({
  selector: 'app-tranzila-payment',
  templateUrl: './tranzila-payment.component.html',
  styleUrls: ['./tranzila-payment.component.css']
})
export class TranzilaPaymentComponent implements OnInit {

  iframeUrl: SafeResourceUrl | null = null;
  loading: boolean = true;
  error: string | null = null;
  registrationData: any;

  constructor(
    private paymentService: PaymentService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit() {
    this.registrationData = history.state?.data;

    if (!this.registrationData) {
      this.router.navigate(['/register/1']);
      return;
    }

    this.initPayment();
  }

  initPayment() {
    this.loading = true;
    this.error = null;

    // עכשיו ה-payload מוכר ומסודר לפי ה-Interface המשותף
    const payload: PaymentInitRequest = {
      orderId: "TEMP_" + Date.now().toString(),
      amount: this.registrationData.amount,
      email: this.registrationData.email,
      // תשתמש בשמות המדויקים שנשלחו מהטופס:
      phone: this.registrationData.phone,
      fullName: this.registrationData.fullName
    };

    this.paymentService.initPayment(payload).subscribe({
      next: (res) => {
        if (res && res.iframeUrl) {
          this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.iframeUrl);
        } else {
          this.error = "לא התקבלה כתובת תשלום מהשרת.";
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("Payment Init Error:", err);
        this.error = "אירעה שגיאה בטעינת דף התשלום. אנא נסה שוב מאוחר יותר.";
        this.loading = false;
      }
    });
  }
}