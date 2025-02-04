import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const productivityReport: IProductivityReport = { id: 456 };

      activatedRoute.data = of({ productivityReport });
      comp.ngOnInit();

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
});
