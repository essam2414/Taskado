import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { GoalService } from '../service/goal.service';
import { IGoal } from '../goal.model';
import { GoalFormService } from './goal-form.service';

import { GoalUpdateComponent } from './goal-update.component';

describe('Goal Management Update Component', () => {
  let comp: GoalUpdateComponent;
  let fixture: ComponentFixture<GoalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let goalFormService: GoalFormService;
  let goalService: GoalService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GoalUpdateComponent],
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
      .overrideTemplate(GoalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GoalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    goalFormService = TestBed.inject(GoalFormService);
    goalService = TestBed.inject(GoalService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const goal: IGoal = { id: 456 };
      const user: IUser = { id: 3801 };
      goal.user = user;

      const userCollection: IUser[] = [{ id: 7008 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ goal });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const goal: IGoal = { id: 456 };
      const user: IUser = { id: 19017 };
      goal.user = user;

      activatedRoute.data = of({ goal });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.goal).toEqual(goal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGoal>>();
      const goal = { id: 123 };
      jest.spyOn(goalFormService, 'getGoal').mockReturnValue(goal);
      jest.spyOn(goalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ goal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: goal }));
      saveSubject.complete();

      // THEN
      expect(goalFormService.getGoal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(goalService.update).toHaveBeenCalledWith(expect.objectContaining(goal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGoal>>();
      const goal = { id: 123 };
      jest.spyOn(goalFormService, 'getGoal').mockReturnValue({ id: null });
      jest.spyOn(goalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ goal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: goal }));
      saveSubject.complete();

      // THEN
      expect(goalFormService.getGoal).toHaveBeenCalled();
      expect(goalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGoal>>();
      const goal = { id: 123 };
      jest.spyOn(goalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ goal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(goalService.update).toHaveBeenCalled();
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
