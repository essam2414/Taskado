import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VERSION } from 'app/app.constants';

@Component({
  selector: 'jhi-landing-page',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export default class LandingPageComponent {
  version = '';

  private readonly router = inject(Router);

  constructor() {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }
}
