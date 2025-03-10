import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';
import { PomodoroSessionComponent } from './list/pomodoro-session.component';

@NgModule({
  imports: [CommonModule, SharedModule, RouterModule],
  declarations: [PomodoroSessionComponent],
  exports: [PomodoroSessionComponent],
})
export class PomodoroSessionModule {}
