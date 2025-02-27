import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from 'app/layouts/header/header.component';

@Component({
  selector: 'jhi-landing-page',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, HeaderComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export default class LandingPageComponent {
  private readonly router = inject(Router);

  login(): void {
    this.router.navigate(['/login']);
  }
}
