import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent, Indicator } from '../../components/header/header.component';
import { MedalChartComponentComponent } from '../../components/medal-chart-component/medal-chart-component.component';
import { DataService } from 'src/app/services/data.service';
import { Olympic, Participation } from 'src/app/models/olympic.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, MedalChartComponentComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  public titlePage: string = "Medals per Country";

  public indicators: Indicator[] = [];
  
  public datas!: Olympic[];

  public countries: string[] = [];

  public sumOfAllMedalsYears: number[] = [];

  

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void{
    this.dataService.loadOlympics().pipe(takeUntilDestroyed()).subscribe(data => {
      this.datas = data
      this.countries = this.extractCountries();
      this.sumOfAllMedalsYears = this.extractSumOfAllMedalsYears();
      this.indicators.push({ label :"Number of countries", value: this.countries.length});
      this.indicators.push({ label:"Number of JOs", value: this.calculateTotalJOs() });
    });
  } 

  calculateTotalJOs(): number {
    const years = this.datas.flatMap((i: Olympic) => i.participations.map((f: Participation) => f.year));
    return new Set(years).size;
  }

  extractCountries(): string[] {
    return this.datas.map((i: Olympic) => i.country);
  }

  extractSumOfAllMedalsYears() {
    return this.datas.map((olympic: Olympic) => olympic.participations
      .map((participation: Participation) => (participation.medalsCount)))
      .map((i: number[]) => i.reduce((acc: number, i: number) => acc + i, 0));
  }

}

