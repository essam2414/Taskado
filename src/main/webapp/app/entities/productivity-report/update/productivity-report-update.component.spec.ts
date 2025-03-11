import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ITask } from 'app/entities/task/task.model';
import { TaskService } from 'app/entities/task/service/task.service';
import { IHabit } from 'app/entities/habit/habit.model';
import { HabitService } from 'app/entities/habit/service/habit.service';
import { IProductivityReport } from '../productivity-report.model';
import { ProductivityReportService } from '../service/productivity-report.service';
import { ProductivityReportFormService } from './productivity-report-form.service';

import { ProductivityReportUpdateComponent } from './productivity-report-update.component';

describe('ProductivityReport Management Update Component', () => {
  let comp: ProductivityReportUpdateComponent;
  let fixture: ComponentFixture<ProductivityReportUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productivityReportFormService: ProductivityReportFormService;
  let productivityReportService: ProductivityReportService;
  let userService: UserService;
  let taskService: TaskService;
  let habitService: HabitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductivityReportUpdateComponent],
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
      .overrideTemplate(ProductivityReportUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductivityReportUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productivityReportFormService = TestBed.inject(ProductivityReportFormService);
    productivityReportService = TestBed.inject(ProductivityReportService);
    userService = TestBed.inject(UserService);
    taskService = TestBed.inject(TaskService);
    habitService = TestBed.inject(HabitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const productivityReport: IProductivityReport = { id: 456 };
      const user: IUser = { id: 5188 };
      productivityReport.user = user;

      const userCollection: IUser[] = [{ id: 29049 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productivityReport });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Task query and add missing value', () => {
      const productivityReport: IProductivityReport = { id: 456 };
      const completedTasks: ITask[] = [{ id: 26845 }];
      productivityReport.completedTasks = completedTasks;

      const taskCollection: ITask[] = [{ id: 28628 }];
      jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
      const additionalTasks = [...completedTasks];
      const expectedCollection: ITask[] = [...additionalTasks, ...taskCollection];
      jest.spyOn(taskService, 'addTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productivityReport });
      comp.ngOnInit();

      expect(taskService.query).toHaveBeenCalled();
      expect(taskService.addTaskToCollectionIfMissing).toHaveBeenCalledWith(
        taskCollection,
        ...additionalTasks.map(expect.objectContaining),
      );
      expect(comp.tasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Habit query and add missing value', () => {
      const productivityReport: IProductivityReport = { id: 456 };
      const completedHabits: IHabit[] = [{ id: 24413 }];
      productivityReport.completedHabits = completedHabits;

      const habitCollection: IHabit[] = [{ id: 10691 }];
      jest.spyOn(habitService, 'query').mockReturnValue(of(new HttpResponse({ body: habitCollection })));
      const additionalHabits = [...completedHabits];
      const expectedCollection: IHabit[] = [...additionalHabits, ...habitCollection];
      jest.spyOn(habitService, 'addHabitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ productivityReport });
      comp.ngOnInit();

      expect(habitService.query).toHaveBeenCalled();
      expect(habitService.addHabitToCollectionIfMissing).toHaveBeenCalledWith(
        habitCollection,
        ...additionalHabits.map(expect.objectContaining),
      );
      expect(comp.habitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const productivityReport: IProductivityReport = { id: 456 };
      const user: IUser = { id: 21279 };
      productivityReport.user = user;
      const completedTasks: ITask = { id: 13100 };
      productivityReport.completedTasks = [completedTasks];
      const completedHabits: IHabit = { id: 28564 };
      productivityReport.completedHabits = [completedHabits];

      activatedRoute.data = of({ productivityReport });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.tasksSharedCollection).toContain(completedTasks);
      expect(comp.habitsSharedCollection).toContain(completedHabits);
      expect(comp.productivityReport).toEqual(productivityReport);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductivityReport>>();
      const productivityReport = { id: 123 };
      jest.spyOn(productivityReportFormService, 'getProductivityReport').mockReturnValue(productivityReport);
      jest.spyOn(productivityReportService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productivityReport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productivityReport }));
      saveSubject.complete();

      // THEN
      expect(productivityReportFormService.getProductivityReport).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productivityReportService.update).toHaveBeenCalledWith(expect.objectContaining(productivityReport));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductivityReport>>();
      const productivityReport = { id: 123 };
      jest.spyOn(productivityReportFormService, 'getProductivityReport').mockReturnValue({ id: null });
      jest.spyOn(productivityReportService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productivityReport: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productivityReport }));
      saveSubject.complete();

      // THEN
      expect(productivityReportFormService.getProductivityReport).toHaveBeenCalled();
      expect(productivityReportService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductivityReport>>();
      const productivityReport = { id: 123 };
      jest.spyOn(productivityReportService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productivityReport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productivityReportService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTask', () => {
      it('Should forward to taskService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(taskService, 'compareTask');
        comp.compareTask(entity, entity2);
        expect(taskService.compareTask).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareHabit', () => {
      it('Should forward to habitService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(habitService, 'compareHabit');
        comp.compareHabit(entity, entity2);
        expect(habitService.compareHabit).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
