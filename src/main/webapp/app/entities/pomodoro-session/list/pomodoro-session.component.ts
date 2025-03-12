import { Component, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap, interval } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IPomodoroSession } from '../pomodoro-session.model';
import { EntityArrayResponseType, PomodoroSessionService } from '../service/pomodoro-session.service';
import { PomodoroSessionDeleteDialogComponent } from '../delete/pomodoro-session-delete-dialog.component';
import { NgxDraggableDomModule } from 'ngx-draggable-dom';

export type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

@Component({
  standalone: true,
  selector: 'jhi-pomodoro-session',
  templateUrl: './pomodoro-session.component.html',
  styleUrls: ['../pomodoro-session.scss'],
  imports: [
    RouterModule,
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
  subscription: Subscription | null = null;
  pomodoroSessions?: IPomodoroSession[];
  isLoading = false;

  sortState = sortStateSignal({});

  showSettings = false;
  completedPomodoros = 0;
  modeDurations: Record<PomodoroMode, number> = {
    pomodoro: 1500,
    shortBreak: 300,
    longBreak: 900,
  };

  currentMode: PomodoroMode = 'pomodoro';
  timerRunning = false;
  timeRemaining = this.modeDurations[this.currentMode];

  public readonly router = inject(Router);
  protected readonly pomodoroSessionService = inject(PomodoroSessionService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  private timerSubscription?: Subscription;

  trackId = (item: IPomodoroSession): number => this.pomodoroSessionService.getPomodoroSessionIdentifier(item);

  ngOnInit(): void {
    this.switchMode(this.currentMode);
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
        } else {
          this.pauseTimer();
          this.autoSwitchMode();
          this.startTimer();
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

  resetPomodoroCounter(): void {
    this.completedPomodoros = 0;
  }

  skipSession(): void {
    this.pauseTimer();
    this.autoSwitchMode();
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

  delete(pomodoroSession: IPomodoroSession): void {
    const modalRef = this.modalService.open(PomodoroSessionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pomodoroSession = pomodoroSession;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.pomodoroSessions = this.refineData(dataFromBody);
  }

  protected refineData(data: IPomodoroSession[]): IPomodoroSession[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IPomodoroSession[] | null): IPomodoroSession[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.pomodoroSessionService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
