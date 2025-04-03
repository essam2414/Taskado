import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserPreferences, NewUserPreferences } from '../user-preferences.model';
import { AccountService } from 'app/core/auth/account.service';
import { UserService } from 'app/entities/user/service/user.service';

export type PartialUpdateUserPreferences = Partial<IUserPreferences> & Pick<IUserPreferences, 'id'>;

export type EntityResponseType = HttpResponse<IUserPreferences>;
export type EntityArrayResponseType = HttpResponse<IUserPreferences[]>;

@Injectable({ providedIn: 'root' })
export class UserPreferencesService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly accountService = inject(AccountService);
  protected readonly userService = inject(UserService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-preferences');

  create(userPreferences: NewUserPreferences): Observable<EntityResponseType> {
    return this.http.post<IUserPreferences>(this.resourceUrl, userPreferences, { observe: 'response' });
  }

  update(userPreferences: IUserPreferences): Observable<EntityResponseType> {
    return this.http.put<IUserPreferences>(`${this.resourceUrl}/${this.getUserPreferencesIdentifier(userPreferences)}`, userPreferences, {
      observe: 'response',
    });
  }

  partialUpdate(userPreferences: PartialUpdateUserPreferences): Observable<EntityResponseType> {
    return this.http.patch<IUserPreferences>(`${this.resourceUrl}/${this.getUserPreferencesIdentifier(userPreferences)}`, userPreferences, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserPreferences>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserPreferences[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserPreferencesIdentifier(userPreferences: Pick<IUserPreferences, 'id'>): number {
    return userPreferences.id;
  }

  compareUserPreferences(o1: Pick<IUserPreferences, 'id'> | null, o2: Pick<IUserPreferences, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserPreferencesIdentifier(o1) === this.getUserPreferencesIdentifier(o2) : o1 === o2;
  }

  addUserPreferencesToCollectionIfMissing<Type extends Pick<IUserPreferences, 'id'>>(
    userPreferencesCollection: Type[],
    ...userPreferencesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userPreferences: Type[] = userPreferencesToCheck.filter(isPresent);
    if (userPreferences.length > 0) {
      const userPreferencesCollectionIdentifiers = userPreferencesCollection.map(userPreferencesItem =>
        this.getUserPreferencesIdentifier(userPreferencesItem),
      );
      const userPreferencesToAdd = userPreferences.filter(userPreferencesItem => {
        const userPreferencesIdentifier = this.getUserPreferencesIdentifier(userPreferencesItem);
        if (userPreferencesCollectionIdentifiers.includes(userPreferencesIdentifier)) {
          return false;
        }
        userPreferencesCollectionIdentifiers.push(userPreferencesIdentifier);
        return true;
      });
      return [...userPreferencesToAdd, ...userPreferencesCollection];
    }
    return userPreferencesCollection;
  }

  async getOrCreateAndApply(): Promise<IUserPreferences> {
    const account = await firstValueFrom(this.accountService.identity());
    if (!account?.login) throw new Error('No user logged in');

    const userRes = await firstValueFrom(this.userService.query({ 'login.equals': account.login }));
    const fullUser = userRes.body?.find(u => u.login === account.login);
    if (!fullUser?.id) throw new Error('Could not find user ID');

    const prefsRes = await firstValueFrom(this.query({}));
    const prefsList = prefsRes.body ?? [];
    let prefs = prefsList.find(p => p.user?.id === fullUser.id);

    if (!prefs) {
      const newPrefs: NewUserPreferences = {
        id: null,
        darkMode: false,
        highContrast: false,
        dyslexiaMode: false,
        reduceMotion: false,
        fontSizeLevel: 2,
        accentColor: '#564df2',
        sidebarColorLight: '#fdf1f6',
        sidebarColorDark: '#1d1d1d',
        user: {
          id: fullUser.id,
          login: fullUser.login,
        },
      };
      const created = await firstValueFrom(this.create(newPrefs));
      prefs = created.body!;
    }

    this.applyPreferencesToDOM(prefs);
    return prefs;
  }

  applyPreferencesToDOM(prefs: IUserPreferences): void {
    const darkMode = prefs.darkMode ?? false;
    const highContrast = prefs.highContrast ?? false;
    const theme = highContrast ? 'high-contrast' : darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);

    const sidebarColor = highContrast
      ? '#000000'
      : darkMode
        ? (prefs.sidebarColorDark ?? '#1d1d1d')
        : (prefs.sidebarColorLight ?? '#fdf1f6');

    const accentColor = prefs.accentColor ?? '#564df2';
    const scale = [0.7, 0.85, 1, 1.15, 1.3][prefs.fontSizeLevel ?? 2] ?? 1;

    document.documentElement.style.setProperty('--sidebar-color', sidebarColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--font-scale', scale.toString());

    let textColor = '#FFFFFF';
    let hoverColor = '#444444';

    if (!highContrast) {
      const rgb = this.hexToRgb(sidebarColor);
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

    document.documentElement.classList.toggle('dyslexia-mode', !!prefs.dyslexiaMode);
    document.documentElement.classList.toggle('reduce-motion', !!prefs.reduceMotion);
  }

  resetDOMToDefaultTheme(): void {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'light');
    root.classList.remove('dyslexia-mode', 'reduce-motion');
    root.style.setProperty('--accent-color', '#564df2');
    root.style.setProperty('--sidebar-color', '#fdf1f6');
    root.style.setProperty('--sidebar-text-color', '#2C2C38');
    root.style.setProperty('--navmenu-text', '#2C2C38');
    root.style.setProperty('--navmenu-hover-text', '#2C2C38');
    root.style.setProperty('--sidebar-hover-bg', 'rgba(0, 0, 0, 0.07)');
    root.style.setProperty('--font-scale', '1');
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return null;
    let c = hex.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    const r = parseInt(c[0] + c[1], 16);
    const g = parseInt(c[2] + c[3], 16);
    const b = parseInt(c[4] + c[5], 16);
    return { r, g, b };
  }
}
