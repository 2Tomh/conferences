import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit, OnDestroy {
  orderId: string | null = null;
  countdown: number = 4; // מונה שניות לאחור בשביל חווית המשתמש
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router // הזרקת ה-Router לצורך הניווט לדף הבית
  ) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');

    // ניהול טיימר לאחור שמעביר את המשתמש אוטומטית לדף הבית
    this.timerInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.router.navigate(['/']); // ניווט אוטומטי לעמוד הבית
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    // ניקוי הטיימר במידה והמשתמש יצא מהעמוד באופן ידני לפני הזמן
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}