import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ISection } from '../section.model';

@Component({
  standalone: true,
  selector: 'jhi-section-detail',
  templateUrl: './section-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SectionDetailComponent {
  section = input<ISection | null>(null);

  previousState(): void {
    window.history.back();
  }
}
