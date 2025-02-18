import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITaskCategory } from '../task-category.model';

@Component({
  standalone: true,
  selector: 'jhi-task-category-detail',
  templateUrl: './task-category-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TaskCategoryDetailComponent {
  taskCategory = input<ITaskCategory | null>(null);

  previousState(): void {
    window.history.back();
  }
}
