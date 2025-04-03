import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserPreferencesDetailComponent } from './user-preferences-detail.component';

describe('UserPreferences Management Detail Component', () => {
  let comp: UserPreferencesDetailComponent;
  let fixture: ComponentFixture<UserPreferencesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPreferencesDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./user-preferences-detail.component').then(m => m.UserPreferencesDetailComponent),
              resolve: { userPreferences: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(UserPreferencesDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userPreferences on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', UserPreferencesDetailComponent);

      // THEN
      expect(instance.userPreferences()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
