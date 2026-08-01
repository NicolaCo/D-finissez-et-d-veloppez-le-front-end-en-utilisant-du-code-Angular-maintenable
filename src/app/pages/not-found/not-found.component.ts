import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, HeaderComponent],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  public display: string = 'Country not found';

  constructor() { }

}
