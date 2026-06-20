import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'board',
    pathMatch: 'full',
  },
  {
    path: 'board',
    loadChildren: () =>
      import('./features/board/board.routes').then(m => m.BOARD_ROUTES),
  },
  // Phase 2: add dashboard route here
  // {
  //   path: 'dashboard',
  //   loadChildren: () =>
  //     import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  // },
  {
    path: '**',
    redirectTo: 'board',
  },
];
