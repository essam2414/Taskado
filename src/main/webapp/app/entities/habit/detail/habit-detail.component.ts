import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IHabit } from '../habit.model';

@Component({
  standalone: true,
  selector: 'jhi-habit-detail',
  templateUrl: './habit-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class HabitDetailComponent {
  habit = input<IHabit | null>(null);

  previousState(): void {
    window.history.back();
  }
}
