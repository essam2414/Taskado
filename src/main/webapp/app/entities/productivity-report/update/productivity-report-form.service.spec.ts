import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../productivity-report.test-samples';

import { ProductivityReportFormService } from './productivity-report-form.service';

describe('ProductivityReport Form Service', () => {
  let service: ProductivityReportFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductivityReportFormService);
  });

  describe('Service methods', () => {
    describe('createProductivityReportFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductivityReportFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tasksPlanned: expect.any(Object),
            tasksCompleted: expect.any(Object),
            pomodoroSessionsCompleted: expect.any(Object),
            totalFocusTime: expect.any(Object),
            distractionsCount: expect.any(Object),
            efficiencyScore: expect.any(Object),
            timestamp: expect.any(Object),
            user: expect.any(Object),
            completedTasks: expect.any(Object),
            completedHabits: expect.any(Object),
          }),
        );
      });

      it('passing IProductivityReport should create a new form with FormGroup', () => {
        const formGroup = service.createProductivityReportFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tasksPlanned: expect.any(Object),
            tasksCompleted: expect.any(Object),
            pomodoroSessionsCompleted: expect.any(Object),
            totalFocusTime: expect.any(Object),
            distractionsCount: expect.any(Object),
            efficiencyScore: expect.any(Object),
            timestamp: expect.any(Object),
            user: expect.any(Object),
            completedTasks: expect.any(Object),
            completedHabits: expect.any(Object),
          }),
        );
      });
    });

    describe('getProductivityReport', () => {
      it('should return NewProductivityReport for default ProductivityReport initial value', () => {
        const formGroup = service.createProductivityReportFormGroup(sampleWithNewData);

        const productivityReport = service.getProductivityReport(formGroup) as any;

        expect(productivityReport).toMatchObject(sampleWithNewData);
      });

      it('should return NewProductivityReport for empty ProductivityReport initial value', () => {
        const formGroup = service.createProductivityReportFormGroup();

        const productivityReport = service.getProductivityReport(formGroup) as any;

        expect(productivityReport).toMatchObject({});
      });

      it('should return IProductivityReport', () => {
        const formGroup = service.createProductivityReportFormGroup(sampleWithRequiredData);

        const productivityReport = service.getProductivityReport(formGroup) as any;

        expect(productivityReport).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProductivityReport should not enable id FormControl', () => {
        const formGroup = service.createProductivityReportFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProductivityReport should disable id FormControl', () => {
        const formGroup = service.createProductivityReportFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
