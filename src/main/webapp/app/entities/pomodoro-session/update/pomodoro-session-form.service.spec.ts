import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../pomodoro-session.test-samples';

import { PomodoroSessionFormService } from './pomodoro-session-form.service';

describe('PomodoroSession Form Service', () => {
  let service: PomodoroSessionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PomodoroSessionFormService);
  });

  describe('Service methods', () => {
    describe('createPomodoroSessionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPomodoroSessionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            start: expect.any(Object),
            end: expect.any(Object),
            duration: expect.any(Object),
            type: expect.any(Object),
            paused: expect.any(Object),
            observations: expect.any(Object),
          }),
        );
      });

      it('passing IPomodoroSession should create a new form with FormGroup', () => {
        const formGroup = service.createPomodoroSessionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            start: expect.any(Object),
            end: expect.any(Object),
            duration: expect.any(Object),
            type: expect.any(Object),
            paused: expect.any(Object),
            observations: expect.any(Object),
          }),
        );
      });
    });

    describe('getPomodoroSession', () => {
      it('should return NewPomodoroSession for default PomodoroSession initial value', () => {
        const formGroup = service.createPomodoroSessionFormGroup(sampleWithNewData);

        const pomodoroSession = service.getPomodoroSession(formGroup) as any;

        expect(pomodoroSession).toMatchObject(sampleWithNewData);
      });

      it('should return NewPomodoroSession for empty PomodoroSession initial value', () => {
        const formGroup = service.createPomodoroSessionFormGroup();

        const pomodoroSession = service.getPomodoroSession(formGroup) as any;

        expect(pomodoroSession).toMatchObject({});
      });

      it('should return IPomodoroSession', () => {
        const formGroup = service.createPomodoroSessionFormGroup(sampleWithRequiredData);

        const pomodoroSession = service.getPomodoroSession(formGroup) as any;

        expect(pomodoroSession).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPomodoroSession should not enable id FormControl', () => {
        const formGroup = service.createPomodoroSessionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPomodoroSession should disable id FormControl', () => {
        const formGroup = service.createPomodoroSessionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
