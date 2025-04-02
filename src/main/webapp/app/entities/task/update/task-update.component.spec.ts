import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ISection } from 'app/entities/section/section.model';
import { SectionService } from 'app/entities/section/service/section.service';
import { IProductivityReport } from 'app/entities/productivity-report/productivity-report.model';
import { ProductivityReportService } from 'app/entities/productivity-report/service/productivity-report.service';
import { ITask } from '../task.model';
import { TaskService } from '../service/task.service';
import { TaskFormService } from './task-form.service';

import { TaskUpdateComponent } from './task-update.component';

describe('Task Management Update Component', () => {
  let comp: TaskUpdateComponent;
  let fixture: ComponentFixture<TaskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let taskFormService: TaskFormService;
  let taskService: TaskService;
  let categoryService: CategoryService;
  let userService: UserService;
  let sectionService: SectionService;
  let productivityReportService: ProductivityReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskUpdateComponent],
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
      .overrideTemplate(TaskUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TaskUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskFormService = TestBed.inject(TaskFormService);
    taskService = TestBed.inject(TaskService);
    categoryService = TestBed.inject(CategoryService);
    userService = TestBed.inject(UserService);
    sectionService = TestBed.inject(SectionService);
    productivityReportService = TestBed.inject(ProductivityReportService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Category query and add missing value', () => {
      const task: ITask = { id: 456 };
      const category: ICategory = { id: 19747 };
      task.category = category;

      const categoryCollection: ICategory[] = [{ id: 6287 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [category];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        categoryCollection,
        ...additionalCategories.map(expect.objectContaining),
      );
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Task query and add missing value', () => {
      const task: ITask = { id: 456 };
      const parentTask: ITask = { id: 6009 };
      task.parentTask = parentTask;

      const taskCollection: ITask[] = [{ id: 5632 }];
      jest.spyOn(taskService, 'query').mockReturnValue(of(new HttpResponse({ body: taskCollection })));
      const additionalTasks = [parentTask];
      const expectedCollection: ITask[] = [...additionalTasks, ...taskCollection];
      jest.spyOn(taskService, 'addTaskToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(taskService.query).toHaveBeenCalled();
      expect(taskService.addTaskToCollectionIfMissing).toHaveBeenCalledWith(
        taskCollection,
        ...additionalTasks.map(expect.objectContaining),
      );
      expect(comp.tasksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const task: ITask = { id: 456 };
      const user: IUser = { id: 6219 };
      task.user = user;

      const userCollection: IUser[] = [{ id: 24893 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Section query and add missing value', () => {
      const task: ITask = { id: 456 };
      const section: ISection = { id: 13274 };
      task.section = section;

      const sectionCollection: ISection[] = [{ id: 6562 }];
      jest.spyOn(sectionService, 'query').mockReturnValue(of(new HttpResponse({ body: sectionCollection })));
      const additionalSections = [section];
      const expectedCollection: ISection[] = [...additionalSections, ...sectionCollection];
      jest.spyOn(sectionService, 'addSectionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(sectionService.query).toHaveBeenCalled();
      expect(sectionService.addSectionToCollectionIfMissing).toHaveBeenCalledWith(
        sectionCollection,
        ...additionalSections.map(expect.objectContaining),
      );
      expect(comp.sectionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ProductivityReport query and add missing value', () => {
      const task: ITask = { id: 456 };
      const productivityReports: IProductivityReport[] = [{ id: 137 }];
      task.productivityReports = productivityReports;

      const productivityReportCollection: IProductivityReport[] = [{ id: 10733 }];
      jest.spyOn(productivityReportService, 'query').mockReturnValue(of(new HttpResponse({ body: productivityReportCollection })));
      const additionalProductivityReports = [...productivityReports];
      const expectedCollection: IProductivityReport[] = [...additionalProductivityReports, ...productivityReportCollection];
      jest.spyOn(productivityReportService, 'addProductivityReportToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(productivityReportService.query).toHaveBeenCalled();
      expect(productivityReportService.addProductivityReportToCollectionIfMissing).toHaveBeenCalledWith(
        productivityReportCollection,
        ...additionalProductivityReports.map(expect.objectContaining),
      );
      expect(comp.productivityReportsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const task: ITask = { id: 456 };
      const category: ICategory = { id: 14297 };
      task.category = category;
      const parentTask: ITask = { id: 14793 };
      task.parentTask = parentTask;
      const user: IUser = { id: 11969 };
      task.user = user;
      const section: ISection = { id: 26910 };
      task.section = section;
      const productivityReport: IProductivityReport = { id: 1673 };
      task.productivityReports = [productivityReport];

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(comp.categoriesSharedCollection).toContain(category);
      expect(comp.tasksSharedCollection).toContain(parentTask);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.sectionsSharedCollection).toContain(section);
      expect(comp.productivityReportsSharedCollection).toContain(productivityReport);
      expect(comp.task).toEqual(task);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskFormService, 'getTask').mockReturnValue(task);
      jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTask).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskService.update).toHaveBeenCalledWith(expect.objectContaining(task));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskFormService, 'getTask').mockReturnValue({ id: null });
      jest.spyOn(taskService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTask).toHaveBeenCalled();
      expect(taskService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCategory', () => {
      it('Should forward to categoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(categoryService, 'compareCategory');
        comp.compareCategory(entity, entity2);
        expect(categoryService.compareCategory).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSection', () => {
      it('Should forward to sectionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sectionService, 'compareSection');
        comp.compareSection(entity, entity2);
        expect(sectionService.compareSection).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProductivityReport', () => {
      it('Should forward to productivityReportService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(productivityReportService, 'compareProductivityReport');
        comp.compareProductivityReport(entity, entity2);
        expect(productivityReportService.compareProductivityReport).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
