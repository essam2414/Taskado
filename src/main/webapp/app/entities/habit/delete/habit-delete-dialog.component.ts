import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IHabit } from '../habit.model';
import { HabitService } from '../service/habit.service';

@Component({
  standalone: true,
  templateUrl: './habit-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class HabitDeleteDialogComponent {
  habit?: IHabit;

  protected habitService = inject(HabitService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.habitService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
