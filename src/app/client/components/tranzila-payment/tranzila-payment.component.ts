// import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// import { Router } from '@angular/router';
// import { PaymentService, PaymentPreparationResponse } from '../../../services/payment.service';

// @Component({
//   selector: 'app-tranzila-payment',
//   templateUrl: './tranzila-payment.component.html',
//   styleUrls: ['./tranzila-payment.component.css']
// })
// export class TranzilaPaymentComponent implements OnInit, OnDestroy {
//   @ViewChild('paymentForm') paymentForm!: ElementRef<HTMLFormElement>;

//   loading: boolean = true;
//   error: string | null = null;
//   // paymentData: PaymentPreparationResponse = { terminal: '', orderId: '', amount: 0, notifyUrl: '', successUrl: '', failureUrl: '' };

//   paymentData: PaymentPreparationResponse = {
//     terminal: '',
//     orderId: '',
//     amount: 0,
//     notifyUrl: '',
//     successUrl: '',
//     failureUrl: '',
//     email: '',   // ← הוסף
//     fullName: ''    // ← הוסף
//   };
//   private statusCheckInterval: any;
//   private isCheckingStatus: boolean = false;
//   private pollingStartTime: number = 0;
//   private readonly POLLING_TIMEOUT_MS = 10 * 60 * 1000; // 10 דקות
//   constructor(private paymentService: PaymentService, private router: Router) { }

//   ngOnInit() {
//     const data = history.state?.data;
//     if (!data) {
//       this.router.navigate(['/register/1']);
//       return;
//     }

//     const payload = {
//       ...data,
//       orderId: data.orderId
//     };

//     this.paymentService.preparePayment(payload).subscribe({
//       next: (res) => {
//         res.amount = res.amount || 1;
//         this.paymentData = res;
//         this.loading = false;

//         setTimeout(() => {
//           this.paymentForm?.nativeElement.submit();
//           this.startPollingTransactionStatus();
//         }, 500);
//       },
//       error: (err) => {
//         console.error("Payment error:", err);
//         this.error = "אירעה שגיאה בטעינת דף התשלום.";
//         this.loading = false;
//       }
//     });
//   }

//   startPollingTransactionStatus() {
//     this.pollingStartTime = Date.now();

//     this.statusCheckInterval = setInterval(() => {

//       // אם עברו 5 דקות בלי תשובה — נניח שנכשל ומנווטים לעמוד הכישלון
//       if (Date.now() - this.pollingStartTime > this.POLLING_TIMEOUT_MS) {
//         this.stopPolling();
//         this.router.navigate(['/payment/failed'], {
//           queryParams: { orderId: this.paymentData.orderId }
//         });
//         return;
//       }

//       if (this.isCheckingStatus) return;
//       this.isCheckingStatus = true;

//       this.paymentService.verifyPayment('', this.paymentData.orderId).subscribe({
//         next: (res) => {
//           this.isCheckingStatus = false;

//           if (res) {
//             if (res.status === 'success') {
//               this.stopPolling();
//               this.router.navigate(['/payment/success'], {
//                 queryParams: { orderId: this.paymentData.orderId }
//               });
//             } else if (res.status === 'failed') {
//               this.stopPolling();
//               this.router.navigate(['/payment/failed'], {
//                 queryParams: { orderId: this.paymentData.orderId }
//               });
//             }
//             // אם 'pending' — ממשיכים לפעימה הבאה
//           }
//         },
//         error: (err) => {
//           this.isCheckingStatus = false;
//           console.error('Polling error:', err);
//           // שגיאת רשת קריטית — עוברים לעמוד כישלון
//           this.stopPolling();
//           this.router.navigate(['/payment/failed'], {
//             queryParams: { orderId: this.paymentData.orderId }
//           });
//         }
//       });
//     }, 1500);
//   }

//   stopPolling() {
//     if (this.statusCheckInterval) {
//       clearInterval(this.statusCheckInterval);
//     }
//   }

//   ngOnDestroy() {
//     this.stopPolling();
//   }
// }
import { Component, OnInit, OnChanges, ViewChild, ElementRef, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService, PaymentPreparationResponse } from '../../../services/payment.service';

@Component({
  selector: 'app-tranzila-payment',
  templateUrl: './tranzila-payment.component.html',
  styleUrls: ['./tranzila-payment.component.css']
})
export class TranzilaPaymentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() paymentInputData: any = null;
  @ViewChild('paymentForm') paymentForm!: ElementRef<HTMLFormElement>;

  loading: boolean = true;
  error: string | null = null;
  paymentData: PaymentPreparationResponse = {
    terminal: '',
    orderId: '',
    amount: 0,
    notifyUrl: '',
    successUrl: '',
    failureUrl: '',
    email: '',
    fullName: ''
  };

  private statusCheckInterval: any;
  private isCheckingStatus: boolean = false;
  private pollingStartTime: number = 0;
  private readonly POLLING_TIMEOUT_MS = 10 * 60 * 1000;

  constructor(private paymentService: PaymentService, private router: Router) { }

  ngOnInit() {
    if (!this.paymentInputData) {
      this.paymentInputData = history.state?.data; // fallback אם מישהו עדיין מנווט ישירות
    }
    this.startPaymentFlow();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paymentInputData'] && this.paymentInputData && !changes['paymentInputData'].firstChange) {
      this.startPaymentFlow();
    }
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

    const payload = { ...data, orderId: data.orderId };

    this.paymentService.preparePayment(payload).subscribe({
      next: (res) => {
        res.amount = res.amount || 1;
        this.paymentData = res;
        this.loading = false;
        setTimeout(() => {
          this.paymentForm?.nativeElement.submit();
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

  startPollingTransactionStatus() {
    this.pollingStartTime = Date.now();
    this.statusCheckInterval = setInterval(() => {
      if (Date.now() - this.pollingStartTime > this.POLLING_TIMEOUT_MS) {
        this.stopPolling();
        this.router.navigate(['/payment/failed'], { queryParams: { orderId: this.paymentData.orderId } });
        return;
      }
      if (this.isCheckingStatus) return;
      this.isCheckingStatus = true;
      this.paymentService.verifyPayment('', this.paymentData.orderId).subscribe({
        next: (res) => {
          this.isCheckingStatus = false;
          if (res) {
            if (res.status === 'success') {
              this.stopPolling();
              this.router.navigate(['/payment/success'], { queryParams: { orderId: this.paymentData.orderId } });
            } else if (res.status === 'failed') {
              this.stopPolling();
              this.router.navigate(['/payment/failed'], { queryParams: { orderId: this.paymentData.orderId } });
            }
          }
        },
        error: (err) => {
          this.isCheckingStatus = false;
          console.error('Polling error:', err);
          this.stopPolling();
          this.router.navigate(['/payment/failed'], { queryParams: { orderId: this.paymentData.orderId } });
        }
      });
    }, 1500);
  }

  stopPolling() {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
  }

  ngOnDestroy() {
    this.stopPolling();
  }
}