import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISection } from '../section.model';
import { SectionService } from '../service/section.service';

@Component({
  standalone: true,
  templateUrl: './section-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SectionDeleteDialogComponent {
  section?: ISection;
  taskCount = 0;

  protected sectionService = inject(SectionService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sectionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
