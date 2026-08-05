import { Component } from '@angular/core';

interface ContactChannel {
  title: string;
  description: string;
  email: string;
}

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  paymentContact: ContactChannel = {
    title: 'Payment & Billing Support',
    description: 'For issues related to payment during registration (charges, receipts, failed transactions), please contact our payment provider, Kapaim, directly.',
    email: 'Rutiro@kapaim.co.il'
  };

  // ⭐ חדש: בונה קישור לפתיחת Gmail compose בדפדפן, במקום mailto: שפותח את
  // תוכנת המייל שמוגדרת כברירת מחדל במערכת ההפעלה (למשל Outlook)
  gmailComposeLink(email: string): string {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  }
}