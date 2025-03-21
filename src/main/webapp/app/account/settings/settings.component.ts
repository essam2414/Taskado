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
  user: Account | null = null;
  success = signal(false);
  darkMode = false;

  activeTab = 'account';
  tabsOpen = false;
  tabs = [
    { value: 'account', label: 'Account', icon: 'user' },
    { value: 'appearance', label: 'Appearance', icon: 'palette' },
    { value: 'accessibility', label: 'Accessibility', icon: 'eye' },
  ];

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

  fontSizeLevel = 2;
  fontScaleOptions = [0.7, 0.85, 1, 1.15, 1.3];
  dyslexiaMode = false;
  highContrast = false;
  reduceMotion = false;

  previewUrl: string | null = null;
  selectedFile: File | null = null;

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
    this.loadFontSize();
    this.loadDyslexiaFont();
    this.loadHighContrast();
    this.loadReduceMotion();

    this.darkMode = localStorage.getItem('darkMode') === 'true';
    const highContrast = localStorage.getItem('highContrast') === 'true';

    document.documentElement.setAttribute('data-theme', highContrast ? 'high-contrast' : this.darkMode ? 'dark' : 'light');

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
        this.user = account;
        this.settingsForm.patchValue(account);
      }
    });
  }

  getProfilePictureUrl(): string {
    const login = this.settingsForm.value.login;
    let imageUrl = this.settingsForm.get('imageUrl')?.value;

    if (!imageUrl || imageUrl.trim() === '') {
      imageUrl = this.getAvatarUrl(login ?? 'guest');
    }

    return imageUrl;
  }

  getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(seed)}`;
  }

  removeProfilePicture(): void {
    this.settingsForm.get('imageUrl')?.setValue('');
    this.previewUrl = null;
    this.selectedFile = null;
  }

  shouldShowRemoveButton(): boolean {
    const imageUrl = this.settingsForm.get('imageUrl')?.value;
    return !!imageUrl?.trim();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
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
    if (this.selectedFile) {
      this.uploadProfilePicture(this.selectedFile).then(imageUrl => {
        account.imageUrl = imageUrl; // Update image URL
        this.settingsForm.patchValue({ imageUrl }); // update form immediately
        this.submitAccountUpdate(account);
      });
    } else {
      this.submitAccountUpdate(account);
    }
  }

  get activeTabLabel(): string {
    return this.tabs.find(tab => tab.value === this.activeTab)?.label ?? 'Settings';
  }

  get activeTabIcon(): string {
    return this.tabs.find(tab => tab.value === this.activeTab)?.icon ?? 'cog';
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleTabs(): void {
    this.tabsOpen = !this.tabsOpen;
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

    let textColor = '#FFFFFF';
    let hoverColor = '#444444';

    if (!this.highContrast) {
      const rgb = this.hexToRgb(this.selectedSidebarColor);
      if (rgb) {
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        textColor = brightness > 128 ? '#2C2C38' : '#FFFFFF';

        hoverColor =
          brightness > 128
            ? `rgba(${rgb.r - 20}, ${rgb.g - 20}, ${rgb.b - 20}, 0.3)`
            : `rgba(${rgb.r + 20}, ${rgb.g + 20}, ${rgb.b + 20}, 0.3)`;
      }
    }

    document.documentElement.style.setProperty('--sidebar-text-color', textColor);
    document.documentElement.style.setProperty('--navmenu-text', textColor);
    document.documentElement.style.setProperty('--navmenu-hover-text', textColor);
    document.documentElement.style.setProperty('--sidebar-hover-bg', hoverColor);
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
    if (this.highContrast) {
      return localStorage.getItem('sidebarColorHighContrast') ?? '#000000'; // Black sidebar in high contrast
    }

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

  updateFontSize(): void {
    const newScale = this.fontScaleOptions[this.fontSizeLevel];
    document.documentElement.style.setProperty('--font-scale', newScale.toString());
    localStorage.setItem('fontSizeLevel', this.fontSizeLevel.toString());
  }

  loadFontSize(): void {
    const storedLevel = localStorage.getItem('fontSizeLevel');
    if (storedLevel !== null) {
      this.fontSizeLevel = parseInt(storedLevel, 10);
      this.updateFontSize();
    }
  }

  toggleDyslexiaFont(): void {
    this.dyslexiaMode = !this.dyslexiaMode;
    document.documentElement.classList.toggle('dyslexia-mode', this.dyslexiaMode);
    localStorage.setItem('dyslexiaMode', this.dyslexiaMode.toString());
  }

  loadDyslexiaFont(): void {
    const storedDyslexiaMode = localStorage.getItem('dyslexiaMode');
    this.dyslexiaMode = storedDyslexiaMode === 'true';

    if (this.dyslexiaMode) {
      document.documentElement.classList.add('dyslexia-mode');
    }
  }

  toggleHighContrast(): void {
    this.highContrast = !this.highContrast;

    if (this.highContrast) {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
      localStorage.setItem('highContrast', 'true');

      this.selectedSidebarColor = '#000000';
    } else {
      document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
      localStorage.removeItem('highContrast');

      this.selectedSidebarColor = this.darkMode ? this.getStoredSidebarColor(true) : this.getStoredSidebarColor(false);
    }

    this.applySidebarColor();
  }

  loadHighContrast(): void {
    const storedSetting = localStorage.getItem('highContrast');
    if (storedSetting === 'true') {
      this.highContrast = true;
      document.documentElement.setAttribute('data-theme', 'high-contrast');
    }
  }

  toggleReduceMotion(): void {
    this.reduceMotion = !this.reduceMotion;
    document.documentElement.classList.toggle('reduce-motion', this.reduceMotion);
    localStorage.setItem('reduceMotion', this.reduceMotion.toString());
  }

  loadReduceMotion(): void {
    this.reduceMotion = localStorage.getItem('reduceMotion') === 'true';
    if (this.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
  }

  protected submitAccountUpdate(account: Account): void {
    this.accountService.save(account).subscribe(() => {
      this.success.set(true);
      this.accountService.authenticate(account);

      this.accountService.identity(true).subscribe(updated => {
        this.user = updated;
        if (updated) {
          this.settingsForm.patchValue(updated);
        }
      });
    });
  }

  protected async uploadProfilePicture(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'taskado_preset'); // your unsigned preset

    const cloudName = 'dzxjmjjnt'; // Cloudinary cloud name

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data: { secure_url: string } = await response.json();
    return data.secure_url; // this is the public image URL
  }
}
