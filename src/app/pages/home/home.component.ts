import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent, Indicator } from '../../components/header/header.component';
import { MedalChartComponent } from '../../components/medal-chart/medal-chart.component';
import { DataService } from 'src/app/services/data.service';
import { Olympic, Participation } from 'src/app/models/olympic.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, MedalChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  public titlePage: string = 'Medals per Country';

  public error: string | null = null;

  public indicators: Indicator[] = [];
  
  public datas!: Olympic[];

  constructor( private router: Router, private dataService: DataService) {}

  ngOnInit(): void{
    this.dataService.loadOlympics().subscribe(result => {
      if (result.kind === 'success') {
        this.datas = result.data;
        this.indicators.push({ label :'Number of countries', value: this.countCountries()});
        this.indicators.push({ label:'Number of JOs', value: this.calculateTotalJOs() });
      } else {
        this.router.navigate(['/missing-data']);
      }
    });
  }

  calculateTotalJOs(): number {
    const years = this.datas.flatMap((i: Olympic) => i.participations.map((f: Participation) => f.year));
    return new Set(years).size;
  }

  countCountries(): number {
    return this.datas.length;
  }
 

}

