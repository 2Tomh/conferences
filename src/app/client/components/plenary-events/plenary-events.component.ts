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

  @ViewChildren('snapSection') sectionRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('plenaryWrapper') wrapperRef!: ElementRef<HTMLElement>;

  private observer: IntersectionObserver | null = null;

  private pendingFragment: string | null = null;
  private hasFoundTarget = false;
  private fragmentSubscription?: Subscription;

  // חדש - "אכיפת" מיקום: אחרי שמצאנו את ה-section הנכון, אנחנו לא
  // מסתפקים בקפיצה חד-פעמית. במקום זאת, במשך חלון זמן קצר (3
  // שניות) אנחנו מאזינים לאירועי scroll על הקונטיינר, ואם מישהו/
  // משהו אחר (למשל סקריפט חיצוני של הפלטפורמה שמפרש #id=xxx בדרך
  // משלו ומריץ קפיצה מתחרה) מזיז אותנו הרחק מהיעד - קופצים בחזרה
  // אליו שוב. זה עוקף את הבעיה בלי צורך לדעת בדיוק מי/מה מתחרה בנו
  // על מיקום הגלילה.
  private enforcementTarget: HTMLElement | null = null;
  private enforcementDeadline = 0;
  private enforcementScrollListener: (() => void) | null = null;

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
    this.stopEnforcement();
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

  private extractEventId(fragment: string | null): string | null {
    if (!fragment) return null;
    const match = fragment.match(/^id=(.+)$/);
    return match ? match[1] : fragment;
  }

  private tryScrollToFragment(): void {
    if (!this.pendingFragment || this.hasFoundTarget) return;
    if (!this.sectionRefs || this.sectionRefs.length === 0) return;

    const target = this.sectionRefs.toArray()
      .find(ref => ref.nativeElement.id === this.pendingFragment);

    if (target) {
      this.hasFoundTarget = true;
      this.waitForStableLayoutThenScroll(target.nativeElement);
    }
  }

  private waitForStableLayoutThenScroll(el: HTMLElement): void {
    let hasScrolled = false;

    const performScroll = () => {
      if (hasScrolled) return;
      hasScrolled = true;

      const wrapper = this.wrapperRef?.nativeElement;
      wrapper?.classList.add('scroll-jump-active');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
          // חדש - מפעילים את חלון האכיפה מיד אחרי הקפיצה הראשונה,
          // כדי לתפוס ולתקן כל קפיצה מתחרה שתגיע אחרינו.
          this.startEnforcement(el);

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
      setTimeout(performScroll, 1500);
    }
  }

  // חדש - מתחיל "לשמור" על מיקום הגלילה סביב היעד למשך 3 שניות.
  // כל פעם שמתרחש אירוע scroll על הקונטיינר ואנחנו מוצאים את עצמנו
  // רחוק מהיעד (יותר מ-100px), מניחים שמשהו חיצוני "גנב" את הגלילה
  // וקופצים בחזרה אליו. אחרי 3 שניות מפסיקים לאכוף (כדי לא להפריע
  // אם המשתמש עצמו מנסה לגלול ידנית אחרי שהדף כבר התייצב).
  private startEnforcement(target: HTMLElement): void {
    this.enforcementTarget = target;
    this.enforcementDeadline = Date.now() + 3000;

    const wrapper = this.wrapperRef?.nativeElement;
    if (!wrapper) return;

    this.stopEnforcement();

    this.enforcementScrollListener = () => {
      if (Date.now() > this.enforcementDeadline) {
        this.stopEnforcement();
        return;
      }
      if (!this.enforcementTarget) return;

      const targetTop = this.enforcementTarget.offsetTop;
      const currentTop = wrapper.scrollTop;

      if (Math.abs(currentTop - targetTop) > 100) {
        wrapper.scrollTo({ top: targetTop, behavior: 'auto' });
      }
    };

    wrapper.addEventListener('scroll', this.enforcementScrollListener, { passive: true });

    // בדיקה מיידית נוספת גם בלי אירוע scroll, למקרה שהקפיצה
    // המתחרה קורית לפני שה-listener בכלל נרשם.
    setTimeout(() => this.enforcementScrollListener?.(), 100);
    setTimeout(() => this.enforcementScrollListener?.(), 500);
    setTimeout(() => this.enforcementScrollListener?.(), 1000);
    setTimeout(() => this.enforcementScrollListener?.(), 2000);
    setTimeout(() => this.stopEnforcement(), 3100);
  }

  private stopEnforcement(): void {
    const wrapper = this.wrapperRef?.nativeElement;
    if (wrapper && this.enforcementScrollListener) {
      wrapper.removeEventListener('scroll', this.enforcementScrollListener);
    }
    this.enforcementScrollListener = null;
    this.enforcementTarget = null;
  }

  scrollToIndex(index: number): void {
    const target = this.sectionRefs.toArray()[index];
    target?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  hasSequence(event: PlenaryEvent): boolean {
    return !!event.Schedule && event.Schedule.length > 1;
  }
}