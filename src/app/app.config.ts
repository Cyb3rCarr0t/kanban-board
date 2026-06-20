import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { boardReducer } from './core/store/board.reducer';
import { BoardEffects } from './core/store/board.effects';
import { routes } from './app.routes';
import { isDevMode } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Use Zone.js-based change detection (familiar from Angular 10)
    // Remove this and use provideExperimentalZonelessChangeDetection()
    // when you're ready to go fully Signals-based (Phase 4)
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),
    provideHttpClient(),

    // NgRx Store — 'board' is the feature key used in selectors
    provideStore({ board: boardReducer }),
    provideEffects([BoardEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
  ],
};
