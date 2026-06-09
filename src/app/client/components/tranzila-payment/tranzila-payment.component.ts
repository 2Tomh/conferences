import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService, PaymentPreparationResponse } from '../../../services/payment.service';

@Component({
  selector: 'app-tranzila-payment',
  templateUrl: './tranzila-payment.component.html',
  styleUrls: ['./tranzila-payment.component.css']
})
export class TranzilaPaymentComponent implements OnInit {
  @ViewChild('paymentForm') paymentForm!: ElementRef<HTMLFormElement>;

  loading: boolean = true;
  error: string | null = null;
  paymentData: PaymentPreparationResponse = { terminal: '', orderId: '', amount: 0, notifyUrl: '' };

  constructor(private paymentService: PaymentService, private router: Router) { }

  ngOnInit() {
    const data = history.state?.data;
    if (!data) {
      this.router.navigate(['/register/1']);
      return;
    }
    const payload = {
      ...data,
      orderId: data.orderId || "TEMP_" + Date.now().toString()
    };

    this.paymentService.preparePayment(payload).subscribe({
      next: (res) => {
        this.paymentData = res;
        this.loading = false;

        setTimeout(() => {
          this.paymentForm?.nativeElement.submit();
        }, 500);
      },
      error: (err) => {
        console.error("Payment error:", err);
        this.error = "אירעה שגיאה בטעינת דף התשלום.";
        this.loading = false;
      }
    });
  }
}