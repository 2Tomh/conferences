import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.css']
})
export class PaymentFailedComponent implements OnInit {
  orderId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.queryParamMap.get('orderId');
  }
}