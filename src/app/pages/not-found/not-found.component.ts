import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, HeaderComponent],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit{

  public title: string = 'Error 404';
  public display: string = 'Not found.';

  constructor(private route: ActivatedRoute,) {

   }

  ngOnInit(): void {
    this.readCountryIdFromParam();
  }

   private readCountryIdFromParam(): void{
    let path: string = this.route.snapshot.url.toString();
    this.display = this.selectDisplayFromPath(path);
  }

  private selectDisplayFromPath(path: string): string {
    switch(path) {
      case "country-not-found":
        return 'Country not found !';
      case "missing-data":
        return 'Data not found !';
      default:
        return 'This page doesn\'t exists !';
    }
  }

}

