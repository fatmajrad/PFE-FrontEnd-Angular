import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SujetConnaissanceListComponent } from './sujet-connaissance-list.component';

describe('SujetConnaissanceListComponent', () => {
  let component: SujetConnaissanceListComponent;
  let fixture: ComponentFixture<SujetConnaissanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SujetConnaissanceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SujetConnaissanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
