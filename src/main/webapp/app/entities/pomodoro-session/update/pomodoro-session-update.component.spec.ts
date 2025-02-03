import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const pomodoroSession: IPomodoroSession = { id: 456 };

      activatedRoute.data = of({ pomodoroSession });
      comp.ngOnInit();

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
});
