import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private isCollapsedState = signal(window.innerWidth <= 768); // Default: collapsed on mobile

  isCollapsed(): boolean {
    return this.isCollapsedState();
  }

  toggleSidebar(): void {
    this.isCollapsedState.update(state => !state);
  }
}
