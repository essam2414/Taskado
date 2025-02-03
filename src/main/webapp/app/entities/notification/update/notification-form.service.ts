import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INotification, NewNotification } from '../notification.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INotification for edit and NewNotificationFormGroupInput for create.
 */
type NotificationFormGroupInput = INotification | PartialWithRequiredKeyOf<NewNotification>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends INotification | NewNotification> = Omit<T, 'timestamp' | 'expirationDate'> & {
  timestamp?: string | null;
  expirationDate?: string | null;
};

type NotificationFormRawValue = FormValueOf<INotification>;

type NewNotificationFormRawValue = FormValueOf<NewNotification>;

type NotificationFormDefaults = Pick<NewNotification, 'id' | 'timestamp' | 'read' | 'expirationDate' | 'isRecurring'>;

type NotificationFormGroupContent = {
  id: FormControl<NotificationFormRawValue['id'] | NewNotification['id']>;
  message: FormControl<NotificationFormRawValue['message']>;
  notificationType: FormControl<NotificationFormRawValue['notificationType']>;
  timestamp: FormControl<NotificationFormRawValue['timestamp']>;
  linkedEntityType: FormControl<NotificationFormRawValue['linkedEntityType']>;
  read: FormControl<NotificationFormRawValue['read']>;
  priority: FormControl<NotificationFormRawValue['priority']>;
  status: FormControl<NotificationFormRawValue['status']>;
  expirationDate: FormControl<NotificationFormRawValue['expirationDate']>;
  actionURL: FormControl<NotificationFormRawValue['actionURL']>;
  icon: FormControl<NotificationFormRawValue['icon']>;
  isRecurring: FormControl<NotificationFormRawValue['isRecurring']>;
  recurrencePattern: FormControl<NotificationFormRawValue['recurrencePattern']>;
  sentVia: FormControl<NotificationFormRawValue['sentVia']>;
  user: FormControl<NotificationFormRawValue['user']>;
};

export type NotificationFormGroup = FormGroup<NotificationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NotificationFormService {
  createNotificationFormGroup(notification: NotificationFormGroupInput = { id: null }): NotificationFormGroup {
    const notificationRawValue = this.convertNotificationToNotificationRawValue({
      ...this.getFormDefaults(),
      ...notification,
    });
    return new FormGroup<NotificationFormGroupContent>({
      id: new FormControl(
        { value: notificationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      message: new FormControl(notificationRawValue.message, {
        validators: [Validators.required],
      }),
      notificationType: new FormControl(notificationRawValue.notificationType, {
        validators: [Validators.required],
      }),
      timestamp: new FormControl(notificationRawValue.timestamp, {
        validators: [Validators.required],
      }),
      linkedEntityType: new FormControl(notificationRawValue.linkedEntityType),
      read: new FormControl(notificationRawValue.read, {
        validators: [Validators.required],
      }),
      priority: new FormControl(notificationRawValue.priority, {
        validators: [Validators.required],
      }),
      status: new FormControl(notificationRawValue.status, {
        validators: [Validators.required],
      }),
      expirationDate: new FormControl(notificationRawValue.expirationDate),
      actionURL: new FormControl(notificationRawValue.actionURL),
      icon: new FormControl(notificationRawValue.icon),
      isRecurring: new FormControl(notificationRawValue.isRecurring, {
        validators: [Validators.required],
      }),
      recurrencePattern: new FormControl(notificationRawValue.recurrencePattern),
      sentVia: new FormControl(notificationRawValue.sentVia, {
        validators: [Validators.required],
      }),
      user: new FormControl(notificationRawValue.user),
    });
  }

  getNotification(form: NotificationFormGroup): INotification | NewNotification {
    return this.convertNotificationRawValueToNotification(form.getRawValue() as NotificationFormRawValue | NewNotificationFormRawValue);
  }

  resetForm(form: NotificationFormGroup, notification: NotificationFormGroupInput): void {
    const notificationRawValue = this.convertNotificationToNotificationRawValue({ ...this.getFormDefaults(), ...notification });
    form.reset(
      {
        ...notificationRawValue,
        id: { value: notificationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): NotificationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
      read: false,
      expirationDate: currentTime,
      isRecurring: false,
    };
  }

  private convertNotificationRawValueToNotification(
    rawNotification: NotificationFormRawValue | NewNotificationFormRawValue,
  ): INotification | NewNotification {
    return {
      ...rawNotification,
      timestamp: dayjs(rawNotification.timestamp, DATE_TIME_FORMAT),
      expirationDate: dayjs(rawNotification.expirationDate, DATE_TIME_FORMAT),
    };
  }

  private convertNotificationToNotificationRawValue(
    notification: INotification | (Partial<NewNotification> & NotificationFormDefaults),
  ): NotificationFormRawValue | PartialWithRequiredKeyOf<NewNotificationFormRawValue> {
    return {
      ...notification,
      timestamp: notification.timestamp ? notification.timestamp.format(DATE_TIME_FORMAT) : undefined,
      expirationDate: notification.expirationDate ? notification.expirationDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
