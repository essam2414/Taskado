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

  sidebarItems = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      iconPath:
        'M22,5.724V2c0-.552-.447-1-1-1s-1,.448-1,1v2.366L14.797,.855c-1.699-1.146-3.895-1.146-5.594,0L2.203,5.579c-1.379,.931-2.203,2.48-2.203,4.145v9.276c0,2.757,2.243,5,5,5h3c.553,0,1-.448,1-1V15c0-.551,.448-1,1-1h4c.552,0,1,.449,1,1v8c0,.552,.447,1,1,1h3c2.757,0,5-2.243,5-5V9.724c0-1.581-.744-3.058-2-4Zm0,13.276c0,1.654-1.346,3-3,3h-2v-7c0-1.654-1.346-3-3-3h-4c-1.654,0-3,1.346-3,3v7h-2c-1.654,0-3-1.346-3-3V9.724c0-.999,.494-1.929,1.322-2.487L10.322,2.513c1.02-.688,2.336-.688,3.355,0l7,4.724c.828,.558,1.322,1.488,1.322,2.487v9.276Z',
      iconViewBox: '0 0 24 24',
    },
    {
      label: 'Tasks',
      route: '/task',
      iconPath:
        'm4 6a2.982 2.982 0 0 1 -2.122-.879l-1.544-1.374a1 1 0 0 1 1.332-1.494l1.585 1.414a1 1 0 0 0 1.456.04l3.604-3.431a1 1 0 0 1 1.378 1.448l-3.589 3.414a2.964 2.964 0 0 1 -2.1.862zm20-2a1 1 0 0 0 -1-1h-10a1 1 0 0 0 0 2h10a1 1 0 0 0 1-1zm-17.9 9.138 3.589-3.414a1 1 0 1 0 -1.378-1.448l-3.6 3.431a1.023 1.023 0 0 1 -1.414 0l-1.59-1.585a1 1 0 0 0 -1.414 1.414l1.585 1.585a3 3 0 0 0 4.226.017zm17.9-1.138a1 1 0 0 0 -1-1h-10a1 1 0 0 0 0 2h10a1 1 0 0 0 1-1zm-17.9 9.138 3.585-3.414a1 1 0 1 0 -1.378-1.448l-3.6 3.431a1 1 0 0 1 -1.456-.04l-1.585-1.414a1 1 0 0 0 -1.332 1.494l1.544 1.374a3 3 0 0 0 4.226.017zm17.9-1.138a1 1 0 0 0 -1-1h-10a1 1 0 0 0 0 2h10a1 1 0 0 0 1-1z',
      iconViewBox: '0 0 24 24',
    },
    {
      label: 'Habits',
      route: '/habit',
      iconPath:
        'm18.214,9.098c.387.394.381,1.027-.014,1.414l-4.426,4.345c-.783.768-1.791,1.151-2.8,1.151-.998,0-1.996-.376-2.776-1.129l-1.899-1.867c-.394-.387-.399-1.02-.012-1.414.386-.395,1.021-.4,1.414-.012l1.893,1.861c.776.75,2.001.746,2.781-.018l4.425-4.344c.393-.388,1.024-.381,1.414.013Zm5.786,2.902c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z',
      iconViewBox: '0 0 24 24',
    },
    {
      label: 'Calendar',
      route: '/event',
      iconPath:
        'M19,2H18V1a1,1,0,0,0-2,0V2H8V1A1,1,0,0,0,6,1V2H5A5.006,5.006,0,0,0,0,7V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V7A5.006,5.006,0,0,0,19,2ZM2,7A3,3,0,0,1,5,4H19a3,3,0,0,1,3,3V8H2ZM19,22H5a3,3,0,0,1-3-3V10H22v9A3,3,0,0,1,19,22Z',
      iconViewBox: '0 0 24 24',
    },
    {
      label: 'Notes',
      route: '/note',
      iconPath:
        'M18,0H8c-2.05,0-3.81,1.24-4.58,3h-1.42c-.55,0-1,.45-1,1s.45,1,1,1h1v2h-1c-.55,0-1,.45-1,1s.45,1,1,1h1v2h-1c-.55,0-1,.45-1,1s.45,1,1,1h1v2h-1c-.55,0-1,.45-1,1s.45,1,1,1h1v2h-1c-.55,0-1,.45-1,1s.45,1,1,1h1.42c.77,1.76,2.54,3,4.58,3h10c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM5,19V5c0-1.65,1.35-3,3-3V22c-1.65,0-3-1.35-3-3Zm16,0c0,1.65-1.35,3-3,3H10V2h8c1.65,0,3,1.35,3,3v14Z',
      iconViewBox: '0 0 24 24',
    },
    {
      label: 'Focus Timer',
      route: '/pomodoro-session',
      iconPath:
        'm15.999,15.5c-.188,0-.379-.053-.548-.164l-4-2.628c-.281-.186-.451-.499-.451-.836v-4.872c0-.553.447-1,1-1s1,.447,1,1v4.333l3.549,2.331c.462.304.59.924.287,1.385-.192.293-.512.451-.837.451Zm-3.285,6.475c-.236.017-.474.025-.714.025-5.514,0-10-4.486-10-10S6.486,2,12,2c3.151,0,6.112,1.512,7.988,4h-2.988c-.553,0-1,.447-1,1s.447,1,1,1h4c1.103,0,2-.897,2-2V2c0-.553-.447-1-1-1s-1,.447-1,1v2.104C18.743,1.543,15.473,0,12,0,5.383,0,0,5.383,0,12s5.383,12,12,12c.288,0,.573-.011.856-.031.551-.039.966-.518.926-1.068-.039-.55-.512-.975-1.068-.926Zm10.286-10.975c-.553,0-1,.447-1,1,0,.455-.031.913-.092,1.36-.074.548.31,1.052.856,1.126.046.006.091.009.136.009.493,0,.922-.364.99-.865.072-.536.109-1.085.109-1.63,0-.553-.447-1-1-1Zm-.863,5.396c-.484-.268-1.093-.088-1.357.396-.217.396-.464.782-.735,1.148-.328.444-.233,1.07.21,1.399.18.132.388.195.594.195.307,0,.609-.141.806-.405.323-.439.62-.902.88-1.377.266-.484.088-1.092-.396-1.357Zm-4.731,4.02c-.383.246-.783.467-1.191.656-.501.233-.719.827-.486,1.328.17.365.53.579.908.579.141,0,.284-.029.42-.093.491-.229.973-.493,1.432-.789.465-.299.599-.917.3-1.382-.299-.463-.918-.597-1.382-.3Z',
      iconViewBox: '0 0 24 24',
    },
    {
      label: 'Productivity Insights',
      route: '/productivity-report',
      iconPath:
        'M24,23c0,.552-.448,1-1,1H3c-1.654,0-3-1.346-3-3V1C0,.448,.448,0,1,0s1,.448,1,1V21c0,.551,.449,1,1,1H23c.552,0,1,.448,1,1Zm-3-18h-4c-.552,0-1,.448-1,1s.448,1,1,1h3.563l-4.857,4.707c-.377,.378-1.036,.378-1.413,0-.041-.04-1.239-.893-1.239-.893-1.138-1.073-3.077-1.033-4.162,.051l-4.586,4.414c-.398,.383-.41,1.016-.027,1.414,.197,.204,.458,.307,.721,.307,.25,0,.5-.093,.693-.279l4.6-4.428c.377-.378,1.036-.378,1.413,0,.041,.04,1.239,.893,1.239,.893,1.139,1.074,3.076,1.036,4.164-.054l4.89-4.74v3.607c0,.552,.448,1,1,1s1-.448,1-1v-4c0-1.654-1.346-3-3-3Z',
      iconViewBox: '0 0 24 24',
    },
    {
      label: 'Reminders',
      route: '/reminder',
      iconPath:
        'm20.859 15.331-3.772 6.155a5.235 5.235 0 0 1 -3.87 2.477 5.315 5.315 0 0 1 -.628.037 5.212 5.212 0 0 1 -3-.955 4.741 4.741 0 0 1 -6.689-6.566l-1.315-1.313a5.264 5.264 0 0 1 .955-8.2l5.767-3.566a8.859 8.859 0 0 1 10.327.551l1.659-1.659a1 1 0 1 1 1.414 1.414l-1.657 1.658a8.951 8.951 0 0 1 .809 9.967zm-12.794 6.316-3.719-3.72a2.721 2.721 0 0 0 .463 3.264 2.827 2.827 0 0 0 3.256.456zm9.921-15.6a6.887 6.887 0 0 0 -8.617-.947l-5.777 3.566a3.265 3.265 0 0 0 -.592 5.086l7.29 7.291a3.265 3.265 0 0 0 5.093-.6l3.755-6.125a6.937 6.937 0 0 0 -1.152-8.276zm1.279 17.953a1 1 0 0 1 -.591-1.808 8.633 8.633 0 0 0 3.315-5.407 1 1 0 1 1 1.953.43 10.7 10.7 0 0 1 -4.088 6.593 1 1 0 0 1 -.589.192zm-18.265-18.261a1 1 0 0 1 -.8-1.594 10.692 10.692 0 0 1 6.713-4.125 1 1 0 1 1 .4 1.96 8.636 8.636 0 0 0 -5.513 3.354 1 1 0 0 1 -.8.405z',
      iconViewBox: '0 0 24 24',
    },
  ];

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

  closeSidebarOnMobile(): void {
    if (window.innerWidth <= 768) {
      this.sidebarService.toggleSidebar();
    }
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

  getProfilePictureUrl(): string {
    const user = this.account();
    const imageUrl = user?.imageUrl?.trim();

    if (imageUrl) {
      return imageUrl;
    }

    const login = user?.login ?? 'guest';
    return this.getAvatarUrl(login);
  }
  getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(seed)}`;
  }
}
