import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IUserPreferences } from '../user-preferences.model';

@Component({
  standalone: true,
  selector: 'jhi-user-preferences-detail',
  templateUrl: './user-preferences-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class UserPreferencesDetailComponent {
  userPreferences = input<IUserPreferences | null>(null);

  previousState(): void {
    window.history.back();
  }
}
