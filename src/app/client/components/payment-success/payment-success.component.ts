// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ApiService } from '../../../services/api.service';

// @Component({
//   selector: 'app-payment-success',
//   templateUrl: './payment-success.component.html',
//   styleUrls: ['./payment-success.component.css']
// })
// export class PaymentSuccessComponent implements OnInit, OnDestroy {
//   orderId: string | null = null;
//   loading: boolean = false;
//   success: boolean = true;
//   countdown: number = 4;
//   timerInterval: any;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private apiService: ApiService
//   ) { }

// ngOnInit(): void {
//     this.orderId = this.route.snapshot.queryParamMap.get('orderId');

//     if (this.orderId) {
//         setTimeout(() => {
//             this.apiService.sendPaymentConfirmation(this.orderId!).subscribe({
//                 next: (res) => console.log('[EMAIL] תשובה מהשרת:', res),
//                 error: (err) => console.error('[EMAIL ERROR]', err)
//             });
//         }, 3000);
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

  ngOnInit(): void {
    if (this.timerInterval) return;

    this.orderId = this.route.snapshot.queryParamMap.get('orderId');

    if (this.orderId) {
      setTimeout(() => {
        this.apiService.sendPaymentConfirmation(this.orderId!).subscribe();
      }, 3000);
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