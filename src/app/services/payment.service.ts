import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { PaymentInitRequest } from '../interfaces/PaymentInitRequest';

// export interface PaymentPreparationResponse {
//     terminal: string;
//     orderId: string;
//     amount: number;
//     notifyUrl: string;
//     successUrl?: string; // הוספת השדה הזה
//     failureUrl?: string;
// }

export interface PaymentPreparationResponse {
    terminal: string;
    orderId: string;
    amount: number;
    notifyUrl: string;
    successUrl?: string;
    failureUrl?: string;
    email?: string;      // ← הוסף
    fullName?: string;   // ← הוסף
}
@Injectable({ providedIn: 'root' })
export class PaymentService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // פונקציה להכנת תשלום (לארכיטקטורת ה-iFrame החדשה)
    preparePayment(data: PaymentInitRequest): Observable<PaymentPreparationResponse> {
        // השתמש בנתיב המדויק שמוגדר ב-Controller שלך (prepare-payment)
        return this.http.post<PaymentPreparationResponse>(
            `${this.api}/payment/prepare-payment`,
            data
        );
    }

    // פונקציה לאימות תשלום (נקראת בדף ה-Success)
    verifyPayment(txId: string, orderId: string): Observable<any> {
        // חובה לשלוח את ה-orderId כאובייקט בתוך ה-Body של ה-POST
        return this.http.post('https://conference-backend-8339.onrender.com/api/payment/verify', {
            txId: txId,
            orderId: orderId
        });
    }
}