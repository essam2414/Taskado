import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ProductivityReportResolve from './route/productivity-report-routing-resolve.service';

const productivityReportRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/productivity-report.component').then(m => m.ProductivityReportComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/productivity-report-detail.component').then(m => m.ProductivityReportDetailComponent),
    resolve: {
      productivityReport: ProductivityReportResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/productivity-report-update.component').then(m => m.ProductivityReportUpdateComponent),
    resolve: {
      productivityReport: ProductivityReportResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/productivity-report-update.component').then(m => m.ProductivityReportUpdateComponent),
    resolve: {
      productivityReport: ProductivityReportResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default productivityReportRoute;
