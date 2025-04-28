import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserPreferences } from '../user-preferences.model';
import { UserPreferencesService } from '../service/user-preferences.service';

const userPreferencesResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserPreferences> => {
  const id = route.params.id;
  if (id) {
    return inject(UserPreferencesService)
      .find(id)
      .pipe(
        mergeMap((userPreferences: HttpResponse<IUserPreferences>) => {
          if (userPreferences.body) {
            return of(userPreferences.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default userPreferencesResolve;
