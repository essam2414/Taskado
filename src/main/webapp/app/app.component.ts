import { Component, inject, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import dayjs from 'dayjs/esm';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import locale from '@angular/common/locales/en';
// jhipster-needle-angular-add-module-import JHipster will add new module here

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import MainComponent from './layouts/main/main.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'jhi-app',
  template: '<jhi-main></jhi-main>',
  imports: [
    MainComponent,
    // jhipster-needle-angular-add-module JHipster will add new module here
  ],
})
export default class AppComponent implements OnInit {
  private readonly applicationConfigService = inject(ApplicationConfigService);
  private readonly iconLibrary = inject(FaIconLibrary);
  private readonly dpConfig = inject(NgbDatepickerConfig);
  private readonly router = inject(Router);

  constructor() {
    this.applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    this.iconLibrary.addIcons(...fontAwesomeIcons);
    this.dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }

  ngOnInit(): void {
    this.initializeTheme();
  }

  initializeTheme(): void {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');

    const sidebarColor = darkMode
      ? (localStorage.getItem('sidebarColorDark') ??
        getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color-dark').trim())
      : (localStorage.getItem('sidebarColorLight') ??
        getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color').trim());

    const accentColor =
      localStorage.getItem('accentColor') ?? getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();

    document.documentElement.style.setProperty('--sidebar-color', sidebarColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);

    const rgb = this.hexToRgb(sidebarColor);
    if (rgb) {
      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      const textColor = brightness > 128 ? '#2C2C38' : '#FFFFFF';

      document.documentElement.style.setProperty('--sidebar-text-color', textColor);
      document.documentElement.style.setProperty('--navmenu-text', textColor);
      document.documentElement.style.setProperty('--navmenu-hover-text', textColor);

      const hoverColor =
        brightness > 128
          ? `rgba(${rgb.r - 20}, ${rgb.g - 20}, ${rgb.b - 20}, 0.3)`
          : `rgba(${rgb.r + 20}, ${rgb.g + 20}, ${rgb.b + 20}, 0.3)`;
      document.documentElement.style.setProperty('--sidebar-hover-bg', hoverColor);
    }
  }

  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return null;
    let c = hex.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    const r = parseInt(c[0] + c[1], 16);
    const g = parseInt(c[2] + c[3], 16);
    const b = parseInt(c[4] + c[5], 16);
    return { r, g, b };
  }
}
