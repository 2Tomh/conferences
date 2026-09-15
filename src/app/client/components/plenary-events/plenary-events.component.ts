import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
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

  private observer: IntersectionObserver | null = null;

  // חדש - תמיכה בקישור ישיר לאירוע ספציפי (deep link): קוראים את
  // ה-fragment מה-URL (למשל /plenary-events#eventId123) ומחכים גם
  // לו וגם לרינדור בפועל של ה-sections לפני שמנסים לגלול, כי שני
  // המקורות האלה (route fragment ו-ViewChildren) מגיעים באופן
  // אסינכרוני ובסדר לא ידוע מראש.
  private pendingFragment: string | null = null;
  private hasScrolledToFragment = false;
  private fragmentSubscription?: Subscription;

  constructor(
    private plenaryEventsService: PlenaryEventsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fragmentSubscription = this.route.fragment.subscribe(fragment => {
      this.pendingFragment = fragment;
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

  // חדש - מנסה לגלול ל-section שה-id שלו תואם לפרגמנט שב-URL.
  // מוגן ע"י hasScrolledToFragment כדי שזה יקרה פעם אחת בלבד (לא
  // בכל שינוי ברשימת ה-sections לאורך חיי הקומפוננטה), ומחכה בשקט
  // אם עדיין אין התאמה (fragment עוד לא הגיע, או ה-section המתאים
  // עדיין לא נטען/נמצא).
  private tryScrollToFragment(): void {
    if (!this.pendingFragment || this.hasScrolledToFragment) return;
    if (!this.sectionRefs || this.sectionRefs.length === 0) return;

    const target = this.sectionRefs.toArray()
      .find(ref => ref.nativeElement.id === this.pendingFragment);

    if (target) {
      this.hasScrolledToFragment = true;
      // setTimeout קצר נותן לדפדפן "פריים" נוסף לסיים layout (למשל
      // תמונות שעדיין נטענות בתוך event-media), כדי שהגלילה תנחת
      // במקום המדויק ולא תזוז אחרי שתמונה נטענת ומשנה גובה.
      setTimeout(() => {
        target.nativeElement.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 0);
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