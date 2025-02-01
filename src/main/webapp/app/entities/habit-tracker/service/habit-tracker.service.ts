import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHabitTracker, NewHabitTracker } from '../habit-tracker.model';

export type PartialUpdateHabitTracker = Partial<IHabitTracker> & Pick<IHabitTracker, 'id'>;

type RestOf<T extends IHabitTracker | NewHabitTracker> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

export type RestHabitTracker = RestOf<IHabitTracker>;

export type NewRestHabitTracker = RestOf<NewHabitTracker>;

export type PartialUpdateRestHabitTracker = RestOf<PartialUpdateHabitTracker>;

export type EntityResponseType = HttpResponse<IHabitTracker>;
export type EntityArrayResponseType = HttpResponse<IHabitTracker[]>;

@Injectable({ providedIn: 'root' })
export class HabitTrackerService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/habit-trackers');

  create(habitTracker: NewHabitTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(habitTracker);
    return this.http
      .post<RestHabitTracker>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(habitTracker: IHabitTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(habitTracker);
    return this.http
      .put<RestHabitTracker>(`${this.resourceUrl}/${this.getHabitTrackerIdentifier(habitTracker)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(habitTracker: PartialUpdateHabitTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(habitTracker);
    return this.http
      .patch<RestHabitTracker>(`${this.resourceUrl}/${this.getHabitTrackerIdentifier(habitTracker)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestHabitTracker>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestHabitTracker[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHabitTrackerIdentifier(habitTracker: Pick<IHabitTracker, 'id'>): number {
    return habitTracker.id;
  }

  compareHabitTracker(o1: Pick<IHabitTracker, 'id'> | null, o2: Pick<IHabitTracker, 'id'> | null): boolean {
    return o1 && o2 ? this.getHabitTrackerIdentifier(o1) === this.getHabitTrackerIdentifier(o2) : o1 === o2;
  }

  addHabitTrackerToCollectionIfMissing<Type extends Pick<IHabitTracker, 'id'>>(
    habitTrackerCollection: Type[],
    ...habitTrackersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const habitTrackers: Type[] = habitTrackersToCheck.filter(isPresent);
    if (habitTrackers.length > 0) {
      const habitTrackerCollectionIdentifiers = habitTrackerCollection.map(habitTrackerItem =>
        this.getHabitTrackerIdentifier(habitTrackerItem),
      );
      const habitTrackersToAdd = habitTrackers.filter(habitTrackerItem => {
        const habitTrackerIdentifier = this.getHabitTrackerIdentifier(habitTrackerItem);
        if (habitTrackerCollectionIdentifiers.includes(habitTrackerIdentifier)) {
          return false;
        }
        habitTrackerCollectionIdentifiers.push(habitTrackerIdentifier);
        return true;
      });
      return [...habitTrackersToAdd, ...habitTrackerCollection];
    }
    return habitTrackerCollection;
  }

  protected convertDateFromClient<T extends IHabitTracker | NewHabitTracker | PartialUpdateHabitTracker>(habitTracker: T): RestOf<T> {
    return {
      ...habitTracker,
      startDate: habitTracker.startDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restHabitTracker: RestHabitTracker): IHabitTracker {
    return {
      ...restHabitTracker,
      startDate: restHabitTracker.startDate ? dayjs(restHabitTracker.startDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestHabitTracker>): HttpResponse<IHabitTracker> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestHabitTracker[]>): HttpResponse<IHabitTracker[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
