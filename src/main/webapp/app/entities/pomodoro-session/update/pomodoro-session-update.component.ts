import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PomodoroType } from 'app/entities/enumerations/pomodoro-type.model';
import { IPomodoroSession } from '../pomodoro-session.model';
import { PomodoroSessionService } from '../service/pomodoro-session.service';
import { PomodoroSessionFormGroup, PomodoroSessionFormService } from './pomodoro-session-form.service';

@Component({
  standalone: true,
  selector: 'jhi-pomodoro-session-update',
  templateUrl: './pomodoro-session-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PomodoroSessionUpdateComponent implements OnInit {
  isSaving = false;
  pomodoroSession: IPomodoroSession | null = null;
  pomodoroTypeValues = Object.keys(PomodoroType);

  protected pomodoroSessionService = inject(PomodoroSessionService);
  protected pomodoroSessionFormService = inject(PomodoroSessionFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PomodoroSessionFormGroup = this.pomodoroSessionFormService.createPomodoroSessionFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pomodoroSession }) => {
      this.pomodoroSession = pomodoroSession;
      if (pomodoroSession) {
        this.updateForm(pomodoroSession);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pomodoroSession = this.pomodoroSessionFormService.getPomodoroSession(this.editForm);
    if (pomodoroSession.id !== null) {
      this.subscribeToSaveResponse(this.pomodoroSessionService.update(pomodoroSession));
    } else {
      this.subscribeToSaveResponse(this.pomodoroSessionService.create(pomodoroSession));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPomodoroSession>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pomodoroSession: IPomodoroSession): void {
    this.pomodoroSession = pomodoroSession;
    this.pomodoroSessionFormService.resetForm(this.editForm, pomodoroSession);
  }
}
