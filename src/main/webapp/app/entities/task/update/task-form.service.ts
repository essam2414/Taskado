import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITask, NewTask } from '../task.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITask for edit and NewTaskFormGroupInput for create.
 */
type TaskFormGroupInput = ITask | PartialWithRequiredKeyOf<NewTask>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITask | NewTask> = Omit<T, 'dueDate' | 'createdAt' | 'updatedAt'> & {
  dueDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type TaskFormRawValue = FormValueOf<ITask>;

type NewTaskFormRawValue = FormValueOf<NewTask>;

type TaskFormDefaults = Pick<NewTask, 'id' | 'dueDate' | 'completed' | 'createdAt' | 'updatedAt'>;

type TaskFormGroupContent = {
  id: FormControl<TaskFormRawValue['id'] | NewTask['id']>;
  title: FormControl<TaskFormRawValue['title']>;
  description: FormControl<TaskFormRawValue['description']>;
  dueDate: FormControl<TaskFormRawValue['dueDate']>;
  priority: FormControl<TaskFormRawValue['priority']>;
  completed: FormControl<TaskFormRawValue['completed']>;
  createdAt: FormControl<TaskFormRawValue['createdAt']>;
  updatedAt: FormControl<TaskFormRawValue['updatedAt']>;
  category: FormControl<TaskFormRawValue['category']>;
  user: FormControl<TaskFormRawValue['user']>;
};

export type TaskFormGroup = FormGroup<TaskFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskFormService {
  createTaskFormGroup(task: TaskFormGroupInput = { id: null }): TaskFormGroup {
    const taskRawValue = this.convertTaskToTaskRawValue({
      ...this.getFormDefaults(),
      ...task,
    });
    return new FormGroup<TaskFormGroupContent>({
      id: new FormControl(
        { value: taskRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(taskRawValue.title, {
        validators: [Validators.required],
      }),
      description: new FormControl(taskRawValue.description),
      dueDate: new FormControl(taskRawValue.dueDate),
      priority: new FormControl(taskRawValue.priority),
      completed: new FormControl(taskRawValue.completed),
      createdAt: new FormControl(taskRawValue.createdAt),
      updatedAt: new FormControl(taskRawValue.updatedAt),
      category: new FormControl(taskRawValue.category),
      user: new FormControl(taskRawValue.user),
    });
  }

  getTask(form: TaskFormGroup): ITask | NewTask {
    return this.convertTaskRawValueToTask(form.getRawValue() as TaskFormRawValue | NewTaskFormRawValue);
  }

  resetForm(form: TaskFormGroup, task: TaskFormGroupInput): void {
    const taskRawValue = this.convertTaskToTaskRawValue({ ...this.getFormDefaults(), ...task });
    form.reset(
      {
        ...taskRawValue,
        id: { value: taskRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TaskFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dueDate: currentTime,
      completed: false,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertTaskRawValueToTask(rawTask: TaskFormRawValue | NewTaskFormRawValue): ITask | NewTask {
    return {
      ...rawTask,
      dueDate: dayjs(rawTask.dueDate, DATE_TIME_FORMAT),
      createdAt: dayjs(rawTask.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawTask.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertTaskToTaskRawValue(
    task: ITask | (Partial<NewTask> & TaskFormDefaults),
  ): TaskFormRawValue | PartialWithRequiredKeyOf<NewTaskFormRawValue> {
    return {
      ...task,
      dueDate: task.dueDate ? task.dueDate.format(DATE_TIME_FORMAT) : undefined,
      createdAt: task.createdAt ? task.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: task.updatedAt ? task.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
