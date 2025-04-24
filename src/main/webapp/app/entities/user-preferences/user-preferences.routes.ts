import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import UserPreferencesResolve from './route/user-preferences-routing-resolve.service';

const userPreferencesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/user-preferences.component').then(m => m.UserPreferencesComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/user-preferences-detail.component').then(m => m.UserPreferencesDetailComponent),
    resolve: {
      userPreferences: UserPreferencesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/user-preferences-update.component').then(m => m.UserPreferencesUpdateComponent),
    resolve: {
      userPreferences: UserPreferencesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/user-preferences-update.component').then(m => m.UserPreferencesUpdateComponent),
    resolve: {
      userPreferences: UserPreferencesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userPreferencesRoute;
