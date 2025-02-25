import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private isCollapsedState = signal(false); // Default: sidebar open

  isCollapsed(): boolean {
    return this.isCollapsedState();
  }

  toggleSidebar(): void {
    this.isCollapsedState.update(state => !state);
  }
}
