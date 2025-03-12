import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPomodoroSession } from '../pomodoro-session.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../pomodoro-session.test-samples';

import { PomodoroSessionService, RestPomodoroSession } from './pomodoro-session.service';

const requireRestSample: RestPomodoroSession = {
  ...sampleWithRequiredData,
  startTime: sampleWithRequiredData.startTime?.toJSON(),
  endTime: sampleWithRequiredData.endTime?.toJSON(),
};

describe('PomodoroSession Service', () => {
  let service: PomodoroSessionService;
  let httpMock: HttpTestingController;
  let expectedResult: IPomodoroSession | IPomodoroSession[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PomodoroSessionService);
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

    it('should create a PomodoroSession', () => {
      const pomodoroSession = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pomodoroSession).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PomodoroSession', () => {
      const pomodoroSession = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pomodoroSession).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PomodoroSession', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PomodoroSession', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PomodoroSession', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPomodoroSessionToCollectionIfMissing', () => {
      it('should add a PomodoroSession to an empty array', () => {
        const pomodoroSession: IPomodoroSession = sampleWithRequiredData;
        expectedResult = service.addPomodoroSessionToCollectionIfMissing([], pomodoroSession);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pomodoroSession);
      });

      it('should not add a PomodoroSession to an array that contains it', () => {
        const pomodoroSession: IPomodoroSession = sampleWithRequiredData;
        const pomodoroSessionCollection: IPomodoroSession[] = [
          {
            ...pomodoroSession,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPomodoroSessionToCollectionIfMissing(pomodoroSessionCollection, pomodoroSession);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PomodoroSession to an array that doesn't contain it", () => {
        const pomodoroSession: IPomodoroSession = sampleWithRequiredData;
        const pomodoroSessionCollection: IPomodoroSession[] = [sampleWithPartialData];
        expectedResult = service.addPomodoroSessionToCollectionIfMissing(pomodoroSessionCollection, pomodoroSession);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pomodoroSession);
      });

      it('should add only unique PomodoroSession to an array', () => {
        const pomodoroSessionArray: IPomodoroSession[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pomodoroSessionCollection: IPomodoroSession[] = [sampleWithRequiredData];
        expectedResult = service.addPomodoroSessionToCollectionIfMissing(pomodoroSessionCollection, ...pomodoroSessionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pomodoroSession: IPomodoroSession = sampleWithRequiredData;
        const pomodoroSession2: IPomodoroSession = sampleWithPartialData;
        expectedResult = service.addPomodoroSessionToCollectionIfMissing([], pomodoroSession, pomodoroSession2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pomodoroSession);
        expect(expectedResult).toContain(pomodoroSession2);
      });

      it('should accept null and undefined values', () => {
        const pomodoroSession: IPomodoroSession = sampleWithRequiredData;
        expectedResult = service.addPomodoroSessionToCollectionIfMissing([], null, pomodoroSession, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pomodoroSession);
      });

      it('should return initial array if no PomodoroSession is added', () => {
        const pomodoroSessionCollection: IPomodoroSession[] = [sampleWithRequiredData];
        expectedResult = service.addPomodoroSessionToCollectionIfMissing(pomodoroSessionCollection, undefined, null);
        expect(expectedResult).toEqual(pomodoroSessionCollection);
      });
    });

    describe('comparePomodoroSession', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePomodoroSession(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePomodoroSession(entity1, entity2);
        const compareResult2 = service.comparePomodoroSession(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePomodoroSession(entity1, entity2);
        const compareResult2 = service.comparePomodoroSession(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePomodoroSession(entity1, entity2);
        const compareResult2 = service.comparePomodoroSession(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
