import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlenaryEventsService, PlenaryEvent } from '../../../services/plenary-events.service';

@Component({
  selector: 'app-plenary-events',
  templateUrl: './plenary-events.component.html',
  styleUrls: ['./plenary-events.component.css']
})
export class PlenaryEventsComponent implements OnInit, AfterViewInit, OnDestroy {

  events: PlenaryEvent[] = [];
  activeIndex = 0;

  // כל snap-section בעמוד (המבוא + section לכל אירוע) - רשימה חיה שמתעדכנת
  // אוטומטית ברגע שהאירועים מגיעים מה-API ו-ngFor מרנדר את ה-DOM
  @ViewChildren('snapSection') sectionRefs!: QueryList<ElementRef<HTMLElement>>;

  // חדש - handle לקונטיינר הגלילה עצמו (.plenary-wrapper), כדי
  // שנוכל לנטרל זמנית את ה-scroll-snap שלו בזמן קפיצה ישירה
  // (ראו הסבר מפורט ב-waitForStableLayoutThenScroll למטה).
  @ViewChild('plenaryWrapper') wrapperRef!: ElementRef<HTMLElement>;

  private observer: IntersectionObserver | null = null;

  // תמיכה בקישור ישיר לאירוע ספציפי (deep link): קוראים את
  // ה-fragment מה-URL ומחכים גם לו וגם לרינדור בפועל של ה-sections
  // לפני שמנסים לגלול, כי שני המקורות האלה (route fragment
  // ו-ViewChildren) מגיעים באופן אסינכרוני ובסדר לא ידוע מראש.
  private pendingFragment: string | null = null;
  private hasScrolledToFragment = false;
  private fragmentSubscription?: Subscription;

  constructor(
    private plenaryEventsService: PlenaryEventsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fragmentSubscription = this.route.fragment.subscribe(fragment => {
      this.pendingFragment = this.extractEventId(fragment);
      this.tryScrollToFragment();
    });

    this.plenaryEventsService.getAll().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error('Failed to load plenary events:', err)
    });
  }

  ngAfterViewInit(): void {
    // מרכיבים מחדש את ה-observer בכל פעם שרשימת ה-sections משתנה
    // (כלומר גם ברגע שהאירועים מגיעים מה-API אחרי הטעינה הראשונית),
    // ומנסים לגלול לפרגמנט בכל שינוי כזה - כי רק אחרי שהאירועים
    // נטענו ה-section הרלוונטי בכלל קיים ב-DOM.
    this.sectionRefs.changes.subscribe(() => {
      this.setupObserver();
      this.tryScrollToFragment();
    });
    this.setupObserver();
    this.tryScrollToFragment();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.fragmentSubscription?.unsubscribe();
  }

  private setupObserver(): void {
    this.observer?.disconnect();

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const index = this.sectionRefs.toArray()
            .findIndex(ref => ref.nativeElement === visible.target);
          if (index !== -1) this.activeIndex = index;
        }
      },
      { threshold: [0.5] }
    );

    this.sectionRefs.forEach(ref => this.observer!.observe(ref.nativeElement));
  }

  // הפרגמנט בפועל מגיע בפורמט "id=<eventId>" (למשל
  // "id=6aa15d9f54530c3035a1d671"), לא כ-ID גולמי. תומך גם בפורמט
  // "id=xxx" וגם ב-ID גולמי ("#xxx").
  private extractEventId(fragment: string | null): string | null {
    if (!fragment) return null;
    const match = fragment.match(/^id=(.+)$/);
    return match ? match[1] : fragment;
  }

  // מנסה לגלול ל-section שה-id שלו תואם לפרגמנט שב-URL. מוגן ע"י
  // hasScrolledToFragment כדי שזה יקרה פעם אחת בלבד.
  private tryScrollToFragment(): void {
    if (!this.pendingFragment || this.hasScrolledToFragment) return;
    if (!this.sectionRefs || this.sectionRefs.length === 0) return;

    const target = this.sectionRefs.toArray()
      .find(ref => ref.nativeElement.id === this.pendingFragment);

    if (target) {
      this.hasScrolledToFragment = true;
      this.waitForStableLayoutThenScroll(target.nativeElement);
    }
  }

  // תוקן - הבאג: קפיצה מיידית (setTimeout(0)) הייתה מתבצעת לפני
  // שהדף התייצב (תמונות ב-loading="lazy" עדיין בטעינה, גבהים
  // משתנים). בגלל scroll-snap-type: y mandatory על .plenary-wrapper,
  // הדפדפן "מתקן" את מיקום הגלילה לפי snap point הקרוב ביותר תוך
  // כדי שהתמונות ממשיכות לטעון ולשנות את הגבהים - מה שגרם לגלילה
  // "לגלוש" עד ה-section האחרון בעמוד במקום להישאר על האירוע
  // המבוקש. התיקון: (1) ממתינים לטעינה מלאה של הדף (כולל תמונות,
  // לא רק DOM) לפני שמנסים לגלול בכלל, ו-(2) מנטרלים זמנית את
  // ה-scroll-snap על הקונטיינר תוך כדי הקפיצה עצמה, כדי שהדפדפן לא
  // "יתקן" את המיקום שלנו בעצמו תוך כדי טעינה נוספת.
  private waitForStableLayoutThenScroll(el: HTMLElement): void {
    let hasScrolled = false;

    const performScroll = () => {
      if (hasScrolled) return;
      hasScrolled = true;

      const wrapper = this.wrapperRef?.nativeElement;
      wrapper?.classList.add('scroll-jump-active');

      // שני requestAnimationFrame נותנים לדפדפן שני "פריימים" מלאים
      // לסיים layout/paint אחרי שהתמונות נטענו, לפני שמבצעים את
      // הקפיצה בפועל.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });

          // מחזירים את ה-snap בחזרה אחרי שהקפיצה "נחתה" והתייצבה,
          // לא מיד - כדי שלא יתפוס אותנו באמצע התנועה.
          setTimeout(() => {
            wrapper?.classList.remove('scroll-jump-active');
          }, 400);
        });
      });
    };

    if (document.readyState === 'complete') {
      performScroll();
    } else {
      window.addEventListener('load', performScroll, { once: true });
      // רשת/תמונות איטיות - לא מחכים לנצח ל-load, אחרי 1.5 שניות
      // קופצים בכל מקרה גם אם עדיין לא הכל נטען.
      setTimeout(performScroll, 1500);
    }
  }

  scrollToIndex(index: number): void {
    const target = this.sectionRefs.toArray()[index];
    target?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  hasSequence(event: PlenaryEvent): boolean {
    return !!event.Schedule && event.Schedule.length > 1;
  }
}