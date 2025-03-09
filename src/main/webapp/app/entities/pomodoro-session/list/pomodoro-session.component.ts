import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-pomodoro-session',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './pomodoro-session.component.html',
  styleUrls: ['./pomodoro-session.component.scss'],
})
export class PomodoroSessionComponent implements OnInit, OnDestroy {
  timeRemaining: number;
  timerRunning = false;

  private readonly timerDuration = 1500; // 25 mins
  private timerSubscription?: Subscription;

  constructor() {
    // Initialize dependent variable inside the constructor
    this.timeRemaining = this.timerDuration;
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeRemaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.timeRemaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  ngOnInit(): void {
    this.resetTimer();
  }

  startTimer(): void {
    if (!this.timerRunning) {
      this.timerSubscription = interval(1000).subscribe(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          this.pauseTimer();
          // Optional: handle timer completion
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
    this.timeRemaining = this.timerDuration;
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
