import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITaskCategory, NewTaskCategory } from '../task-category.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITaskCategory for edit and NewTaskCategoryFormGroupInput for create.
 */
type TaskCategoryFormGroupInput = ITaskCategory | PartialWithRequiredKeyOf<NewTaskCategory>;

type TaskCategoryFormDefaults = Pick<NewTaskCategory, 'id'>;

type TaskCategoryFormGroupContent = {
  id: FormControl<ITaskCategory['id'] | NewTaskCategory['id']>;
  name: FormControl<ITaskCategory['name']>;
};

export type TaskCategoryFormGroup = FormGroup<TaskCategoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskCategoryFormService {
  createTaskCategoryFormGroup(taskCategory: TaskCategoryFormGroupInput = { id: null }): TaskCategoryFormGroup {
    const taskCategoryRawValue = {
      ...this.getFormDefaults(),
      ...taskCategory,
    };
    return new FormGroup<TaskCategoryFormGroupContent>({
      id: new FormControl(
        { value: taskCategoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(taskCategoryRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getTaskCategory(form: TaskCategoryFormGroup): ITaskCategory | NewTaskCategory {
    return form.getRawValue() as ITaskCategory | NewTaskCategory;
  }

  resetForm(form: TaskCategoryFormGroup, taskCategory: TaskCategoryFormGroupInput): void {
    const taskCategoryRawValue = { ...this.getFormDefaults(), ...taskCategory };
    form.reset(
      {
        ...taskCategoryRawValue,
        id: { value: taskCategoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TaskCategoryFormDefaults {
    return {
      id: null,
    };
  }
}
