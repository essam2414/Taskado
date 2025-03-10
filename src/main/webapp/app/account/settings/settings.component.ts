import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

const initialAccount: Account = {} as Account;

@Component({
  standalone: true,
  selector: 'jhi-settings',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export default class SettingsComponent implements OnInit {
  success = signal(false);
  activeTab = 'account';
  darkMode = false;

  themeColors: string[] = [];
  darkModePalette: string[] = this.getThemeColors(true);
  lightModePalette: string[] = this.getThemeColors(false);

  selectedSidebarColorLight = this.getStoredSidebarColor(false);
  selectedSidebarColorDark = this.getStoredSidebarColor(true);
  selectedSidebarColor = this.darkMode ? this.selectedSidebarColorDark : this.selectedSidebarColorLight;

  accentColors: string[] = [
    getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
    '#3a86ff', // Blue
    '#43aa8b', // Teal
    '#758e4f', // Green
    '#f9c74f', // Yellow
    '#ec7d10', // Orange
    '#f94144', // Red
    '#e43f6f', // Pink
    '#be3e82', // Violet
  ];
  selectedAccentColor = this.accentColors[0];

  customSidebarHexInput = '';
  customAccentHexInput = '';

  settingsForm = new FormGroup({
    firstName: new FormControl(initialAccount.firstName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    lastName: new FormControl(initialAccount.lastName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl(initialAccount.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    langKey: new FormControl(initialAccount.langKey, { nonNullable: true }),

    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAccount.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),
  });

  private readonly accountService = inject(AccountService);

  ngOnInit(): void {
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');

    this.themeColors = this.darkMode ? this.darkModePalette : this.lightModePalette;
    this.selectedSidebarColorLight = this.getStoredSidebarColor(false);
    this.selectedSidebarColorDark = this.getStoredSidebarColor(true);

    this.selectedSidebarColor = this.getStoredSidebarColor(this.darkMode);
    this.applySidebarColor();

    this.selectedAccentColor =
      localStorage.getItem('accentColor') ?? getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    this.updateAccentColor();

    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue(account);
      }
    });
  }

  getThemeColors(isDarkMode: boolean): string[] {
    return isDarkMode
      ? [
          // Dark mode
          getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color-dark').trim(),
          '#5d0933', // Pink
          '#291938', // Purple
          '#042d3a', // Blue
          '#12403c', // Teal
          '#475200', // Green
          '#664d00', // Yellow
          '#6e2a0c', // Orange
          '#691312', // Red
        ]
      : [
          // Light mode
          getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color').trim(),
          '#f2c6de', // Pink
          '#dbcdf0', // Purple
          '#bde0fe', // Blue
          '#b8f2e6', // Teal
          '#cdeac0', // Green
          '#faedcb', // Yellow
          '#ffd8be', // Orange
          '#f9c6c9', // Red
        ];
  }

  save(): void {
    this.success.set(false);

    const account = this.settingsForm.getRawValue();
    this.accountService.save(account).subscribe(() => {
      this.success.set(true);

      this.accountService.authenticate(account);
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', this.darkMode.toString());

    this.themeColors = this.darkMode ? this.darkModePalette : this.lightModePalette;

    this.selectedSidebarColor = this.darkMode ? this.getStoredSidebarColor(true) : this.getStoredSidebarColor(false);

    this.applySidebarColor();
  }

  setSidebarColor(color: string): void {
    if (this.darkMode) {
      this.selectedSidebarColorDark = color;
      localStorage.setItem('sidebarColorDark', color);
    } else {
      this.selectedSidebarColorLight = color;
      localStorage.setItem('sidebarColorLight', color);
    }
    this.selectedSidebarColor = color;
    this.applySidebarColor();
  }

  updateAccentColor(): void {
    document.documentElement.style.setProperty('--accent-color', this.selectedAccentColor);
    localStorage.setItem('accentColor', this.selectedAccentColor);
  }

  applySidebarColor(): void {
    document.documentElement.style.setProperty('--sidebar-color', this.selectedSidebarColor);

    const rgb = this.hexToRgb(this.selectedSidebarColor);
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

  resetColors(): void {
    const defaultColor = this.darkMode
      ? getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color-dark').trim()
      : getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color').trim();
    this.setSidebarColor(defaultColor);

    this.selectedAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    this.updateAccentColor();
  }

  getStoredSidebarColor(isDarkMode: boolean): string {
    return isDarkMode
      ? (localStorage.getItem('sidebarColorDark') ??
          getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color-dark').trim())
      : (localStorage.getItem('sidebarColorLight') ??
          getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color').trim());
  }

  onCustomHexChange(type: 'sidebar' | 'accent'): void {
    if (type === 'sidebar' && /^[A-Fa-f0-9]*$/.test(this.customSidebarHexInput)) {
      this.selectedSidebarColor = `#${this.customSidebarHexInput}`;
      this.setSidebarColor(this.selectedSidebarColor);
    } else if (type === 'accent' && /^[A-Fa-f0-9]*$/.test(this.customAccentHexInput)) {
      this.selectedAccentColor = `#${this.customAccentHexInput}`;
      this.updateAccentColor();
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
