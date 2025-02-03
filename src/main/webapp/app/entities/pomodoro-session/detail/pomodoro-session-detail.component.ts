import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IPomodoroSession } from '../pomodoro-session.model';

@Component({
  standalone: true,
  selector: 'jhi-pomodoro-session-detail',
  templateUrl: './pomodoro-session-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PomodoroSessionDetailComponent {
  pomodoroSession = input<IPomodoroSession | null>(null);

  previousState(): void {
    window.history.back();
  }
}
