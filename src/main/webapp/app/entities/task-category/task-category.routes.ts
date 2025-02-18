import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TaskCategoryResolve from './route/task-category-routing-resolve.service';

const taskCategoryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/task-category.component').then(m => m.TaskCategoryComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/task-category-detail.component').then(m => m.TaskCategoryDetailComponent),
    resolve: {
      taskCategory: TaskCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/task-category-update.component').then(m => m.TaskCategoryUpdateComponent),
    resolve: {
      taskCategory: TaskCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/task-category-update.component').then(m => m.TaskCategoryUpdateComponent),
    resolve: {
      taskCategory: TaskCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default taskCategoryRoute;
