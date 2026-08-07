import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-countrycard',
  standalone: true,
  imports: [],
  templateUrl: './countrycard.component.html',
  styleUrl: './countrycard.component.scss'
})
export class CountrycardComponent implements OnChanges{

  @Input() years: number[] = [];
  @Input() medals: number[] = [];

  public lineChart!: Chart<'line', number[], number>;

  ngOnChanges(changes: SimpleChanges){
    if(changes['years'] || changes ['medals']){
      this.lineChart?.destroy();
      this.buildChart(this.years, this.medals);
    }    
  }

  buildChart(years: number[], medals: number[]) {
      const lineChart = new Chart('countryChart', {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            {
              label: 'medals',
              data: medals,
              backgroundColor: '#0b868f'
            },
          ]
        },
        options: {
          aspectRatio: 2.5
        }
      });
      this.lineChart = lineChart;
  }
  
}
