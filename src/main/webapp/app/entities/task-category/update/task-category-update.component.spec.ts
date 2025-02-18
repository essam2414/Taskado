import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { TaskCategoryService } from '../service/task-category.service';
import { ITaskCategory } from '../task-category.model';
import { TaskCategoryFormService } from './task-category-form.service';

import { TaskCategoryUpdateComponent } from './task-category-update.component';

describe('TaskCategory Management Update Component', () => {
  let comp: TaskCategoryUpdateComponent;
  let fixture: ComponentFixture<TaskCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let taskCategoryFormService: TaskCategoryFormService;
  let taskCategoryService: TaskCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskCategoryUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TaskCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TaskCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskCategoryFormService = TestBed.inject(TaskCategoryFormService);
    taskCategoryService = TestBed.inject(TaskCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const taskCategory: ITaskCategory = { id: 456 };

      activatedRoute.data = of({ taskCategory });
      comp.ngOnInit();

      expect(comp.taskCategory).toEqual(taskCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskCategory>>();
      const taskCategory = { id: 123 };
      jest.spyOn(taskCategoryFormService, 'getTaskCategory').mockReturnValue(taskCategory);
      jest.spyOn(taskCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: taskCategory }));
      saveSubject.complete();

      // THEN
      expect(taskCategoryFormService.getTaskCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskCategoryService.update).toHaveBeenCalledWith(expect.objectContaining(taskCategory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskCategory>>();
      const taskCategory = { id: 123 };
      jest.spyOn(taskCategoryFormService, 'getTaskCategory').mockReturnValue({ id: null });
      jest.spyOn(taskCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskCategory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: taskCategory }));
      saveSubject.complete();

      // THEN
      expect(taskCategoryFormService.getTaskCategory).toHaveBeenCalled();
      expect(taskCategoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskCategory>>();
      const taskCategory = { id: 123 };
      jest.spyOn(taskCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskCategoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
