import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnaissancesListComponent } from './connaissances-list.component';

describe('ConnaissancesListComponent', () => {
  let component: ConnaissancesListComponent;
  let fixture: ComponentFixture<ConnaissancesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnaissancesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnaissancesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
