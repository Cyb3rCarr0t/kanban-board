import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { MOCK_TASKS } from '../models/mock-data';

/**
 * TaskService
 *
 * Phase 1: Returns mock data with a simulated network delay.
 * Phase 3: Replace the `of(...)` calls with `this.http.get<Task[]>(...)` etc.
 *          Inject HttpClient and point to your real API URL.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  /** GET /tasks */
  getTasks(): Observable<Task[]> {
    return of([...MOCK_TASKS]).pipe(delay(300));
  }

  /** POST /tasks — placeholder for Phase 3 */
  createTask(task: Task): Observable<Task> {
    return of(task).pipe(delay(200));
  }

  /** PUT /tasks/:id — placeholder for Phase 3 */
  updateTask(task: Task): Observable<Task> {
    return of(task).pipe(delay(200));
  }

  /** DELETE /tasks/:id — placeholder for Phase 3 */
  deleteTask(id: string): Observable<void> {
    return of(undefined as void).pipe(delay(200));
  }
}
