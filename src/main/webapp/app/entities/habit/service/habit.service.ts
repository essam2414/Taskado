import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHabit, NewHabit } from '../habit.model';

export type PartialUpdateHabit = Partial<IHabit> & Pick<IHabit, 'id'>;

type RestOf<T extends IHabit | NewHabit> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

export type RestHabit = RestOf<IHabit>;

export type NewRestHabit = RestOf<NewHabit>;

export type PartialUpdateRestHabit = RestOf<PartialUpdateHabit>;

export type EntityResponseType = HttpResponse<IHabit>;
export type EntityArrayResponseType = HttpResponse<IHabit[]>;

@Injectable({ providedIn: 'root' })
export class HabitService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/habits');

  create(habit: NewHabit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(habit);
    return this.http.post<RestHabit>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(habit: IHabit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(habit);
    return this.http
      .put<RestHabit>(`${this.resourceUrl}/${this.getHabitIdentifier(habit)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(habit: PartialUpdateHabit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(habit);
    return this.http
      .patch<RestHabit>(`${this.resourceUrl}/${this.getHabitIdentifier(habit)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestHabit>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestHabit[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHabitIdentifier(habit: Pick<IHabit, 'id'>): number {
    return habit.id;
  }

  compareHabit(o1: Pick<IHabit, 'id'> | null, o2: Pick<IHabit, 'id'> | null): boolean {
    return o1 && o2 ? this.getHabitIdentifier(o1) === this.getHabitIdentifier(o2) : o1 === o2;
  }

  addHabitToCollectionIfMissing<Type extends Pick<IHabit, 'id'>>(
    habitCollection: Type[],
    ...habitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const habits: Type[] = habitsToCheck.filter(isPresent);
    if (habits.length > 0) {
      const habitCollectionIdentifiers = habitCollection.map(habitItem => this.getHabitIdentifier(habitItem));
      const habitsToAdd = habits.filter(habitItem => {
        const habitIdentifier = this.getHabitIdentifier(habitItem);
        if (habitCollectionIdentifiers.includes(habitIdentifier)) {
          return false;
        }
        habitCollectionIdentifiers.push(habitIdentifier);
        return true;
      });
      return [...habitsToAdd, ...habitCollection];
    }
    return habitCollection;
  }

  protected convertDateFromClient<T extends IHabit | NewHabit | PartialUpdateHabit>(habit: T): RestOf<T> {
    return {
      ...habit,
      startDate: habit.startDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restHabit: RestHabit): IHabit {
    return {
      ...restHabit,
      startDate: restHabit.startDate ? dayjs(restHabit.startDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestHabit>): HttpResponse<IHabit> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestHabit[]>): HttpResponse<IHabit[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
