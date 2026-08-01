import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-countrycard',
  standalone: true,
  imports: [],
  templateUrl: './countrycard.component.html',
  styleUrl: './countrycard.component.scss'
})
export class CountrycardComponent implements OnInit, OnChanges{

  @Input() years: number[] = [];
  @Input() medals: string[] = [];

  public lineChart!: Chart<"line", string[], number>;
  

  constructor(private router: Router) { }

  ngOnInit() {
    this.buildChart(this.years, this.medals);
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['years'] || changes ['medals']){
      this.lineChart?.destroy();
      this.buildChart(this.years, this.medals);
    }    
  }

  buildChart(years: number[], medals: string[]) {
      const lineChart = new Chart("countryChart", {
        type: 'line',
        data: {
          labels: years,
          datasets: [
            {
              label: "medals",
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
