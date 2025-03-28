import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';

const taskRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/task.component').then(m => m.TaskComponent),
    data: {
      defaultSort: `order,${ASC},id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default taskRoute;
