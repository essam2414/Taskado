import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { UserPreferencesService } from '../service/user-preferences.service';
import { IUserPreferences } from '../user-preferences.model';
import { UserPreferencesFormService } from './user-preferences-form.service';

import { UserPreferencesUpdateComponent } from './user-preferences-update.component';

describe('UserPreferences Management Update Component', () => {
  let comp: UserPreferencesUpdateComponent;
  let fixture: ComponentFixture<UserPreferencesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userPreferencesFormService: UserPreferencesFormService;
  let userPreferencesService: UserPreferencesService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserPreferencesUpdateComponent],
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
      .overrideTemplate(UserPreferencesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserPreferencesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userPreferencesFormService = TestBed.inject(UserPreferencesFormService);
    userPreferencesService = TestBed.inject(UserPreferencesService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userPreferences: IUserPreferences = { id: 456 };
      const user: IUser = { id: 884 };
      userPreferences.user = user;

      const userCollection: IUser[] = [{ id: 31165 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userPreferences });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userPreferences: IUserPreferences = { id: 456 };
      const user: IUser = { id: 7782 };
      userPreferences.user = user;

      activatedRoute.data = of({ userPreferences });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.userPreferences).toEqual(userPreferences);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPreferences>>();
      const userPreferences = { id: 123 };
      jest.spyOn(userPreferencesFormService, 'getUserPreferences').mockReturnValue(userPreferences);
      jest.spyOn(userPreferencesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPreferences });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPreferences }));
      saveSubject.complete();

      // THEN
      expect(userPreferencesFormService.getUserPreferences).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userPreferencesService.update).toHaveBeenCalledWith(expect.objectContaining(userPreferences));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPreferences>>();
      const userPreferences = { id: 123 };
      jest.spyOn(userPreferencesFormService, 'getUserPreferences').mockReturnValue({ id: null });
      jest.spyOn(userPreferencesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPreferences: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPreferences }));
      saveSubject.complete();

      // THEN
      expect(userPreferencesFormService.getUserPreferences).toHaveBeenCalled();
      expect(userPreferencesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPreferences>>();
      const userPreferences = { id: 123 };
      jest.spyOn(userPreferencesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPreferences });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userPreferencesService.update).toHaveBeenCalled();
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
