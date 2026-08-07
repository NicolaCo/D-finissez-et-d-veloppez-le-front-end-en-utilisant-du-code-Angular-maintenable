import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MedalChartComponent } from './medal-chart.component';

describe('MedalChartComponentComponent', () => {
  let component: MedalChartComponent;
  let fixture: ComponentFixture<MedalChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedalChartComponent],
      providers: [ provideRouter([]), provideHttpClient() ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
