import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService, PaymentPreparationResponse } from '../../../services/payment.service';

@Component({
  selector: 'app-tranzila-payment',
  templateUrl: './tranzila-payment.component.html',
  styleUrls: ['./tranzila-payment.component.css']
})
export class TranzilaPaymentComponent implements OnInit, OnDestroy {
  @ViewChild('paymentForm') paymentForm!: ElementRef<HTMLFormElement>;

  loading: boolean = true;
  error: string | null = null;
  paymentData: PaymentPreparationResponse = { terminal: '', orderId: '', amount: 0, notifyUrl: '' };
  
  // משתנים לניהול בדיקת סטטוס העסקה ברקע
  private statusCheckInterval: any;
  private isCheckingStatus: boolean = false;

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
        res.amount = 1;
        this.paymentData = res;
        this.loading = false;

        setTimeout(() => {
          this.paymentForm?.nativeElement.submit();
          // ברגע שהטופס נשלח ל-iFrame, אנחנו מתחילים להקשיב ל-DB שלנו
          this.startPollingTransactionStatus();
        }, 500);
      },
      error: (err) => {
        console.error("Payment error:", err);
        this.error = "אירעה שגיאה בטעינת דף התשלום.";
        this.loading = false;
      }
    });
  }

  // פונקציית הפולינג שבודקת את הסטטוס במונגו כל 1.5 שניות
  startPollingTransactionStatus() {
    this.statusCheckInterval = setInterval(() => {
      // מניעת כפילויות של קריאות אם אחת עדיין בדרך
      if (this.isCheckingStatus) return;
      this.isCheckingStatus = true;

      // שימוש בפונקציית ה-verify שכבר קיימת לך ב-Service כדי לבדוק את הסטטוס בשרת
      this.paymentService.verifyPayment('', this.paymentData.orderId).subscribe({
        next: (res) => {
          this.isCheckingStatus = false;
          
          if (res.success) {
            // ה-Webhook הגיע ל-C#, העסקה עודכנה ל-success במונגו -> טסבלעמוד שלך!
            this.stopPolling();
            this.router.navigate(['/payment/success'], { queryParams: { orderId: this.paymentData.orderId } });
          }
        },
        error: (err) => {
          this.isCheckingStatus = false;
          // אם השרת מחזיר BadRequest או סטטוס נכשל, נעביר לעמוד הכישלון שלך
          if (err.status === 400) {
            this.stopPolling();
            this.router.navigate(['/payment/failed'], { queryParams: { orderId: this.paymentData.orderId } });
          }
        }
      });
    }, 1500); // בדיקה כל שנייה וחצי
  }

  stopPolling() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  }

  ngOnDestroy() {
    // חובה לנקות את הצינור כשהקומפוננטה מושמדת
    this.stopPolling();
  }
}