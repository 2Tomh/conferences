// export interface PaymentInitRequest {
//     orderId: string;
//     amount: number;
//     email: string;
//     phone: string;
//     fullName: string;
// }

export interface PaymentInitRequest {
    orderId: string;
    amount: number;
    email: string;
    phone: string;
    fullName: string;
    conferenceId?: string;
    isLifetimeMember?: boolean;
    hasAbstract?: boolean;
    abstractTitle?: string;
    abstractAuthors?: string;
    hasPoster?: boolean;
    posterTitle?: string;
    posterAuthors?: string;
}