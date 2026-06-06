import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  loading = true;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    // טרנזילה תחזיר את המשתמש לכתובת הזו עם פרמטרים ב-URL
    // למשל: /payment/success?txId=12345&orderId=TEST12345
    this.route.queryParams.subscribe(params => {
      const txId = params['txId'];
      const orderId = params['orderId'];

      if (txId && orderId) {
        this.verifyTransaction(txId, orderId);
      } else {
        this.loading = false;
        this.success = false;
      }
    });
  }

  verifyTransaction(txId: string, orderId: string) {
    this.paymentService.verifyPayment(txId, orderId).subscribe({
      next: (res) => {
        this.success = res.success;
        this.loading = false;
      },
      error: () => {
        this.success = false;
        this.loading = false;
      }
    });
  }
}