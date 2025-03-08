import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from 'app/layouts/header/header.component';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-landing-page',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, HeaderComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export default class LandingPageComponent {
  private readonly router = inject(Router);
  private accountService = inject(AccountService);

  login(): void {
    this.router.navigate(['/login']);
  }

  continueAsGuest(): void {
    this.accountService.enableGuestMode();
    this.router.navigate(['/dashboard']);
  }
}
