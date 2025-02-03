import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PomodoroSessionResolve from './route/pomodoro-session-routing-resolve.service';

const pomodoroSessionRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/pomodoro-session.component').then(m => m.PomodoroSessionComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/pomodoro-session-detail.component').then(m => m.PomodoroSessionDetailComponent),
    resolve: {
      pomodoroSession: PomodoroSessionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/pomodoro-session-update.component').then(m => m.PomodoroSessionUpdateComponent),
    resolve: {
      pomodoroSession: PomodoroSessionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/pomodoro-session-update.component').then(m => m.PomodoroSessionUpdateComponent),
    resolve: {
      pomodoroSession: PomodoroSessionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pomodoroSessionRoute;
