import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishQuestionComponent } from './publish-question.component';

describe('PublishQuestionComponent', () => {
  let component: PublishQuestionComponent;
  let fixture: ComponentFixture<PublishQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
