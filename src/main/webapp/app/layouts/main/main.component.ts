import { Component, OnInit, inject, Renderer2, computed } from '@angular/core';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarService } from 'app/layouts/sidebar/sidebar.service';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';
import { HeaderComponent } from 'app/layouts/header/header.component';

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

  public readonly sidebarService = inject(SidebarService);

  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);

  private readonly accountService = inject(AccountService);

  ngOnInit(): void {
    this.accountService.identity().subscribe();

    // Change background on landing page
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.url.split('?')[0].split('#')[0];

        const landingRoutes = ['/', '/login', '/account/register', '/account/reset/request'];
        const dashboardRoutes = ['/dashboard'];

        if (landingRoutes.includes(url)) {
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

  get guestSessionTimeLeft(): string | null {
    const expiry = this.account()?.guestExpiresAt;
    if (!expiry) return null;

    const diff = new Date(expiry).getTime() - Date.now();

    if (diff <= 0) return 'Session expired';

    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s left`;
  }
}
