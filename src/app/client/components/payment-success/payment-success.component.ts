import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  orderId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');
  }
}