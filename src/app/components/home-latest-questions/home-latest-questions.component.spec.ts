import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLatestQuestionsComponent } from './home-latest-questions.component';

describe('HomeLatestQuestionsComponent', () => {
  let component: HomeLatestQuestionsComponent;
  let fixture: ComponentFixture<HomeLatestQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeLatestQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLatestQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
