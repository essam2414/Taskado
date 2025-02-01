import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHabit } from '../habit.model';
import { HabitService } from '../service/habit.service';

const habitResolve = (route: ActivatedRouteSnapshot): Observable<null | IHabit> => {
  const id = route.params.id;
  if (id) {
    return inject(HabitService)
      .find(id)
      .pipe(
        mergeMap((habit: HttpResponse<IHabit>) => {
          if (habit.body) {
            return of(habit.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default habitResolve;
