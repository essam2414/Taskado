import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AlertService } from 'app/core/util/alert.service';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
  private readonly alertService = inject(AlertService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const silent = request.headers.has('X-Silent-Alert');

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (silent) return;
        if (event instanceof HttpResponse) {
          let alert: string | null = null;

          for (const headerKey of event.headers.keys()) {
            if (headerKey.toLowerCase().endsWith('app-alert')) {
              alert = event.headers.get(headerKey);
            }
          }

          if (alert) {
            this.alertService.addAlert({
              type: 'success',
              message: alert,
            });
          }
        }
      }),
    );
  }
}
