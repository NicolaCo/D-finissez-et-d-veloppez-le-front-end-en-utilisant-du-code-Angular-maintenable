import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic, Participation } from 'src/app/models/olympic.model';


export type Ingredients = { countryId: number, countryName: string, sumOfAllMedalsYears: number };


@Component({
  selector: 'app-medal-chart-component',
  standalone: true,
  imports: [],
  templateUrl: './medal-chart.component.html',
  styleUrl: './medal-chart.component.scss'
})
export class MedalChartComponent implements OnChanges {

  @Input() olympics!: Olympic[];

  public sumOfAllMedalsYearsByCountry!: Ingredients[];

  public pieChart!: Chart<'pie', number[], string>;

  public chartDescription: string = '';

  constructor(private router: Router) { }


  ngOnChanges(): void {
    if (this.olympics?.length) {
      this.olympics = reoderOlympicsByName(this.olympics);
      this.extractSumOfAllMedalsYears();
    }
    if (this.sumOfAllMedalsYearsByCountry?.length) {
      this.buildPieChart(this.sumOfAllMedalsYearsByCountry);
    }
  }


  extractSumOfAllMedalsYears() {
    this.sumOfAllMedalsYearsByCountry = [];
    this.olympics.forEach((olympic: Olympic) => {
      this.sumOfAllMedalsYearsByCountry.push({
        countryId: olympic.id,
        countryName: olympic.country,
        sumOfAllMedalsYears: olympic.participations.reduce(
          (acc: number, participation: Participation) => acc + participation.medalsCount, 0)
      });
    });
    this.chartDescription = this.createDescription();
  }

  buildPieChart(sumOfAllMedalsYearsByCountry: Ingredients[]) {
    if (this.pieChart) {
      this.pieChart.data.labels = sumOfAllMedalsYearsByCountry.map(country => country.countryName);
      this.pieChart.data.datasets[0].data = sumOfAllMedalsYearsByCountry.map(country => country.sumOfAllMedalsYears);
      this.pieChart.update();
      return;
    }

    this.pieChart = new Chart('DashboardPieChart', {
      type: 'pie',
      data: {
        labels: sumOfAllMedalsYearsByCountry.map(row => row.countryName),
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYearsByCountry.map(row => row.sumOfAllMedalsYears),
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: this.getPieAspectRatio(),
        onClick: (e) => {
          if (e.native) {
            const points = this.pieChart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
            if (points.length) {
              const firstPoint = points[0];
              const countryIds = sumOfAllMedalsYearsByCountry.map(row => row.countryId);
              this.router.navigate(['country', countryIds[firstPoint.index]]);
            }
          }
        }
      }
    });
  }

  private createDescription() {
    return 'Total medals won per country. ' +
      this.sumOfAllMedalsYearsByCountry
        .map((country) => `${country.countryName}: ${country.sumOfAllMedalsYears}`)
        .join(', ') + '.';
  }

  private getPieAspectRatio(): number {
    return typeof window !== 'undefined' && window.innerWidth < 768 ? 1.2 : 2.5;
  }

}
function reoderOlympicsByName(olympics: Olympic[]): Olympic[] {
  return olympics.sort((a, b) => String(a.country).localeCompare(b.country));
}

