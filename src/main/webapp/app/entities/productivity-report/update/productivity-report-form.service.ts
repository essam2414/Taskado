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

type ProductivityReportFormDefaults = Pick<NewProductivityReport, 'id' | 'timestamp'>;

type ProductivityReportFormGroupContent = {
  id: FormControl<ProductivityReportFormRawValue['id'] | NewProductivityReport['id']>;
  tasksPlanned: FormControl<ProductivityReportFormRawValue['tasksPlanned']>;
  tasksCompleted: FormControl<ProductivityReportFormRawValue['tasksCompleted']>;
  taskAvgCompletionTime: FormControl<ProductivityReportFormRawValue['taskAvgCompletionTime']>;
  taskEfficiency: FormControl<ProductivityReportFormRawValue['taskEfficiency']>;
  pomodoroSessions: FormControl<ProductivityReportFormRawValue['pomodoroSessions']>;
  distractionsCount: FormControl<ProductivityReportFormRawValue['distractionsCount']>;
  focusTime: FormControl<ProductivityReportFormRawValue['focusTime']>;
  focusScore: FormControl<ProductivityReportFormRawValue['focusScore']>;
  timestamp: FormControl<ProductivityReportFormRawValue['timestamp']>;
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
      tasksPlanned: new FormControl(productivityReportRawValue.tasksPlanned),
      tasksCompleted: new FormControl(productivityReportRawValue.tasksCompleted),
      taskAvgCompletionTime: new FormControl(productivityReportRawValue.taskAvgCompletionTime),
      taskEfficiency: new FormControl(productivityReportRawValue.taskEfficiency),
      pomodoroSessions: new FormControl(productivityReportRawValue.pomodoroSessions),
      distractionsCount: new FormControl(productivityReportRawValue.distractionsCount),
      focusTime: new FormControl(productivityReportRawValue.focusTime),
      focusScore: new FormControl(productivityReportRawValue.focusScore, {
        validators: [Validators.required],
      }),
      timestamp: new FormControl(productivityReportRawValue.timestamp, {
        validators: [Validators.required],
      }),
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
    };
  }
}
