import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router, RouterLink} from '@angular/router';
import { CountrycardComponent } from 'src/app/components/countrycard/countrycard.component';
import { HeaderComponent, Indicator } from 'src/app/components/header/header.component';
import { Olympic, Participation } from 'src/app/models/olympic.model';
import { DataService } from 'src/app/services/data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-country',
  standalone: true,
  imports: [HeaderComponent, CountrycardComponent, RouterLink],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})

export class CountryComponent implements OnInit {

  public countryName: string = '';

  public indicators: Indicator[] = [];

  public countryParticipations: Participation[] = [];

  public years: number[] = [];

  public medals: string[] = [];


  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.readCountryFromParam();
    this.dataService.loadOlympics().pipe(takeUntilDestroyed()).subscribe(data => {
      const olympicCountry = data.find((i: Olympic) => i.country === this.countryName);
      if (!olympicCountry) {
        this.router.navigate(['/not-found']);
        return;
      }
      this.countryParticipations = olympicCountry.participations;
      this.years = this.selectYears()
      this.medals = this.selectMedals()
      this.indicators.push({ label: "Number of entries", value: this.calculateNumberOfEntries()})
      this.indicators.push({ label: "Total number medals", value: this.calculateTotalNumberOfMedals()})
      this.indicators.push({ label: "Total number of athletes", value: this.calculateTotalNumberOfAthletes()})
    });    
  }

  readCountryFromParam(): void{
    let countryName: string | null = null;
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((param: ParamMap) => countryName = param.get('countryName'));
    this.countryName = countryName ? countryName : '';
  }

  selectYears(): number[]{
    return this.countryParticipations.map((i: Participation) => i.year) ?? [];
  }

  selectMedals(): string[]{
    return this.countryParticipations.map((i: Participation) => i.medalsCount.toString()) ?? [];
  }

  calculateNumberOfEntries(): number{
    const participations = this.countryParticipations.map((i: Participation) => i);
    return participations?.length ?? 0;
  }

  calculateTotalNumberOfMedals(): number {
    const totalMedals = this.countryParticipations.map((i: Participation) => i.medalsCount.toString()) ?? [];
    return totalMedals.reduce((accumulator: number, item: string) => accumulator + parseInt(item), 0);
  }

  calculateTotalNumberOfAthletes(): number {
    const nbAthletes: string[] = this.countryParticipations.map((i: Participation) => i.athleteCount.toString()) ?? []
    return nbAthletes.reduce((accumulator: number, item: string) => accumulator + parseInt(item), 0);
  }

}
