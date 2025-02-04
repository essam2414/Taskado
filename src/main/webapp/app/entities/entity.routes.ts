import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'task',
    data: { pageTitle: 'Tasks' },
    loadChildren: () => import('./task/task.routes'),
  },
  {
    path: 'habit',
    data: { pageTitle: 'Habits' },
    loadChildren: () => import('./habit/habit.routes'),
  },
  {
    path: 'event',
    data: { pageTitle: 'Events' },
    loadChildren: () => import('./event/event.routes'),
  },
  {
    path: 'notification',
    data: { pageTitle: 'Notifications' },
    loadChildren: () => import('./notification/notification.routes'),
  },
  {
    path: 'pomodoro-session',
    data: { pageTitle: 'PomodoroSessions' },
    loadChildren: () => import('./pomodoro-session/pomodoro-session.routes'),
  },
  {
    path: 'goal',
    data: { pageTitle: 'Goals' },
    loadChildren: () => import('./goal/goal.routes'),
  },
  {
    path: 'productivity-report',
    data: { pageTitle: 'ProductivityReports' },
    loadChildren: () => import('./productivity-report/productivity-report.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
