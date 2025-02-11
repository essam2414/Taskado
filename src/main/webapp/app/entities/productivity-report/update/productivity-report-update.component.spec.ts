import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ProductivityReportService } from '../service/productivity-report.service';
import { IProductivityReport } from '../productivity-report.model';
import { ProductivityReportFormService } from './productivity-report-form.service';

import { ProductivityReportUpdateComponent } from './productivity-report-update.component';

describe('ProductivityReport Management Update Component', () => {
  let comp: ProductivityReportUpdateComponent;
  let fixture: ComponentFixture<ProductivityReportUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productivityReportFormService: ProductivityReportFormService;
  let productivityReportService: ProductivityReportService;
  let userService: UserService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const productivityReport: IProductivityReport = { id: 456 };
      const user: IUser = { id: 2761 };
      productivityReport.user = user;

      const userCollection: IUser[] = [{ id: 6385 }];
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

    it('Should update editForm', () => {
      const productivityReport: IProductivityReport = { id: 456 };
      const user: IUser = { id: 25391 };
      productivityReport.user = user;

      activatedRoute.data = of({ productivityReport });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
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
  });
});
