import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, interval } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPomodoroSession } from '../pomodoro-session.model';
import { PomodoroSessionService, EntityArrayResponseType } from '../service/pomodoro-session.service';
import { PomodoroSessionDeleteDialogComponent } from '../delete/pomodoro-session-delete-dialog.component';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { NgxDraggableDomModule } from 'ngx-draggable-dom';
import { tap } from 'rxjs/operators';

// Import your new service for history count
import { PomodoroService } from '../service/pomodoro.service';

export type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

@Component({
  standalone: true,
  selector: 'jhi-pomodoro-session',
  templateUrl: './pomodoro-session.component.html',
  styleUrls: ['../pomodoro-session.scss'],
  imports: [
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
    NgxDraggableDomModule,
  ],
})
export class PomodoroSessionComponent implements OnInit, OnDestroy {
  isLoading = false;
  subscription: Subscription | null = null;
  timerSubscription?: Subscription;

  pomodoroSessions?: IPomodoroSession[];
  sortState = sortStateSignal({});

  completedPomodoros = 0;
  showSettings = false;

  // NEW: history toggle and count
  showHistory = false;
  historyCount = 0;

  modeDurations: Record<PomodoroMode, number> = {
    pomodoro: 1500,
    shortBreak: 300,
    longBreak: 900,
  };

  currentMode: PomodoroMode = 'pomodoro';
  timerRunning = false;
  timeRemaining = this.modeDurations[this.currentMode];

  constructor(
    protected pomodoroSessionService: PomodoroSessionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    private pomodoroHistoryService: PomodoroService, // <-- inject history service
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('pomodoro-timer-state');
    if (saved) {
      const { timeRemaining, currentMode, completedPomodoros, timerRunning } = JSON.parse(saved);
      this.currentMode = currentMode;
      this.timeRemaining = timeRemaining;
      this.completedPomodoros = completedPomodoros;
      if (timerRunning) {
        this.startTimer(); // Automatically resume if it was running
      }
    } else {
      this.switchMode(this.currentMode);
    }
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
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
          this.saveTimerState(); // 👈 Save progress
        } else {
          this.pauseTimer();
          this.autoSwitchMode();
          this.startTimer();
        }
      });
      this.timerRunning = true;
      this.saveTimerState(); // 👈 Save immediately when starting
    }
  }
  saveTimerState(): void {
    localStorage.setItem(
      'pomodoro-timer-state',
      JSON.stringify({
        timeRemaining: this.timeRemaining,
        currentMode: this.currentMode,
        completedPomodoros: this.completedPomodoros,
        timestamp: Date.now(), // optional
        timerRunning: this.timerRunning,
      }),
    );
  }

  pauseTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.timerRunning = false;
  }

  resetTimer(): void {
    this.pauseTimer();
    this.timeRemaining = this.modeDurations[this.currentMode];
    this.saveTimerState();
  }

  skipSession(): void {
    this.pauseTimer();
    this.autoSwitchMode();
  }

  resetPomodoroCounter(): void {
    this.completedPomodoros = 0;
    this.saveTimerState();
  }

  autoSwitchMode(): void {
    if (this.currentMode === 'pomodoro') {
      this.completedPomodoros++;
      if (this.completedPomodoros % 4 === 0) {
        this.switchMode('longBreak');
      } else {
        this.switchMode('shortBreak');
      }
    } else {
      this.switchMode('pomodoro');
    }
  }

  updateDuration(mode: PomodoroMode, minutes: number): void {
    const seconds = Math.floor(minutes * 60);
    if (seconds > 0) {
      this.modeDurations[mode] = seconds;
      if (this.currentMode === mode) {
        this.resetTimer();
      }
    }
  }

  // NEW: toggle history view and fetch count

  delete(pomodoroSession: IPomodoroSession): void {
    const modalRef = this.modalService.open(PomodoroSessionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pomodoroSession = pomodoroSession;
    modalRef.closed.subscribe(reason => {
      if (reason === ITEM_DELETED_EVENT) {
        this.load();
      }
    });
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => this.onResponseSuccess(res),
    });
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    return this.pomodoroSessionService.query().pipe(tap(() => (this.isLoading = false)));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.pomodoroSessions = response.body ?? [];
  }
}
