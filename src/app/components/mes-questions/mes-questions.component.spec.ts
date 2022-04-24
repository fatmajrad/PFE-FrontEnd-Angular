import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesQuestionsComponent } from './mes-questions.component';

describe('MesQuestionsComponent', () => {
  let component: MesQuestionsComponent;
  let fixture: ComponentFixture<MesQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
