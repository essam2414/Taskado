import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { HabitService } from '../service/habit.service';
import { IHabit } from '../habit.model';
import { HabitFormService } from './habit-form.service';

import { HabitUpdateComponent } from './habit-update.component';

describe('Habit Management Update Component', () => {
  let comp: HabitUpdateComponent;
  let fixture: ComponentFixture<HabitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let habitFormService: HabitFormService;
  let habitService: HabitService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HabitUpdateComponent],
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
      .overrideTemplate(HabitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HabitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    habitFormService = TestBed.inject(HabitFormService);
    habitService = TestBed.inject(HabitService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const habit: IHabit = { id: 456 };
      const user: IUser = { id: 6088 };
      habit.user = user;

      const userCollection: IUser[] = [{ id: 12245 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ habit });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const habit: IHabit = { id: 456 };
      const user: IUser = { id: 2793 };
      habit.user = user;

      activatedRoute.data = of({ habit });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.habit).toEqual(habit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabit>>();
      const habit = { id: 123 };
      jest.spyOn(habitFormService, 'getHabit').mockReturnValue(habit);
      jest.spyOn(habitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: habit }));
      saveSubject.complete();

      // THEN
      expect(habitFormService.getHabit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(habitService.update).toHaveBeenCalledWith(expect.objectContaining(habit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabit>>();
      const habit = { id: 123 };
      jest.spyOn(habitFormService, 'getHabit').mockReturnValue({ id: null });
      jest.spyOn(habitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: habit }));
      saveSubject.complete();

      // THEN
      expect(habitFormService.getHabit).toHaveBeenCalled();
      expect(habitService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHabit>>();
      const habit = { id: 123 };
      jest.spyOn(habitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ habit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(habitService.update).toHaveBeenCalled();
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
