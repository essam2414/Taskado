import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITaskCategory, NewTaskCategory } from '../task-category.model';

export type PartialUpdateTaskCategory = Partial<ITaskCategory> & Pick<ITaskCategory, 'id'>;

export type EntityResponseType = HttpResponse<ITaskCategory>;
export type EntityArrayResponseType = HttpResponse<ITaskCategory[]>;

@Injectable({ providedIn: 'root' })
export class TaskCategoryService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/task-categories');

  create(taskCategory: NewTaskCategory): Observable<EntityResponseType> {
    return this.http.post<ITaskCategory>(this.resourceUrl, taskCategory, { observe: 'response' });
  }

  update(taskCategory: ITaskCategory): Observable<EntityResponseType> {
    return this.http.put<ITaskCategory>(`${this.resourceUrl}/${this.getTaskCategoryIdentifier(taskCategory)}`, taskCategory, {
      observe: 'response',
    });
  }

  partialUpdate(taskCategory: PartialUpdateTaskCategory): Observable<EntityResponseType> {
    return this.http.patch<ITaskCategory>(`${this.resourceUrl}/${this.getTaskCategoryIdentifier(taskCategory)}`, taskCategory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITaskCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITaskCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTaskCategoryIdentifier(taskCategory: Pick<ITaskCategory, 'id'>): number {
    return taskCategory.id;
  }

  compareTaskCategory(o1: Pick<ITaskCategory, 'id'> | null, o2: Pick<ITaskCategory, 'id'> | null): boolean {
    return o1 && o2 ? this.getTaskCategoryIdentifier(o1) === this.getTaskCategoryIdentifier(o2) : o1 === o2;
  }

  addTaskCategoryToCollectionIfMissing<Type extends Pick<ITaskCategory, 'id'>>(
    taskCategoryCollection: Type[],
    ...taskCategoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const taskCategories: Type[] = taskCategoriesToCheck.filter(isPresent);
    if (taskCategories.length > 0) {
      const taskCategoryCollectionIdentifiers = taskCategoryCollection.map(taskCategoryItem =>
        this.getTaskCategoryIdentifier(taskCategoryItem),
      );
      const taskCategoriesToAdd = taskCategories.filter(taskCategoryItem => {
        const taskCategoryIdentifier = this.getTaskCategoryIdentifier(taskCategoryItem);
        if (taskCategoryCollectionIdentifiers.includes(taskCategoryIdentifier)) {
          return false;
        }
        taskCategoryCollectionIdentifiers.push(taskCategoryIdentifier);
        return true;
      });
      return [...taskCategoriesToAdd, ...taskCategoryCollection];
    }
    return taskCategoryCollection;
  }
}
