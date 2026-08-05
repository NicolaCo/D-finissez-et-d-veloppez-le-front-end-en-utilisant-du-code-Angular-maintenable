import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-medal-chart-component',
  standalone: true,
  imports: [],
  templateUrl: './medal-chart-component.component.html',
  styleUrl: './medal-chart-component.component.scss'
})
export class MedalChartComponentComponent implements OnChanges {

  @Input() countries!: string[];
  @Input() sumOfAllMedalsYears!: number[];

  public pieChart!: Chart<'pie', number[], string>;

  constructor(private router: Router) { }
  

  ngOnChanges(): void{
    if(this.countries?.length && this.sumOfAllMedalsYears?.length) {
      this.buildPieChart(this.countries, this.sumOfAllMedalsYears);
    }
  }
  
  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    if(this.pieChart) {
      this.pieChart.data.labels = countries;
      this.pieChart.data.datasets[0].data = sumOfAllMedalsYears;
      this.pieChart.update();
      return;
    }
    
    this.pieChart = new Chart('DashboardPieChart', {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYears,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = this.pieChart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
            if (points.length) {
              const firstPoint = points[0];
              const countryName = this.pieChart.data.labels ? this.pieChart.data.labels[firstPoint.index] : '';
              this.router.navigate(['country', countryName]);
            }
          }
        }
      }
    });
  }
}
