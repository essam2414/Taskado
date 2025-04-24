import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  imports: [RouterOutlet],
  styleUrls: ['./footer.component.scss'],
})
export default class FooterComponent {}
