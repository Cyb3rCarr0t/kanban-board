import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task, TaskStatus, TaskPriority, CreateTaskDto, UpdateTaskDto } from '../models/task.model';

// ── Board actions ──────────────────────────────────────────────────────────
export const BoardActions = createActionGroup({
  source: 'Board',
  events: {
    // Initialisation
    'Load Board':         emptyProps(),
    'Load Board Success': props<{ tasks: Task[] }>(),
    'Load Board Failure': props<{ error: string }>(),

    // Task CRUD
    'Add Task':    props<{ dto: CreateTaskDto }>(),
    'Update Task': props<{ id: string; changes: UpdateTaskDto }>(),
    'Delete Task': props<{ id: string }>(),

    // Drag & drop column move
    'Move Task': props<{
      taskId: string;
      fromStatus: TaskStatus;
      toStatus: TaskStatus;
      newIndex: number;
    }>(),

    // Reorder within the same column
    'Reorder Task': props<{
      status: TaskStatus;
      previousIndex: number;
      currentIndex: number;
    }>(),

    // Modal
    'Open Task Modal':  props<{ taskId: string | null }>(),
    'Close Task Modal': emptyProps(),

    // Filters
    'Set Search Query':      props<{ query: string }>(),
    'Set Priority Filter':   props<{ priority: TaskPriority | null }>(),
    'Set Assignee Filter':   props<{ assigneeId: string | null }>(),
    'Clear Filters':         emptyProps(),
  },
});
