import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
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

  // כל snap-section בעמוד (המבוא + section לכל אירוע) - רשימה חיה שמתעדכנת
  // אוטומטית ברגע שהאירועים מגיעים מה-API ו-ngFor מרנדר את ה-DOM
  @ViewChildren('snapSection') sectionRefs!: QueryList<ElementRef<HTMLElement>>;

  private observer: IntersectionObserver | null = null;

  constructor(private plenaryEventsService: PlenaryEventsService) { }

  ngOnInit(): void {
    this.plenaryEventsService.getAll().subscribe({
      next: (data) => this.events = data,
      error: (err) => console.error('Failed to load plenary events:', err)
    });
  }

  ngAfterViewInit(): void {
    // מרכיבים מחדש את ה-observer בכל פעם שרשימת ה-sections משתנה
    // (כלומר גם ברגע שהאירועים מגיעים מה-API אחרי הטעינה הראשונית)
    this.sectionRefs.changes.subscribe(() => this.setupObserver());
    this.setupObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
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

  scrollToIndex(index: number): void {
    const target = this.sectionRefs.toArray()[index];
    target?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  hasSequence(event: PlenaryEvent): boolean {
    return !!event.Schedule && event.Schedule.length > 1;
  }
}