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

  // תמיכה בקישור ישיר לאירוע ספציפי (deep link, #id=<eventId>).
  // בטעינה הראשונית קוראים מ-window.__initialUrlHash שנתפס
  // ב-index.html (לפני שAngular עלה, כדי לעקוף באג של Angular
  // Router שמוחק fragment בניווט ראשוני מקונן). אחרי הטעינה
  // הראשונית, מאזינים לאירוע hashchange כדי שגם שינוי כתובת בתוך
  // אותו טאב (בלי רענון מלא) יגרום לקפיצה מחדש.
  private pendingFragment: string | null = null;
  private hasScrolledToCurrentFragment = false;
  private hashChangeListener = () => this.onHashChanged();

  // חדש - true בזמן שאנחנו עצמנו מבצעים קפיצה פרוגרמטית ליעד
  // (deep link / לחיצה על נקודה). בזמן הזה אסור ל-IntersectionObserver
  // "לדרוס" את ה-URL עם ה-section הביניים שדרכו אנחנו עוברים תוך
  // כדי הגלילה עצמה - אחרת ה-URL "יפרפר" בין ערכים לא נכונים לרגע
  // לפני שהוא מתייצב על היעד האמיתי.
  private isProgrammaticScroll = false;

  constructor(private plenaryEventsService: PlenaryEventsService) { }

  ngOnInit(): void {
    const capturedHash = (window as any).__initialUrlHash as string | undefined;
    const rawHash = capturedHash || window.location.hash;

    if (rawHash && rawHash.length > 1) {
      this.pendingFragment = this.extractEventId(rawHash.substring(1));
    }

    window.addEventListener('hashchange', this.hashChangeListener);

    this.plenaryEventsService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        this.tryScrollToFragment();
      },
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
    window.removeEventListener('hashchange', this.hashChangeListener);
  }

  private onHashChanged(): void {
    const rawHash = window.location.hash;
    const newFragment = rawHash && rawHash.length > 1
      ? this.extractEventId(rawHash.substring(1))
      : null;

    if (!newFragment || newFragment === this.pendingFragment) return;

    this.pendingFragment = newFragment;
    this.hasScrolledToCurrentFragment = false;
    this.tryScrollToFragment();
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
          if (index !== -1) {
            this.activeIndex = index;
            // חדש - מעדכנים את ה-URL בכל פעם שה-section הנראה
            // משתנה בגלילה, כדי שקישור שמועתק תמיד ישקף בדיוק את מה
            // שרואים כרגע - לא רק כשלוחצים על נקודה או קישור חיצוני.
            if (!this.isProgrammaticScroll) {
              this.updateUrlForVisibleSection(visible.target as HTMLElement);
            }
          }
        }
      },
      { threshold: [0.5] }
    );

    this.sectionRefs.forEach(ref => this.observer!.observe(ref.nativeElement));
  }

  // מעדכן את שורת הכתובת ל-#id=<section.id> בלי לגרום לניווט
  // אמיתי, בלי ליצור רשומת היסטוריה חדשה (history.replaceState,
  // לא pushState) ובלי להפעיל hashchange (שאם היה קורה, היה גורם
  // ל-onHashChanged לנסות לגלול מחדש למקום שכבר נמצאים בו - לולאה
  // מיותרת). ה-Intro מיוחד: מסירים את ה-fragment לגמרי (כתובת
  // נקייה), כי "#id=intro" הוא deep link פחות שימושי.
  private updateUrlForVisibleSection(sectionEl: HTMLElement): void {
    const sectionId = sectionEl.id;
    if (!sectionId) return;

    const newHash = sectionId === 'intro' ? '' : `#id=${sectionId}`;
    const newUrl = window.location.pathname + window.location.search + newHash;

    if (newUrl !== window.location.pathname + window.location.search + window.location.hash) {
      history.replaceState(null, '', newUrl);
    }
  }

  private extractEventId(fragment: string | null): string | null {
    if (!fragment) return null;
    const match = fragment.match(/^id=(.+)$/);
    return match ? match[1] : fragment;
  }

  private tryScrollToFragment(): void {
    if (!this.pendingFragment || this.hasScrolledToCurrentFragment) return;
    if (!this.sectionRefs || this.sectionRefs.length === 0) return;

    const target = this.sectionRefs.toArray()
      .find(ref => ref.nativeElement.id === this.pendingFragment);

    if (target) {
      this.hasScrolledToCurrentFragment = true;
      this.waitForStableLayoutThenScroll(target.nativeElement);
    }
  }

  private waitForStableLayoutThenScroll(el: HTMLElement): void {
    let hasScrolled = false;

    const performScroll = () => {
      if (hasScrolled) return;
      hasScrolled = true;

      this.isProgrammaticScroll = true;

      const wrapper = this.wrapperRef?.nativeElement;
      wrapper?.classList.add('scroll-jump-active');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });

          setTimeout(() => {
            wrapper?.classList.remove('scroll-jump-active');
            this.isProgrammaticScroll = false;
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

  scrollToIndex(index: number): void {
    const target = this.sectionRefs.toArray()[index];
    if (!target) return;

    this.isProgrammaticScroll = true;
    target.nativeElement.scrollIntoView({ behavior: 'smooth' });

    // חדש - גלילה עם behavior: 'smooth' לוקחת זמן (לא מיידית כמו
    // 'auto'), אז מחכים קצת יותר לפני שמפסיקים לחסום את ה-Observer,
    // אחרת ה-URL יתעדכן עם section-ביניים תוך כדי האנימציה עצמה.
    setTimeout(() => {
      this.isProgrammaticScroll = false;
      this.updateUrlForVisibleSection(target.nativeElement);
    }, 700);
  }

  hasSequence(event: PlenaryEvent): boolean {
    return !!event.Schedule && event.Schedule.length > 1;
  }
}