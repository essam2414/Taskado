import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProductivityReport } from '../productivity-report.model';
import { ProductivityReportService } from '../service/productivity-report.service';
import { ProductivityReportFormGroup, ProductivityReportFormService } from './productivity-report-form.service';

@Component({
  standalone: true,
  selector: 'jhi-productivity-report-update',
  templateUrl: './productivity-report-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProductivityReportUpdateComponent implements OnInit {
  isSaving = false;
  productivityReport: IProductivityReport | null = null;

  protected productivityReportService = inject(ProductivityReportService);
  protected productivityReportFormService = inject(ProductivityReportFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ProductivityReportFormGroup = this.productivityReportFormService.createProductivityReportFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productivityReport }) => {
      this.productivityReport = productivityReport;
      if (productivityReport) {
        this.updateForm(productivityReport);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productivityReport = this.productivityReportFormService.getProductivityReport(this.editForm);
    if (productivityReport.id !== null) {
      this.subscribeToSaveResponse(this.productivityReportService.update(productivityReport));
    } else {
      this.subscribeToSaveResponse(this.productivityReportService.create(productivityReport));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductivityReport>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(productivityReport: IProductivityReport): void {
    this.productivityReport = productivityReport;
    this.productivityReportFormService.resetForm(this.editForm, productivityReport);
  }
}
