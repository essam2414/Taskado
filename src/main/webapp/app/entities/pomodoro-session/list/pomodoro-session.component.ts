import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import SharedModule from 'app/shared/shared.module';

type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

@Component({
  selector: 'jhi-pomodoro-session',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './pomodoro-session.component.html',
  styleUrls: ['./pomodoro-session.component.scss'],
})
export class PomodoroSessionComponent implements OnInit, OnDestroy {
  // Public properties
  modeDurations: Record<PomodoroMode, number> = {
    pomodoro: 1500,
    shortBreak: 300,
    longBreak: 900,
  };

  currentMode: PomodoroMode = 'pomodoro';
  timerRunning = false;
  timeRemaining = this.modeDurations[this.currentMode];

  // Private properties
  private timerSubscription?: Subscription;

  ngOnInit(): void {
    this.switchMode(this.currentMode);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeRemaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.timeRemaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  switchMode(mode: PomodoroMode): void {
    this.currentMode = mode;
    this.resetTimer();
  }

  startTimer(): void {
    if (!this.timerRunning) {
      this.timerSubscription = interval(1000).subscribe(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          this.pauseTimer();
          // Optional: Auto-switch logic
        }
      });
      this.timerRunning = true;
    }
  }

  pauseTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.timerRunning = false;
  }

  resetTimer(): void {
    this.pauseTimer();
    this.timeRemaining = this.modeDurations[this.currentMode];
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
