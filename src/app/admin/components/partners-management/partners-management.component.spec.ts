import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersManagementComponent } from './partners-management.component';

describe('PartnersManagementComponent', () => {
  let component: PartnersManagementComponent;
  let fixture: ComponentFixture<PartnersManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnersManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
