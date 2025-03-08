import { Routes } from '@angular/router';

import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { errorRoute } from './layouts/error/error.route';

import { AccountService } from './core/auth/account.service';
import { inject } from '@angular/core';

const routes: Routes = [
  {
    path: 'gdpr-policy',
    loadComponent: () => import('./gdpr-policy/gdpr-policy.component'),
    title: 'GDPR Policy',
  },
  {
    path: '',
    loadComponent: () => import('./landing-page/landing-page.component'),
    title: 'Taskado',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./home/home.component'),
    title: 'Taskado | Dashboard',
  },
  {
    path: 'admin',
    data: {
      authorities: [Authority.ADMIN],
    },
    canActivate: [UserRouteAccessService],
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.route'),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
    title: 'login.title',
  },
  {
    path: '',
    loadChildren: () => import(`./entities/entity.routes`),
  },
  ...errorRoute,
];

export default routes;
