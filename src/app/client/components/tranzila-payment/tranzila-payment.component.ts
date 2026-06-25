// // import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
// // import { Router } from '@angular/router';
// // import { PaymentService, PaymentPreparationResponse } from '../../../services/payment.service';

// // @Component({
// //   selector: 'app-tranzila-payment',
// //   templateUrl: './tranzila-payment.component.html',
// //   styleUrls: ['./tranzila-payment.component.css']
// // })
// // export class TranzilaPaymentComponent implements OnInit, OnDestroy {
// //   @ViewChild('paymentForm') paymentForm!: ElementRef<HTMLFormElement>;

// //   loading: boolean = true;
// //   error: string | null = null;
// //   paymentData: PaymentPreparationResponse = { terminal: '', orderId: '', amount: 0, notifyUrl: '' };
  
// //   // משתנים לניהול בדיקת סטטוס העסקה ברקע
// //   private statusCheckInterval: any;
// //   private isCheckingStatus: boolean = false;

// //   constructor(private paymentService: PaymentService, private router: Router) { }

// //   ngOnInit() {
// //     const data = history.state?.data;
// //     if (!data) {
// //       this.router.navigate(['/register/1']);
// //       return;
// //     }
// //     const payload = {
// //       ...data,
// //       orderId: data.orderId || "TEMP_" + Date.now().toString()
// //     };

// //     this.paymentService.preparePayment(payload).subscribe({
// //       next: (res) => {
// //         res.amount = 1;
// //         this.paymentData = res;
// //         this.loading = false;

// //         setTimeout(() => {
// //           this.paymentForm?.nativeElement.submit();
// //           // ברגע שהטופס נשלח ל-iFrame, אנחנו מתחילים להקשיב ל-DB שלנו
// //           this.startPollingTransactionStatus();
// //         }, 500);
// //       },
// //       error: (err) => {
// //         console.error("Payment error:", err);
// //         this.error = "אירעה שגיאה בטעינת דף התשלום.";
// //         this.loading = false;
// //       }
// //     });
// //   }

// //   // פונקציית הפולינג המעודכנת שקוראת את הסטטוס מתוך ה-JSON (בלי להסתמך על שגיאות HTTP)
// //   startPollingTransactionStatus() {
// //     this.statusCheckInterval = setInterval(() => {
// //       if (this.isCheckingStatus) return;
// //       this.isCheckingStatus = true;

// //       this.paymentService.verifyPayment('', this.paymentData.orderId).subscribe({
// //         next: (res) => {
// //           this.isCheckingStatus = false;
          
// //           if (res) {
// //             // 1. ה-Webhook של טרנזילה עדכן בהצלחה במונגו
// //             if (res.status === 'success') {
// //               this.stopPolling();
// //               this.router.navigate(['/payment/success'], { queryParams: { orderId: this.paymentData.orderId } });
// //             } 
// //             // 2. ה-Webhook של טרנזילה עדכן שהתשלום נכשל/נדחה
// //             else if (res.status === 'failed') {
// //               this.stopPolling();
// //               this.router.navigate(['/payment/failed'], { queryParams: { orderId: this.paymentData.orderId } });
// //             }
// //             // 3. אם חוזר 'pending', הפונקציה לא עושה כלום וממשיכה לפעימה הבאה בעוד 1.5 שניות
// //           }
// //         },
// //         error: (err) => {
// //           this.isCheckingStatus = false;
// //           console.error('Failsafe trigger - network error during verify polling:', err);
          
// //           // רשת ביטחון במקרה של ניתוק רשת מוחלט מול ה-API שלך - נעצור את הלולאה ונעביר לעמוד הכישלון
// //           this.stopPolling();
// //           this.router.navigate(['/payment/failed'], { queryParams: { orderId: this.paymentData.orderId } });
// //         }
// //       });
// //     }, 1500); // בדיקה כל שנייה וחצי
// //   }

// //   stopPolling() {
// //     if (this.statusCheckInterval) {
// //       clearInterval(this.statusCheckInterval);
// //     }
// //   }

// //   ngOnDestroy() {
// //     // חובה לנקות את ה-Interval כשהקומפוננטה מושמדת כדי למנוע זליגת זיכרון
// //     this.stopPolling();
// //   }
// // }
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
//   paymentData: PaymentPreparationResponse = { terminal: '', orderId: '', amount: 0, notifyUrl: '', successUrl: '', failureUrl: '' };
  
//   // משתנים לניהול בדיקת סטטוס העסקה ברקע
//   private statusCheckInterval: any;
//   private isCheckingStatus: boolean = false;

//   constructor(private paymentService: PaymentService, private router: Router) { }

//   ngOnInit() {
//     const data = history.state?.data;
//     if (!data) {
//       this.router.navigate(['/register/1']);
//       return;
//     }
//     const payload = {
//       ...data,
//       orderId: data.orderId || "TEMP_" + Date.now().toString()
//     };

//     this.paymentService.preparePayment(payload).subscribe({
//       next: (res) => {
//         // וודא שהסכום מועבר נכון (בדוגמה שלך קבעת אותו ידנית ל-1)
//         res.amount = res.amount || 1;
//         this.paymentData = res;
//         this.loading = false;

//         setTimeout(() => {
//           this.paymentForm?.nativeElement.submit();
//           // ברגע שהטופס נשלח ל-iFrame, אנחנו מתחילים להקשיב ל-DB שלנו
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

//   // פונקציית הפולינג שבודקת סטטוס מול השרת ללא שליחת שגיאות מיותרות בלופ
//   startPollingTransactionStatus() {
//     this.statusCheckInterval = setInterval(() => {
//       if (this.isCheckingStatus) return;
//       this.isCheckingStatus = true;

//       this.paymentService.verifyPayment('', this.paymentData.orderId).subscribe({
//         next: (res) => {
//           this.isCheckingStatus = false;
          
//           if (res) {
//             // 1. תשלום הצליח
//             if (res.status === 'success') {
//               this.stopPolling();
//               this.router.navigate(['/payment/success'], { queryParams: { orderId: this.paymentData.orderId } });
//             } 
//             // 2. תשלום נכשל
//             else if (res.status === 'failed') {
//               this.stopPolling();
//               this.router.navigate(['/payment/failed'], { queryParams: { orderId: this.paymentData.orderId } });
//             }
//             // 3. אם הסטטוס הוא 'pending', הפונקציה פשוט מסתיימת ומחכה לפעימה הבאה
//           }
//         },
//         error: (err) => {
//           this.isCheckingStatus = false;
//           // בודקים אם זו שגיאת רשת קריטית או רק שהעסקה טרם נמצאה
//           if (err.status !== 404) {
//             console.error('Polling error:', err);
//           }
//           // לא עוצרים את ה-Polling במקרה של 404 (העסקה טרם נוצרה ב-DB), ממשיכים לנסות
//         }
//       });
//     }, 1500); // בדיקה כל שנייה וחצי
//   }

//   stopPolling() {
//     if (this.statusCheckInterval) {
//       clearInterval(this.statusCheckInterval);
//     }
//   }

//   ngOnDestroy() {
//     // חובה לנקות את ה-Interval כדי למנוע זליגת זיכרון
//     this.stopPolling();
//   }
// }
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
  paymentData: PaymentPreparationResponse = { terminal: '', orderId: '', amount: 0, notifyUrl: '', successUrl: '', failureUrl: '' };

  private statusCheckInterval: any;
  private isCheckingStatus: boolean = false;
  private pollingStartTime: number = 0;
private readonly POLLING_TIMEOUT_MS = 30 * 1000; // 30 שניות
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

      // אם עברו 5 דקות בלי תשובה — נניח שנכשל ומנווטים לעמוד הכישלון
      if (Date.now() - this.pollingStartTime > this.POLLING_TIMEOUT_MS) {
        this.stopPolling();
        this.router.navigate(['/payment/failed'], {
          queryParams: { orderId: this.paymentData.orderId }
        });
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
              this.router.navigate(['/payment/success'], {
                queryParams: { orderId: this.paymentData.orderId }
              });
            } else if (res.status === 'failed') {
              this.stopPolling();
              this.router.navigate(['/payment/failed'], {
                queryParams: { orderId: this.paymentData.orderId }
              });
            }
            // אם 'pending' — ממשיכים לפעימה הבאה
          }
        },
        error: (err) => {
          this.isCheckingStatus = false;
          console.error('Polling error:', err);
          // שגיאת רשת קריטית — עוברים לעמוד כישלון
          this.stopPolling();
          this.router.navigate(['/payment/failed'], {
            queryParams: { orderId: this.paymentData.orderId }
          });
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