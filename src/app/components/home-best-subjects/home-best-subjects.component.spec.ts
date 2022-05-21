import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBestSubjectsComponent } from './home-best-subjects.component';

describe('HomeBestSubjectsComponent', () => {
  let component: HomeBestSubjectsComponent;
  let fixture: ComponentFixture<HomeBestSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeBestSubjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBestSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
