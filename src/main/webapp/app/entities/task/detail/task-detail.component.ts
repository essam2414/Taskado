import { Component, Input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITask } from '../task.model';

import { filter } from 'rxjs';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { TaskDeleteDialogComponent } from '../delete/task-delete-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'jhi-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['../task.scss'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TaskDetailComponent {
  @Input() task: ITask | null = null;

  protected modalService = inject(NgbModal);

  previousState(): void {
    window.history.back();
  }

  delete(task: ITask): void {
    const modalRef = this.modalService.open(TaskDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.task = task;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.pipe(filter(reason => reason === ITEM_DELETED_EVENT)).subscribe();
  }
}
