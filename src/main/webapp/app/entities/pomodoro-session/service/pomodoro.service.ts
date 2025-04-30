import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class PomodoroService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  // Base URL for Pomodoro-related endpoints
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pomodoro');

  /**
   * Fetches the total count of completed Pomodoro sessions from the server.
   * Expects the backend endpoint GET /api/pomodoro/completed-count to return a plain number.
   */
  getCompletedSessionsCount(): Observable<number> {
    return this.http.get<number>(`${this.resourceUrl}/completed-count`);
  }
}
