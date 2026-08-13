import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { Participation } from 'src/app/models/olympic.model';


@Component({
  selector: 'app-countrycard',
  standalone: true,
  imports: [],
  templateUrl: './countrycard.component.html',
  styleUrl: './countrycard.component.scss'
})
export class CountrycardComponent implements OnChanges{

  @Input() participations: Participation[] = [];

  public lineChart!: Chart<'bar', number[]>;

  ngOnChanges(changes: SimpleChanges){
    if(changes['participations']){
      this.lineChart?.destroy();
      this.buildChart(this.participations);
    }
  }

  buildChart(participations: Participation[]) {
      const lineChart = new Chart('countryChart', {
        type: 'bar',
        data: {
          labels: this.selectYears(participations),
          datasets: [
            {
              label: 'Total',
              data: this.selectMedalsCount(participations),
              backgroundColor: '#0b868f',
              borderColor: '#0b868f'
            },
            {
              label: 'Gold',
              data: this.selectGold(participations),
              backgroundColor: '#ffd700',
              borderColor: '#ffd700'
            },
            {
              label: 'Silver',
              data: this.selectSilver(participations),
              backgroundColor: '#c0c0c0',
              borderColor: '#c0c0c0'
            },
            {
              label: 'Bronze',
              data: this.selectBronze(participations),
              backgroundColor: '#8c7853',
              borderColor: '#8c7853'
            },
          ]
        },
        options: {
          aspectRatio: this.getLineAspectRatio()
        }
      });
      this.lineChart = lineChart;
  }

  private selectYears(participations: Participation[]): number[]{
    return participations.map((i: Participation) => i.year);
  }

  private selectMedalsCount(participations: Participation[]): number[]{
    return participations.map((i: Participation) => i.medalsCount);
  }

  private selectBronze(participations: Participation[]): number[]{
    return participations.map((i: Participation) => i.medalsDetails.bronze);
  }

  private selectSilver(participations: Participation[]): number[]{
    return participations.map((i: Participation) => i.medalsDetails.silver);
  }

  private selectGold(participations: Participation[]): number[]{
    return participations.map((i: Participation) => i.medalsDetails.gold);
  }

  private getLineAspectRatio(): number {
    return typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 2.5;
  }
  
}
