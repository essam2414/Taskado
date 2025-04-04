import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { TaskWidgetComponent } from './widgets/task-widget/task-widget.component';

@Component({
  standalone: true,
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class DashboardComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);
  isGuest = false;

  greetingMessage = '';
  currentDate = '';

  widgets = [
    { id: 'task', title: 'Todays Tasks', component: TaskWidgetComponent, size: 'large', link: '/task' },
    { id: 'notification', title: 'Notifications', size: 'tall', link: '/notification' },
    { id: 'habit', title: 'Habits', size: 'medium', link: '/habit' },
    { id: 'event', title: 'Upcoming Events', size: 'large', link: '/event' },
    { id: 'note', title: 'Recent Notes', size: 'tall', link: '/note' },
    { id: 'productivity-report', title: 'Productivity Insights', size: 'large', link: '/productivity-report' },
    { id: 'pomodoro-session', title: 'Focus Timer', size: 'small', link: '/pomodoro-session' },
  ];

  private readonly destroy$ = new Subject<void>();
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));
    this.isGuest = sessionStorage.getItem('guest') === 'true';
    this.setGreeting();
    this.setCurrentDate();
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.widgets, event.previousIndex, event.currentIndex);
  }

  setGreeting(): void {
    const hour = new Date().getHours();
    const firstName = this.account()?.firstName ?? 'there'; // Fallback if no name is available

    if (hour >= 5 && hour < 12) {
      this.greetingMessage = `Good morning, ${firstName} 👋`;
    } else if (hour >= 12 && hour < 17) {
      this.greetingMessage = `Good afternoon, ${firstName} 👋`;
    } else if (hour >= 17 && hour < 22) {
      this.greetingMessage = `Good evening, ${firstName} 🌙`;
    } else if (hour >= 22 || hour < 2) {
      this.greetingMessage = `Night owl mode activated, ${firstName}! 🦉`;
    } else {
      this.greetingMessage = `Still up, ${firstName}? Time to recharge soon! 🔋`;
    }
  }

  setCurrentDate(): void {
    const today = new Date();
    const weekday = today.toLocaleDateString('en-GB', { weekday: 'long' });
    const day = today.getDate();
    const month = today.toLocaleDateString('en-GB', { month: 'long' });
    const year = today.getFullYear();

    this.currentDate = `Today is ${weekday}, ${day}${this.getOrdinalSuffix(day)} ${month} ${year}.`;
  }

  getOrdinalSuffix(day: number): string {
    return ['st', 'nd', 'rd'][(day % 10) - 1] && ![11, 12, 13].includes(day) ? ['st', 'nd', 'rd'][(day % 10) - 1] : 'th';
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
