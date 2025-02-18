import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITaskCategory } from '../task-category.model';
import { TaskCategoryService } from '../service/task-category.service';

@Component({
  standalone: true,
  templateUrl: './task-category-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TaskCategoryDeleteDialogComponent {
  taskCategory?: ITaskCategory;

  protected taskCategoryService = inject(TaskCategoryService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.taskCategoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
