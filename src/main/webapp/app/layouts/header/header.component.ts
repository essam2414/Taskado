import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VERSION } from 'app/app.constants';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'jhi-header',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  version = '';
  sidebarOpen = false;
  activeSection = 'hero';

  private readonly router = inject(Router);

  constructor() {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    window.addEventListener('sectionChange', (e: any) => {
      this.activeSection = e.detail;
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setActive(section: string): void {
    this.activeSection = section;
    this.toggleSidebar();
  }
}
