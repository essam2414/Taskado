import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../task-category.test-samples';

import { TaskCategoryFormService } from './task-category-form.service';

describe('TaskCategory Form Service', () => {
  let service: TaskCategoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskCategoryFormService);
  });

  describe('Service methods', () => {
    describe('createTaskCategoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTaskCategoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            color: expect.any(Object),
          }),
        );
      });

      it('passing ITaskCategory should create a new form with FormGroup', () => {
        const formGroup = service.createTaskCategoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            color: expect.any(Object),
          }),
        );
      });
    });

    describe('getTaskCategory', () => {
      it('should return NewTaskCategory for default TaskCategory initial value', () => {
        const formGroup = service.createTaskCategoryFormGroup(sampleWithNewData);

        const taskCategory = service.getTaskCategory(formGroup) as any;

        expect(taskCategory).toMatchObject(sampleWithNewData);
      });

      it('should return NewTaskCategory for empty TaskCategory initial value', () => {
        const formGroup = service.createTaskCategoryFormGroup();

        const taskCategory = service.getTaskCategory(formGroup) as any;

        expect(taskCategory).toMatchObject({});
      });

      it('should return ITaskCategory', () => {
        const formGroup = service.createTaskCategoryFormGroup(sampleWithRequiredData);

        const taskCategory = service.getTaskCategory(formGroup) as any;

        expect(taskCategory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITaskCategory should not enable id FormControl', () => {
        const formGroup = service.createTaskCategoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTaskCategory should disable id FormControl', () => {
        const formGroup = service.createTaskCategoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
