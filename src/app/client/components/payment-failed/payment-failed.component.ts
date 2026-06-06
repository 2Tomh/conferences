import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.css']
})
export class PaymentFailedComponent implements OnInit {
  errorMessage: string = 'התשלום לא הושלם.';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // בודקים אם טרנזילה שלחה סיבה לכישלון דרך ה-URL
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.errorMessage = `שגיאה: ${params['error']}`;
      }
    });
  }
}