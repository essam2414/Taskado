import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { PomodoroSessionService } from '../service/pomodoro-session.service';
import { IPomodoroSession } from '../pomodoro-session.model';
import { PomodoroSessionFormService } from './pomodoro-session-form.service';

import { PomodoroSessionUpdateComponent } from './pomodoro-session-update.component';

describe('PomodoroSession Management Update Component', () => {
  let comp: PomodoroSessionUpdateComponent;
  let fixture: ComponentFixture<PomodoroSessionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pomodoroSessionFormService: PomodoroSessionFormService;
  let pomodoroSessionService: PomodoroSessionService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PomodoroSessionUpdateComponent],
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
      .overrideTemplate(PomodoroSessionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PomodoroSessionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pomodoroSessionFormService = TestBed.inject(PomodoroSessionFormService);
    pomodoroSessionService = TestBed.inject(PomodoroSessionService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const pomodoroSession: IPomodoroSession = { id: 456 };
      const user: IUser = { id: 19038 };
      pomodoroSession.user = user;

      const userCollection: IUser[] = [{ id: 6026 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pomodoroSession });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pomodoroSession: IPomodoroSession = { id: 456 };
      const user: IUser = { id: 19075 };
      pomodoroSession.user = user;

      activatedRoute.data = of({ pomodoroSession });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.pomodoroSession).toEqual(pomodoroSession);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPomodoroSession>>();
      const pomodoroSession = { id: 123 };
      jest.spyOn(pomodoroSessionFormService, 'getPomodoroSession').mockReturnValue(pomodoroSession);
      jest.spyOn(pomodoroSessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pomodoroSession });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pomodoroSession }));
      saveSubject.complete();

      // THEN
      expect(pomodoroSessionFormService.getPomodoroSession).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pomodoroSessionService.update).toHaveBeenCalledWith(expect.objectContaining(pomodoroSession));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPomodoroSession>>();
      const pomodoroSession = { id: 123 };
      jest.spyOn(pomodoroSessionFormService, 'getPomodoroSession').mockReturnValue({ id: null });
      jest.spyOn(pomodoroSessionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pomodoroSession: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pomodoroSession }));
      saveSubject.complete();

      // THEN
      expect(pomodoroSessionFormService.getPomodoroSession).toHaveBeenCalled();
      expect(pomodoroSessionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPomodoroSession>>();
      const pomodoroSession = { id: 123 };
      jest.spyOn(pomodoroSessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pomodoroSession });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pomodoroSessionService.update).toHaveBeenCalled();
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
