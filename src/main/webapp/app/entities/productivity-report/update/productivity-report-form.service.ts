import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProductivityReport, NewProductivityReport } from '../productivity-report.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProductivityReport for edit and NewProductivityReportFormGroupInput for create.
 */
type ProductivityReportFormGroupInput = IProductivityReport | PartialWithRequiredKeyOf<NewProductivityReport>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IProductivityReport | NewProductivityReport> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type ProductivityReportFormRawValue = FormValueOf<IProductivityReport>;

type NewProductivityReportFormRawValue = FormValueOf<NewProductivityReport>;

type ProductivityReportFormDefaults = Pick<NewProductivityReport, 'id' | 'timestamp' | 'completedTasks' | 'completedHabits'>;

type ProductivityReportFormGroupContent = {
  id: FormControl<ProductivityReportFormRawValue['id'] | NewProductivityReport['id']>;
  tasksPlanned: FormControl<ProductivityReportFormRawValue['tasksPlanned']>;
  tasksCompleted: FormControl<ProductivityReportFormRawValue['tasksCompleted']>;
  pomodoroSessionsCompleted: FormControl<ProductivityReportFormRawValue['pomodoroSessionsCompleted']>;
  totalFocusTime: FormControl<ProductivityReportFormRawValue['totalFocusTime']>;
  distractionsCount: FormControl<ProductivityReportFormRawValue['distractionsCount']>;
  efficiencyScore: FormControl<ProductivityReportFormRawValue['efficiencyScore']>;
  timestamp: FormControl<ProductivityReportFormRawValue['timestamp']>;
  user: FormControl<ProductivityReportFormRawValue['user']>;
  completedTasks: FormControl<ProductivityReportFormRawValue['completedTasks']>;
  completedHabits: FormControl<ProductivityReportFormRawValue['completedHabits']>;
};

export type ProductivityReportFormGroup = FormGroup<ProductivityReportFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductivityReportFormService {
  createProductivityReportFormGroup(productivityReport: ProductivityReportFormGroupInput = { id: null }): ProductivityReportFormGroup {
    const productivityReportRawValue = this.convertProductivityReportToProductivityReportRawValue({
      ...this.getFormDefaults(),
      ...productivityReport,
    });
    return new FormGroup<ProductivityReportFormGroupContent>({
      id: new FormControl(
        { value: productivityReportRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      tasksPlanned: new FormControl(productivityReportRawValue.tasksPlanned, {
        validators: [Validators.required, Validators.min(0)],
      }),
      tasksCompleted: new FormControl(productivityReportRawValue.tasksCompleted, {
        validators: [Validators.required, Validators.min(0)],
      }),
      pomodoroSessionsCompleted: new FormControl(productivityReportRawValue.pomodoroSessionsCompleted, {
        validators: [Validators.required, Validators.min(0)],
      }),
      totalFocusTime: new FormControl(productivityReportRawValue.totalFocusTime, {
        validators: [Validators.min(0)],
      }),
      distractionsCount: new FormControl(productivityReportRawValue.distractionsCount, {
        validators: [Validators.min(0)],
      }),
      efficiencyScore: new FormControl(productivityReportRawValue.efficiencyScore, {
        validators: [Validators.min(0), Validators.max(100)],
      }),
      timestamp: new FormControl(productivityReportRawValue.timestamp, {
        validators: [Validators.required],
      }),
      user: new FormControl(productivityReportRawValue.user),
      completedTasks: new FormControl(productivityReportRawValue.completedTasks ?? []),
      completedHabits: new FormControl(productivityReportRawValue.completedHabits ?? []),
    });
  }

  getProductivityReport(form: ProductivityReportFormGroup): IProductivityReport | NewProductivityReport {
    return this.convertProductivityReportRawValueToProductivityReport(
      form.getRawValue() as ProductivityReportFormRawValue | NewProductivityReportFormRawValue,
    );
  }

  resetForm(form: ProductivityReportFormGroup, productivityReport: ProductivityReportFormGroupInput): void {
    const productivityReportRawValue = this.convertProductivityReportToProductivityReportRawValue({
      ...this.getFormDefaults(),
      ...productivityReport,
    });
    form.reset(
      {
        ...productivityReportRawValue,
        id: { value: productivityReportRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProductivityReportFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
      completedTasks: [],
      completedHabits: [],
    };
  }

  private convertProductivityReportRawValueToProductivityReport(
    rawProductivityReport: ProductivityReportFormRawValue | NewProductivityReportFormRawValue,
  ): IProductivityReport | NewProductivityReport {
    return {
      ...rawProductivityReport,
      timestamp: dayjs(rawProductivityReport.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertProductivityReportToProductivityReportRawValue(
    productivityReport: IProductivityReport | (Partial<NewProductivityReport> & ProductivityReportFormDefaults),
  ): ProductivityReportFormRawValue | PartialWithRequiredKeyOf<NewProductivityReportFormRawValue> {
    return {
      ...productivityReport,
      timestamp: productivityReport.timestamp ? productivityReport.timestamp.format(DATE_TIME_FORMAT) : undefined,
      completedTasks: productivityReport.completedTasks ?? [],
      completedHabits: productivityReport.completedHabits ?? [],
    };
  }
}
