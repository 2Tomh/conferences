// import { Component, OnInit, OnChanges, ViewChild, ElementRef, OnDestroy, Input, SimpleChanges } from '@angular/core';
// import { Router } from '@angular/router';
// import { PaymentService, PaymentPreparationResponse } from '../../../services/payment.service';

// @Component({
//   selector: 'app-tranzila-payment',
//   templateUrl: './tranzila-payment.component.html',
//   styleUrls: ['./tranzila-payment.component.css']
// })
// export class TranzilaPaymentComponent implements OnInit, OnChanges, OnDestroy {
//   @Input() paymentInputData: any = null;
//   @ViewChild('paymentForm') paymentForm!: ElementRef<HTMLFormElement>;

//   loading: boolean = true;
//   error: string | null = null;
//   alreadyRegistered: boolean = false; // Shows a dedicated popup when the user already has a paid registration for this conference

//   paymentData: PaymentPreparationResponse = {
//     terminal: '',
//     orderId: '',
//     amount: 0,
//     notifyUrl: '',
//     successUrl: '',
//     failureUrl: '',
//     email: '',
//     fullName: ''
//   };

//   private statusCheckInterval: any;
//   private isCheckingStatus: boolean = false;
//   private pollingStartTime: number = 0;
//   private readonly POLLING_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

//   constructor(private paymentService: PaymentService, private router: Router) { }

//   ngOnInit() {
//     if (!this.paymentInputData) {
//       this.paymentInputData = history.state?.data;
//     }
//     this.startPaymentFlow();
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['paymentInputData'] && this.paymentInputData && !changes['paymentInputData'].firstChange) {
//       this.startPaymentFlow();
//     }
//   }

//   startPaymentFlow() {
//     const data = this.paymentInputData;
//     if (!data) {
//       this.error = 'No payment data found.';
//       this.loading = false;
//       return;
//     }

//     this.loading = true;
//     this.error = null;
//     this.alreadyRegistered = false;

//     const payload = {
//       orderId: data.orderId,
//       amount: data.amount || 1,
//       fullName: data.FullName || data.fullName || '',
//       email: data.Email || data.email || '',
//       phone: data.Phone || data.phone || '',
//       conferenceId: data.ConferenceId || data.conferenceId || null,
//       isLifetimeMember: data.IsLifetimeMember || false,
//       // Personal fields - required so the final Attendee record is built correctly
//       affiliation: data.Affiliation || data.affiliation || '',
//       address: data.Address || data.address || '',
//       role: data.Role || data.role || '',
//       roleCategory: data.RoleCategory || data.roleCategory || '',
//       hasAbstract: data.HasAbstract || false,
//       abstractTitle: data.AbstractTitle || null,
//       abstractAuthors: data.FullName || data.fullName || null,
//       abstractBody: data.AbstractBody || null,
//       abstractNotes: data.AbstractNotes || null
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
//         this.loading = false;

//         // Reliable check against a structured error code from the backend,
//         // instead of matching free text (which is fragile across encodings/wrapping)
//         if (err?.error?.code === 'ALREADY_REGISTERED') {
//           this.alreadyRegistered = true;
//         } else {
//           this.error = "An error occurred while loading the payment page.";
//         }
//       }
//     });
//   }

// closeAlreadyRegisteredPopup() {
//   this.alreadyRegistered = false;
//   this.router.navigate(['/ConferenceEvents']); // Redirect back to the conferences list
// }

//   startPollingTransactionStatus() {
//     this.pollingStartTime = Date.now();
//     this.statusCheckInterval = setInterval(() => {
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
//           }
//         },
//         error: (err) => {
//           this.isCheckingStatus = false;
//           console.error('Polling error:', err);
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
  alreadyRegistered: boolean = false; // Shows a dedicated popup when the user already has a paid registration for this conference

  paymentData: PaymentPreparationResponse = {
    terminal: '',
    orderId: '',
    amount: 0,
    notifyUrl: '',
    successUrl: '',
    failureUrl: '',
    email: '',
    fullName: '',
    affiliation: '' // ⭐ חדש
  };

  private statusCheckInterval: any;
  private isCheckingStatus: boolean = false;
  private pollingStartTime: number = 0;
  private readonly POLLING_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

  constructor(private paymentService: PaymentService, private router: Router) { }

  ngOnInit() {
    if (!this.paymentInputData) {
      this.paymentInputData = history.state?.data;
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
    this.alreadyRegistered = false;

    const payload = {
      orderId: data.orderId,
      amount: data.amount || 1,
      fullName: data.FullName || data.fullName || '',
      email: data.Email || data.email || '',
      phone: data.Phone || data.phone || '',
      conferenceId: data.ConferenceId || data.conferenceId || null,
      isLifetimeMember: data.IsLifetimeMember || false,
      // Personal fields - required so the final Attendee record is built correctly
      affiliation: data.Affiliation || data.affiliation || '',
      address: data.Address || data.address || '',
      role: data.Role || data.role || '',
      roleCategory: data.RoleCategory || data.roleCategory || '',
      hasAbstract: data.HasAbstract || false,
      abstractTitle: data.AbstractTitle || null,
      abstractAuthors: data.FullName || data.fullName || null,
      abstractBody: data.AbstractBody || null,
      abstractNotes: data.AbstractNotes || null
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
        this.loading = false;

        // Reliable check against a structured error code from the backend,
        // instead of matching free text (which is fragile across encodings/wrapping)
        if (err?.error?.code === 'ALREADY_REGISTERED') {
          this.alreadyRegistered = true;
        } else {
          this.error = "An error occurred while loading the payment page.";
        }
      }
    });
  }

  closeAlreadyRegisteredPopup() {
    this.alreadyRegistered = false;
    this.router.navigate(['/ConferenceEvents']); // Redirect back to the conferences list
  }

  startPollingTransactionStatus() {
    this.pollingStartTime = Date.now();
    this.statusCheckInterval = setInterval(() => {
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
          }
        },
        error: (err) => {
          this.isCheckingStatus = false;
          console.error('Polling error:', err);
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