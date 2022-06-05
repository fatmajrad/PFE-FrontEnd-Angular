import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SujetQuestionsListComponent } from './sujet-questions-list.component';

describe('SujetQuestionsListComponent', () => {
  let component: SujetQuestionsListComponent;
  let fixture: ComponentFixture<SujetQuestionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SujetQuestionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SujetQuestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
