import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-sidebar',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, NgbDropdownModule, HasAnyAuthorityDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  inProduction?: boolean;
  openAPIEnabled?: boolean;
  account = inject(AccountService).trackCurrentAccount();

  private readonly sidebarService = inject(SidebarService);
  private readonly loginService = inject(LoginService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });
  }

  isCollapsed(): boolean {
    return this.sidebarService.isCollapsed();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }
}
