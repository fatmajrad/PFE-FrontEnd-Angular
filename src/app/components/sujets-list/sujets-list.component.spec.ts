import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SujetsListComponent } from './sujets-list.component';

describe('SujetsListComponent', () => {
  let component: SujetsListComponent;
  let fixture: ComponentFixture<SujetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SujetsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SujetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
