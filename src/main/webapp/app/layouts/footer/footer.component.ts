import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  imports: [RouterOutlet, RouterModule],
  styleUrls: ['./footer.component.scss'],
})
export default class FooterComponent {}
