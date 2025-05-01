import { Component, OnInit, inject, Renderer2 } from '@angular/core';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarService } from 'app/layouts/sidebar/sidebar.service';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';
import { HeaderComponent } from 'app/layouts/header/header.component';
import { interval } from 'rxjs';

@Component({
  standalone: true,
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  providers: [AppPageTitleStrategy],
  imports: [RouterOutlet, SidebarComponent, FooterComponent, PageRibbonComponent, CommonModule, RouterModule, HeaderComponent],
  styleUrls: ['./main.component.scss'],
})
export default class MainComponent implements OnInit {
  account = inject(AccountService).trackCurrentAccount();
  guestTimeLeft: string | null = null;
  currentRouteIsLandingPage = false;

  public readonly sidebarService = inject(SidebarService);

  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);

  private readonly accountService = inject(AccountService);

  private intervalId: any;

  ngOnInit(): void {
    this.accountService.identity().subscribe(() => {
      this.updateGuestTimeLeft(); // initial call
      this.intervalId = setInterval(() => this.updateGuestTimeLeft(), 1000); // update every second
    });

    // Change background on landing page
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.url.split('?')[0].split('#')[0];

        const landingRoutes = ['/', '/login', '/account/register', '/account/reset/request', '/gdpr-policy'];
        const dashboardRoutes = ['/dashboard'];

        this.currentRouteIsLandingPage = landingRoutes.includes(url);

        if (this.currentRouteIsLandingPage) {
          this.renderer.addClass(document.body, 'landing-bg');
          this.renderer.removeClass(document.body, 'dashboard-bg');
        } else if (dashboardRoutes.includes(url)) {
          this.renderer.addClass(document.body, 'dashboard-bg');
          this.renderer.removeClass(document.body, 'landing-bg');
        } else {
          this.renderer.removeClass(document.body, 'landing-bg');
          this.renderer.removeClass(document.body, 'dashboard-bg');
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  handleGuestSignupClick(): void {
    this.accountService.logout();
    this.router.navigate(['/account/register']);
  }

  get isGuest(): boolean {
    return !!this.account()?.guest;
  }

  private updateGuestTimeLeft(): void {
    const expiry = this.account()?.guestExpiresAt;
    if (!expiry) {
      this.guestTimeLeft = null;
      return;
    }

    const diff = new Date(expiry).getTime() - Date.now();
    if (diff <= 0) {
      this.guestTimeLeft = 'Session expired';
    } else {
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      this.guestTimeLeft = `${mins}m ${secs}s left`;
    }
  }
}
