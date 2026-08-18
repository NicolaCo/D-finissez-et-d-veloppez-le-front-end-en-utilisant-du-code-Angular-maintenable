import { Component, Input } from '@angular/core';

export interface Indicator {
  label: string;
  value: number;
}

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html'
})


export class HeaderComponent {
  @Input() titlePage = '';
  @Input() items: Indicator[] = [];
}
