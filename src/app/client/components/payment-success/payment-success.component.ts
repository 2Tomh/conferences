// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';

// @Component({
//   selector: 'app-payment-success',
//   templateUrl: './payment-success.component.html',
//   styleUrls: ['./payment-success.component.css']
// })
// export class PaymentSuccessComponent implements OnInit, OnDestroy {
//   orderId: string | null = null;

//   // הוספת המשתנים החסרים שה-HTML מחפש
//   loading: boolean = false; 
//   success: boolean = true;  

//   countdown: number = 4; 
//   timerInterval: any;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router 
//   ) { }

//   // ngOnInit(): void {
//   //   this.orderId = this.route.snapshot.queryParamMap.get('orderId');

//   //   this.timerInterval = setInterval(() => {
//   //     this.countdown--;
//   //     if (this.countdown === 0) {
//   //       this.router.navigate(['/']); 
//   //     }
//   //   }, 1000);
//   // }
// ngOnInit(): void {
//     this.orderId = this.route.snapshot.queryParamMap.get('orderId');

//     // שלח מייל אישור
//     if (this.orderId) {
//         this.http.post('https://conference-backend-8339.onrender.com/api/payment/send-confirmation', 
//             { orderId: this.orderId }
//         ).subscribe();
//     }

//     this.timerInterval = setInterval(() => {
//         this.countdown--;
//         if (this.countdown === 0) {
//             this.router.navigate(['/']);
//         }
//     }, 1000);
// }
//   ngOnDestroy(): void {
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval);
//     }
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit, OnDestroy {
  orderId: string | null = null;
  loading: boolean = false;
  success: boolean = true;
  countdown: number = 4;
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  // ngOnInit(): void {
  //   this.orderId = this.route.snapshot.queryParamMap.get('orderId');

  //   if (this.orderId) {
  //     this.apiService.sendPaymentConfirmation(this.orderId).subscribe({
  //       next: () => console.log('[EMAIL] בקשת מייל נשלחה'),
  //       error: (err) => console.error('[EMAIL ERROR]', err)
  //     });
  //   }

  //   this.timerInterval = setInterval(() => {
  //     this.countdown--;
  //     if (this.countdown === 0) {
  //       this.router.navigate(['/']);
  //     }
  //   }, 1000);
  // }
  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');

    // המתן 3 שניות לפני שליחת המייל כדי לתת לנוטיפיקציה להגיע
    if (this.orderId) {
      setTimeout(() => {
        this.apiService.sendPaymentConfirmation(this.orderId!).subscribe({
          next: () => console.log('[EMAIL] בקשת מייל נשלחה'),
          error: (err) => console.error('[EMAIL ERROR]', err)
        });
      }, 3000); // 3 שניות השהיה
    }

    this.timerInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.router.navigate(['/']);
      }
    }, 1000);
  }
  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}