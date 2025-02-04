import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IProductivityReport } from '../productivity-report.model';
import { ProductivityReportService } from '../service/productivity-report.service';

@Component({
  standalone: true,
  templateUrl: './productivity-report-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProductivityReportDeleteDialogComponent {
  productivityReport?: IProductivityReport;

  protected productivityReportService = inject(ProductivityReportService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productivityReportService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
