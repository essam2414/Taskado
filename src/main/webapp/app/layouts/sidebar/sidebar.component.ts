import { Component, OnInit, inject, HostListener, Signal, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import SharedModule from 'app/shared/shared.module';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-sidebar',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, NgbDropdownModule, HasAnyAuthorityDirective, CommonModule, SharedModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  inProduction?: boolean;
  openAPIEnabled?: boolean;
  account = inject(AccountService).trackCurrentAccount();
  accountDropdownOpen = false;
  avatarColor = '#ccc';

  private readonly sidebarService = inject(SidebarService);
  private readonly loginService = inject(LoginService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    if (this.account()?.login) {
      this.avatarColor = this.getAvatarColor(this.account()?.login ?? '');
    }
  }

  isCollapsed(): boolean {
    return this.sidebarService.isCollapsed();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  toggleAccountDropdown(): void {
    this.accountDropdownOpen = !this.accountDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    const dropdownElement = document.querySelector('.sidebar-account');
    if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
      this.accountDropdownOpen = false;
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }

  /** Extracts First Letter from Username */
  getInitial(username?: string): string {
    return username ? username.charAt(0).toUpperCase() : '?';
  }

  /** Generates a Consistent Avatar Color */
  getAvatarColor(username: string): string {
    const colors = ['#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D', '#43AA8B', '#577590'];

    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = (hash * 31 + username.charCodeAt(i)) % colors.length;
    }

    return colors[hash];
  }
}
