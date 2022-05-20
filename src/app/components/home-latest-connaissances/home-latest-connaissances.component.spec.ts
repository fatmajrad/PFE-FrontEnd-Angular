import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLatestConnaissancesComponent } from './home-latest-connaissances.component';

describe('HomeLatestConnaissancesComponent', () => {
  let component: HomeLatestConnaissancesComponent;
  let fixture: ComponentFixture<HomeLatestConnaissancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeLatestConnaissancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLatestConnaissancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
