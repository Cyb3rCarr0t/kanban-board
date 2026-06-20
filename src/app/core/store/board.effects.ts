import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BoardActions } from './board.actions';
import { TaskService } from '../services/task.service';

/**
 * BoardEffects
 *
 * Currently wires up loadBoard to the TaskService.
 * As you add a real API, expand switchMap bodies here —
 * the rest of the store stays untouched (that's the point of effects).
 */
@Injectable()
export class BoardEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  loadBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.loadBoard),
      switchMap(() =>
        this.taskService.getTasks().pipe(
          map(tasks => BoardActions.loadBoardSuccess({ tasks })),
          catchError(err => of(BoardActions.loadBoardFailure({ error: err.message ?? 'Unknown error' })))
        )
      )
    )
  );
}
