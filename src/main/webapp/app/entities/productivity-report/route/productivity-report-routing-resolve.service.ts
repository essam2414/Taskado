import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductivityReport } from '../productivity-report.model';
import { ProductivityReportService } from '../service/productivity-report.service';

const productivityReportResolve = (route: ActivatedRouteSnapshot): Observable<null | IProductivityReport> => {
  const id = route.params.id;
  if (id) {
    return inject(ProductivityReportService)
      .find(id)
      .pipe(
        mergeMap((productivityReport: HttpResponse<IProductivityReport>) => {
          if (productivityReport.body) {
            return of(productivityReport.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default productivityReportResolve;
