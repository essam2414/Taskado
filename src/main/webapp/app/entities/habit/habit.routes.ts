import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import HabitResolve from './route/habit-routing-resolve.service';

const habitRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/habit.component').then(m => m.HabitComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/habit-detail.component').then(m => m.HabitDetailComponent),
    resolve: {
      habit: HabitResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/habit-update.component').then(m => m.HabitUpdateComponent),
    resolve: {
      habit: HabitResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/habit-update.component').then(m => m.HabitUpdateComponent),
    resolve: {
      habit: HabitResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default habitRoute;
