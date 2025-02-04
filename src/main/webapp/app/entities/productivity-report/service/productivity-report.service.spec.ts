import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IProductivityReport } from '../productivity-report.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../productivity-report.test-samples';

import { ProductivityReportService, RestProductivityReport } from './productivity-report.service';

const requireRestSample: RestProductivityReport = {
  ...sampleWithRequiredData,
  timestamp: sampleWithRequiredData.timestamp?.toJSON(),
};

describe('ProductivityReport Service', () => {
  let service: ProductivityReportService;
  let httpMock: HttpTestingController;
  let expectedResult: IProductivityReport | IProductivityReport[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ProductivityReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ProductivityReport', () => {
      const productivityReport = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(productivityReport).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductivityReport', () => {
      const productivityReport = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(productivityReport).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductivityReport', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductivityReport', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProductivityReport', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProductivityReportToCollectionIfMissing', () => {
      it('should add a ProductivityReport to an empty array', () => {
        const productivityReport: IProductivityReport = sampleWithRequiredData;
        expectedResult = service.addProductivityReportToCollectionIfMissing([], productivityReport);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productivityReport);
      });

      it('should not add a ProductivityReport to an array that contains it', () => {
        const productivityReport: IProductivityReport = sampleWithRequiredData;
        const productivityReportCollection: IProductivityReport[] = [
          {
            ...productivityReport,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProductivityReportToCollectionIfMissing(productivityReportCollection, productivityReport);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductivityReport to an array that doesn't contain it", () => {
        const productivityReport: IProductivityReport = sampleWithRequiredData;
        const productivityReportCollection: IProductivityReport[] = [sampleWithPartialData];
        expectedResult = service.addProductivityReportToCollectionIfMissing(productivityReportCollection, productivityReport);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productivityReport);
      });

      it('should add only unique ProductivityReport to an array', () => {
        const productivityReportArray: IProductivityReport[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const productivityReportCollection: IProductivityReport[] = [sampleWithRequiredData];
        expectedResult = service.addProductivityReportToCollectionIfMissing(productivityReportCollection, ...productivityReportArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productivityReport: IProductivityReport = sampleWithRequiredData;
        const productivityReport2: IProductivityReport = sampleWithPartialData;
        expectedResult = service.addProductivityReportToCollectionIfMissing([], productivityReport, productivityReport2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productivityReport);
        expect(expectedResult).toContain(productivityReport2);
      });

      it('should accept null and undefined values', () => {
        const productivityReport: IProductivityReport = sampleWithRequiredData;
        expectedResult = service.addProductivityReportToCollectionIfMissing([], null, productivityReport, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productivityReport);
      });

      it('should return initial array if no ProductivityReport is added', () => {
        const productivityReportCollection: IProductivityReport[] = [sampleWithRequiredData];
        expectedResult = service.addProductivityReportToCollectionIfMissing(productivityReportCollection, undefined, null);
        expect(expectedResult).toEqual(productivityReportCollection);
      });
    });

    describe('compareProductivityReport', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProductivityReport(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProductivityReport(entity1, entity2);
        const compareResult2 = service.compareProductivityReport(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProductivityReport(entity1, entity2);
        const compareResult2 = service.compareProductivityReport(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProductivityReport(entity1, entity2);
        const compareResult2 = service.compareProductivityReport(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
