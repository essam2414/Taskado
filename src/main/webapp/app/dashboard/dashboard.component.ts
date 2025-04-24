import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserPreferencesService } from 'app/entities/user-preferences/service/user-preferences.service';

import { Widget } from './widgets/widgets.component';

@Component({
  standalone: true,
  selector: 'jhi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class DashboardComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  greetingMessage = '';
  currentDate = '';

  visibleWidgets: Widget[] = [];

  private readonly destroy$ = new Subject<void>();
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly userPreferencesService = inject(UserPreferencesService);

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));
    this.setGreeting();
    this.setCurrentDate();

    this.userPreferencesService.getOrCreateAndApply().then(prefs => {
      this.visibleWidgets = this.userPreferencesService.visibleWidgets;
    });
  }

  goToDashboardSettings(): void {
    this.router.navigate(['/account/settings'], { queryParams: { tab: 'dashboard' } });
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.visibleWidgets, event.previousIndex, event.currentIndex);
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
