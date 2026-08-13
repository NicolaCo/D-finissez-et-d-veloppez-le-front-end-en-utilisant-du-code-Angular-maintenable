import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CountrycardComponent } from 'src/app/components/countrycard/countrycard.component';
import { HeaderComponent, Indicator } from 'src/app/components/header/header.component';
import { Participation } from 'src/app/models/olympic.model';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-country',
  standalone: true,
  imports: [HeaderComponent, CountrycardComponent, RouterLink],
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})

export class CountryComponent implements OnInit {

  public countryName: string = '';
  public countryId: number = -1;

  public error: string | null = null;

  public indicators: Indicator[] = [];

  public countryParticipations: Participation[] = [];

  public years: number[] = [];

  public medals: number[] = [];


  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.readCountryIdFromParam();
    this.dataService.loadOlympicsById(this.countryId).subscribe(
      result => {
        if(result.kind === 'success') {
          const data = result.data
          this.countryParticipations = data.participations
          this.countryName = data.country
          this.years = this.selectYears()
          this.medals = this.selectMedals()
          this.indicators.push({ label: 'Number of entries', value: this.calculateNumberOfEntries()})
          this.indicators.push({ label: 'Total number medals', value: this.calculateTotalNumberOfMedals()})
          this.indicators.push({ label: 'Total number of athletes', value: this.calculateTotalNumberOfAthletes()})
        } else if (result.kind === 'not-found') {
          this.router.navigate(['/country-not-found']);
        } else {
          this.error = result.message
        }
      });
  }

  private readCountryIdFromParam(): void{
    const countryId: number = Number(this.route.snapshot.params['id']);
    if ( Number.isNaN(countryId) ) {
      this.router.navigate(['/not-found']);
      return;
    }
    this.countryId = countryId ;
  }

  private selectYears(): number[]{
    return this.countryParticipations.map((i: Participation) => i.year);
  }

  private selectMedals(): number[]{
    return this.countryParticipations.map((i: Participation) => i.medalsCount);
  }

  private calculateNumberOfEntries(): number{
    return this.countryParticipations.length;
  }

  private calculateTotalNumberOfMedals(): number {
    return this.countryParticipations.reduce((acc: number, i: Participation) => acc + i.medalsCount, 0 );
  }

  private calculateTotalNumberOfAthletes(): number {
    return this.countryParticipations.reduce((acc: number, i:Participation) => acc + i.athleteCount, 0);
  }

}
