import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPomodoroSession, NewPomodoroSession } from '../pomodoro-session.model';

export type PartialUpdatePomodoroSession = Partial<IPomodoroSession> & Pick<IPomodoroSession, 'id'>;

type RestOf<T extends IPomodoroSession | NewPomodoroSession> = Omit<T, 'start' | 'stop'> & {
  start?: string | null;
  stop?: string | null;
};

export type RestPomodoroSession = RestOf<IPomodoroSession>;

export type NewRestPomodoroSession = RestOf<NewPomodoroSession>;

export type PartialUpdateRestPomodoroSession = RestOf<PartialUpdatePomodoroSession>;

export type EntityResponseType = HttpResponse<IPomodoroSession>;
export type EntityArrayResponseType = HttpResponse<IPomodoroSession[]>;

@Injectable({ providedIn: 'root' })
export class PomodoroSessionService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pomodoro-sessions');

  create(pomodoroSession: NewPomodoroSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pomodoroSession);
    return this.http
      .post<RestPomodoroSession>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pomodoroSession: IPomodoroSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pomodoroSession);
    return this.http
      .put<RestPomodoroSession>(`${this.resourceUrl}/${this.getPomodoroSessionIdentifier(pomodoroSession)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pomodoroSession: PartialUpdatePomodoroSession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pomodoroSession);
    return this.http
      .patch<RestPomodoroSession>(`${this.resourceUrl}/${this.getPomodoroSessionIdentifier(pomodoroSession)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPomodoroSession>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPomodoroSession[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPomodoroSessionIdentifier(pomodoroSession: Pick<IPomodoroSession, 'id'>): number {
    return pomodoroSession.id;
  }

  comparePomodoroSession(o1: Pick<IPomodoroSession, 'id'> | null, o2: Pick<IPomodoroSession, 'id'> | null): boolean {
    return o1 && o2 ? this.getPomodoroSessionIdentifier(o1) === this.getPomodoroSessionIdentifier(o2) : o1 === o2;
  }

  addPomodoroSessionToCollectionIfMissing<Type extends Pick<IPomodoroSession, 'id'>>(
    pomodoroSessionCollection: Type[],
    ...pomodoroSessionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pomodoroSessions: Type[] = pomodoroSessionsToCheck.filter(isPresent);
    if (pomodoroSessions.length > 0) {
      const pomodoroSessionCollectionIdentifiers = pomodoroSessionCollection.map(pomodoroSessionItem =>
        this.getPomodoroSessionIdentifier(pomodoroSessionItem),
      );
      const pomodoroSessionsToAdd = pomodoroSessions.filter(pomodoroSessionItem => {
        const pomodoroSessionIdentifier = this.getPomodoroSessionIdentifier(pomodoroSessionItem);
        if (pomodoroSessionCollectionIdentifiers.includes(pomodoroSessionIdentifier)) {
          return false;
        }
        pomodoroSessionCollectionIdentifiers.push(pomodoroSessionIdentifier);
        return true;
      });
      return [...pomodoroSessionsToAdd, ...pomodoroSessionCollection];
    }
    return pomodoroSessionCollection;
  }

  protected convertDateFromClient<T extends IPomodoroSession | NewPomodoroSession | PartialUpdatePomodoroSession>(
    pomodoroSession: T,
  ): RestOf<T> {
    return {
      ...pomodoroSession,
      start: pomodoroSession.start?.toJSON() ?? null,
      stop: pomodoroSession.stop?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPomodoroSession: RestPomodoroSession): IPomodoroSession {
    return {
      ...restPomodoroSession,
      start: restPomodoroSession.start ? dayjs(restPomodoroSession.start) : undefined,
      stop: restPomodoroSession.stop ? dayjs(restPomodoroSession.stop) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPomodoroSession>): HttpResponse<IPomodoroSession> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPomodoroSession[]>): HttpResponse<IPomodoroSession[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
