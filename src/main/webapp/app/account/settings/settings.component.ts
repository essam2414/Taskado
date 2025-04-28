import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

import { UserPreferencesService } from 'app/entities/user-preferences/service/user-preferences.service';
import { IUserPreferences } from 'app/entities/user-preferences/user-preferences.model';

import { dashboardWidgets, Widget } from 'app/dashboard/widgets/widgets.component';
import { ActivatedRoute } from '@angular/router';

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
  preferences: IUserPreferences | null = null;
  success = signal(false);

  darkMode = false;
  selectedSidebarColorLight = '#fdf1f6';
  selectedSidebarColorDark = '#1d1d1d';
  selectedAccentColor = '#564df2';

  themeColors: string[] = [];
  darkModePalette: string[] = this.getThemeColors(true);
  lightModePalette: string[] = this.getThemeColors(false);

  selectedSidebarColor = '';
  customSidebarHexInput = '';
  customAccentHexInput = '';

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

  fontSizeLevel = 2;
  dyslexiaMode = false;
  highContrast = false;
  reduceMotion = false;

  activeTab = 'account';
  tabsOpen = false;
  tabs = [
    { value: 'account', label: 'Account', icon: 'user' },
    { value: 'appearance', label: 'Appearance', icon: 'palette' },
    { value: 'accessibility', label: 'Accessibility', icon: 'eye' },
    { value: 'dashboard', label: 'Dashboard', icon: 'desktop' },
  ];

  previewUrl: string | null = null;
  selectedFile: File | null = null;

  dashboardThemes = [
    { id: 'Default', bg: this.getDashboardThemeBackground('Default') },
    { id: 'Midnight', bg: this.getDashboardThemeBackground('Midnight') },
    { id: 'Amethyst', bg: this.getDashboardThemeBackground('Amethyst') },
    { id: 'Blush', bg: this.getDashboardThemeBackground('Blush') },
    { id: 'Apricot', bg: this.getDashboardThemeBackground('Apricot') },
    { id: 'Mist', bg: this.getDashboardThemeBackground('Mist') },
    { id: 'Sage', bg: this.getDashboardThemeBackground('Sage') },
    { id: 'Bloom', bg: this.getDashboardThemeBackground('Bloom') },
  ];
  selectedDashboardTheme = 'Default';
  widgets: Widget[] = [];

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
  private readonly userPreferencesService = inject(UserPreferencesService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab && this.tabs.some(t => t.value === tab)) {
        this.activeTab = tab;
      }
    });

    this.accountService.identity().subscribe(account => {
      if (account) {
        this.user = account;
        this.settingsForm.patchValue(account);

        this.userPreferencesService.getOrCreateAndApply().then(prefs => {
          this.preferences = prefs;
          this.applyPreferences(prefs);

          this.selectedDashboardTheme = prefs.dashboardTheme ?? 'Default';
          this.widgets = this.userPreferencesService.widgets;
        });
      }
    });
  }

  applyPreferences(prefs: IUserPreferences): void {
    this.darkMode = prefs.darkMode ?? false;
    this.highContrast = prefs.highContrast ?? false;
    this.dyslexiaMode = prefs.dyslexiaMode ?? false;
    this.reduceMotion = prefs.reduceMotion ?? false;
    this.fontSizeLevel = prefs.fontSizeLevel ?? 2;
    this.selectedAccentColor = prefs.accentColor ?? '#564df2';
    this.selectedSidebarColorLight = prefs.sidebarColorLight ?? '#fdf1f6';
    this.selectedSidebarColorDark = prefs.sidebarColorDark ?? '#1d1d1d';

    this.selectedSidebarColor = this.darkMode ? this.selectedSidebarColorDark : this.selectedSidebarColorLight;
    this.themeColors = this.darkMode ? this.darkModePalette : this.lightModePalette;

    this.userPreferencesService.applyPreferencesToDOM(prefs);
  }

  updateUserPreference(update: Partial<IUserPreferences>): void {
    if (!this.preferences?.id) return;

    const updatedPrefs = { ...this.preferences, ...update };

    this.userPreferencesService.update(updatedPrefs).subscribe({
      next: res => {
        this.preferences = res.body ?? updatedPrefs;
        this.applyPreferences(this.preferences);
      },
    });
  }

  // appearance settings

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    this.updateUserPreference({ darkMode: this.darkMode });

    this.selectedSidebarColor = this.darkMode ? this.selectedSidebarColorDark : this.selectedSidebarColorLight;
    this.themeColors = this.darkMode ? this.darkModePalette : this.lightModePalette;
  }

  updateAccentColor(): void {
    this.updateUserPreference({ accentColor: this.selectedAccentColor });
  }

  setSidebarColor(color: string): void {
    if (this.darkMode) {
      this.selectedSidebarColorDark = color;
      this.updateUserPreference({ sidebarColorDark: color });
    } else {
      this.selectedSidebarColorLight = color;
      this.updateUserPreference({ sidebarColorLight: color });
    }

    this.selectedSidebarColor = color;
  }

  isAppearanceDefault(): boolean {
    const defaultSidebarColor = (
      this.darkMode
        ? getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color-dark')
        : getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color')
    ).trim();
    const defaultAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();

    return this.selectedSidebarColor === defaultSidebarColor && this.selectedAccentColor === defaultAccentColor;
  }

  // accessability settings

  toggleHighContrast(): void {
    this.highContrast = !this.highContrast;
    this.updateUserPreference({ highContrast: this.highContrast });
  }

  toggleDyslexiaFont(): void {
    this.dyslexiaMode = !this.dyslexiaMode;
    this.updateUserPreference({ dyslexiaMode: this.dyslexiaMode });
  }

  toggleReduceMotion(): void {
    this.reduceMotion = !this.reduceMotion;
    this.updateUserPreference({ reduceMotion: this.reduceMotion });
  }

  updateFontSize(): void {
    this.updateUserPreference({ fontSizeLevel: this.fontSizeLevel });
  }

  isAccessibilityDefault(): boolean {
    return !this.highContrast && !this.dyslexiaMode && !this.reduceMotion && this.fontSizeLevel === 2;
  }

  // dashboard settings

  toggleWidget(widget: Widget): void {
    widget.enabled = !widget.enabled;

    const visibleWidgets = this.widgets.filter(w => w.enabled);
    const widgetsJson = JSON.stringify(visibleWidgets.map(w => w.id));

    this.updateUserPreference({ dashboardWidgetsJson: widgetsJson });
  }

  setDashboardTheme(theme: string): void {
    this.selectedDashboardTheme = theme;
    this.updateUserPreference({ dashboardTheme: theme });
    this.userPreferencesService.applyDashboardTheme(theme);
  }

  getDashboardThemeBackground(themeId: string): string {
    const fakeDiv = document.createElement('div');
    fakeDiv.setAttribute('data-dashboard-theme', themeId);
    document.body.appendChild(fakeDiv);

    const bg = getComputedStyle(fakeDiv).getPropertyValue('--dashboard-bg').trim();

    document.body.removeChild(fakeDiv);

    return bg;
  }

  isDashboardDefault(): boolean {
    const allWidgetsEnabled = this.widgets.every(w => w.enabled);
    return this.selectedDashboardTheme === 'Default' && allWidgetsEnabled;
  }

  // reset functions

  resetAppearance(): void {
    const defaultSidebarColor = (
      this.darkMode
        ? getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color-dark')
        : getComputedStyle(document.documentElement).getPropertyValue('--default-sidebar-color')
    ).trim();

    const defaultAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();

    this.selectedSidebarColor = defaultSidebarColor;
    this.selectedAccentColor = defaultAccentColor;

    this.updateUserPreference({
      sidebarColorDark: this.darkMode ? defaultSidebarColor : this.preferences?.sidebarColorDark,
      sidebarColorLight: !this.darkMode ? defaultSidebarColor : this.preferences?.sidebarColorLight,
      accentColor: defaultAccentColor,
    });
  }

  resetAccessibility(): void {
    const defaultAccessibilityPrefs = {
      highContrast: false,
      dyslexiaMode: false,
      reduceMotion: false,
      fontSizeLevel: 2,
    };

    this.updateUserPreference(defaultAccessibilityPrefs);
    this.userPreferencesService.resetDOMToDefaultTheme();

    this.darkMode = false;
    this.highContrast = false;
    this.dyslexiaMode = false;
    this.reduceMotion = false;
    this.fontSizeLevel = 2;
  }

  resetDashboard(): void {
    const defaultTheme = 'Default';
    this.selectedDashboardTheme = defaultTheme;
    this.userPreferencesService.applyDashboardTheme(defaultTheme);

    this.widgets.forEach(widget => {
      widget.enabled = true;
    });

    this.updateUserPreference({
      dashboardTheme: defaultTheme,
      dashboardWidgetsJson: JSON.stringify(this.widgets.map(widget => widget.id)),
    });
  }

  // account settings

  getProfilePictureUrl(): string {
    const login = this.settingsForm.value.login;
    let imageUrl = this.settingsForm.get('imageUrl')?.value;

    if (!imageUrl || imageUrl.trim() === '') {
      imageUrl = this.getAvatarUrl(login ?? 'guest');
    }

    return imageUrl;
  }

  getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
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
        account.imageUrl = imageUrl;
        this.settingsForm.patchValue({ imageUrl });
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
    formData.append('upload_preset', 'taskado_preset');

    const cloudName = 'dzxjmjjnt'; // Cloudinary cloud name

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data: { secure_url: string } = await response.json();
    return data.secure_url;
  }
}
