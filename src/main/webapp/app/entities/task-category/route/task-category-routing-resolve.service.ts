import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITaskCategory } from '../task-category.model';
import { TaskCategoryService } from '../service/task-category.service';

const taskCategoryResolve = (route: ActivatedRouteSnapshot): Observable<null | ITaskCategory> => {
  const id = route.params.id;
  if (id) {
    return inject(TaskCategoryService)
      .find(id)
      .pipe(
        mergeMap((taskCategory: HttpResponse<ITaskCategory>) => {
          if (taskCategory.body) {
            return of(taskCategory.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default taskCategoryResolve;
