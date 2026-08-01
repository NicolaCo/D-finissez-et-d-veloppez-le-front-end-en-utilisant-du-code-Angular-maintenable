import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedalChartComponentComponent } from './medal-chart-component.component';

describe('MedalChartComponentComponent', () => {
  let component: MedalChartComponentComponent;
  let fixture: ComponentFixture<MedalChartComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedalChartComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedalChartComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
