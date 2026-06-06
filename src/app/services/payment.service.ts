import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { PaymentInitRequest } from '../interfaces/PaymentInitRequest'

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) { }

    initPayment(data: PaymentInitRequest): Observable<{ iframeUrl: string; orderId: string }> {
        return this.http.post<{ iframeUrl: string; orderId: string }>(
            `${this.api}/payment/init`, data
        );
    }

    verifyPayment(txId: string, orderId: string): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(
            `${this.api}/payment/verify`, { txId, orderId }
        );
    }
}