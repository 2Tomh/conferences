export interface PaymentInitRequest {
    orderId: string;
    amount: number;
    email: string;
    phone: string;
    fullName: string;
}