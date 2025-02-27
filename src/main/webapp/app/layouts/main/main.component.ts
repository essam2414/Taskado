import { Component, OnInit, inject, Renderer2 } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarService } from 'app/layouts/sidebar/sidebar.service';
import FooterComponent from '../footer/footer.component';
import PageRibbonComponent from '../profiles/page-ribbon.component';

@Component({
  standalone: true,
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  providers: [AppPageTitleStrategy],
  imports: [RouterOutlet, SidebarComponent, FooterComponent, PageRibbonComponent],
  styleUrls: ['./main.component.scss'],
})
export default class MainComponent implements OnInit {
  account = inject(AccountService).trackCurrentAccount();

  public readonly sidebarService = inject(SidebarService);

  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);

  private readonly appPageTitleStrategy = inject(AppPageTitleStrategy);
  private readonly accountService = inject(AccountService);

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    // Change background on landing page
    this.router.events.subscribe(() => {
      if (this.router.url === '/') {
        this.renderer.addClass(document.body, 'landing-bg');
      } else {
        this.renderer.removeClass(document.body, 'landing-bg');
      }
    });
  }
}
