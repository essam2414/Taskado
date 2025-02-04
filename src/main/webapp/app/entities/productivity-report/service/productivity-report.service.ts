import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductivityReport, NewProductivityReport } from '../productivity-report.model';

export type PartialUpdateProductivityReport = Partial<IProductivityReport> & Pick<IProductivityReport, 'id'>;

type RestOf<T extends IProductivityReport | NewProductivityReport> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

export type RestProductivityReport = RestOf<IProductivityReport>;

export type NewRestProductivityReport = RestOf<NewProductivityReport>;

export type PartialUpdateRestProductivityReport = RestOf<PartialUpdateProductivityReport>;

export type EntityResponseType = HttpResponse<IProductivityReport>;
export type EntityArrayResponseType = HttpResponse<IProductivityReport[]>;

@Injectable({ providedIn: 'root' })
export class ProductivityReportService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/productivity-reports');

  create(productivityReport: NewProductivityReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productivityReport);
    return this.http
      .post<RestProductivityReport>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(productivityReport: IProductivityReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productivityReport);
    return this.http
      .put<RestProductivityReport>(`${this.resourceUrl}/${this.getProductivityReportIdentifier(productivityReport)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(productivityReport: PartialUpdateProductivityReport): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productivityReport);
    return this.http
      .patch<RestProductivityReport>(`${this.resourceUrl}/${this.getProductivityReportIdentifier(productivityReport)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProductivityReport>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProductivityReport[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductivityReportIdentifier(productivityReport: Pick<IProductivityReport, 'id'>): number {
    return productivityReport.id;
  }

  compareProductivityReport(o1: Pick<IProductivityReport, 'id'> | null, o2: Pick<IProductivityReport, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductivityReportIdentifier(o1) === this.getProductivityReportIdentifier(o2) : o1 === o2;
  }

  addProductivityReportToCollectionIfMissing<Type extends Pick<IProductivityReport, 'id'>>(
    productivityReportCollection: Type[],
    ...productivityReportsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productivityReports: Type[] = productivityReportsToCheck.filter(isPresent);
    if (productivityReports.length > 0) {
      const productivityReportCollectionIdentifiers = productivityReportCollection.map(productivityReportItem =>
        this.getProductivityReportIdentifier(productivityReportItem),
      );
      const productivityReportsToAdd = productivityReports.filter(productivityReportItem => {
        const productivityReportIdentifier = this.getProductivityReportIdentifier(productivityReportItem);
        if (productivityReportCollectionIdentifiers.includes(productivityReportIdentifier)) {
          return false;
        }
        productivityReportCollectionIdentifiers.push(productivityReportIdentifier);
        return true;
      });
      return [...productivityReportsToAdd, ...productivityReportCollection];
    }
    return productivityReportCollection;
  }

  protected convertDateFromClient<T extends IProductivityReport | NewProductivityReport | PartialUpdateProductivityReport>(
    productivityReport: T,
  ): RestOf<T> {
    return {
      ...productivityReport,
      timestamp: productivityReport.timestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProductivityReport: RestProductivityReport): IProductivityReport {
    return {
      ...restProductivityReport,
      timestamp: restProductivityReport.timestamp ? dayjs(restProductivityReport.timestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProductivityReport>): HttpResponse<IProductivityReport> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProductivityReport[]>): HttpResponse<IProductivityReport[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
