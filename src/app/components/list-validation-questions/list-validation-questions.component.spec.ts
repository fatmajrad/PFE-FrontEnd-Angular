import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValidationQuestionsComponent } from './list-validation-questions.component';

describe('ListValidationQuestionsComponent', () => {
  let component: ListValidationQuestionsComponent;
  let fixture: ComponentFixture<ListValidationQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListValidationQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListValidationQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
