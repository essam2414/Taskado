import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPomodoroSession } from '../pomodoro-session.model';
import { PomodoroSessionService } from '../service/pomodoro-session.service';

const pomodoroSessionResolve = (route: ActivatedRouteSnapshot): Observable<null | IPomodoroSession> => {
  const id = route.params.id;
  if (id) {
    return inject(PomodoroSessionService)
      .find(id)
      .pipe(
        mergeMap((pomodoroSession: HttpResponse<IPomodoroSession>) => {
          if (pomodoroSession.body) {
            return of(pomodoroSession.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default pomodoroSessionResolve;
