import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoardState, Task } from '../models/task.model';

// ── Feature selector ───────────────────────────────────────────────────────

export const selectBoardState = createFeatureSelector<BoardState>('board');

// ── Base selectors ─────────────────────────────────────────────────────────

export const selectAllTasks      = createSelector(selectBoardState, s => s.tasks);
export const selectColumns       = createSelector(selectBoardState, s => s.columns);
export const selectUsers         = createSelector(selectBoardState, s => s.users);
export const selectSelectedId    = createSelector(selectBoardState, s => s.selectedTaskId);
export const selectIsModalOpen   = createSelector(selectBoardState, s => s.isModalOpen);
export const selectSearchQuery   = createSelector(selectBoardState, s => s.searchQuery);
export const selectPriorityFilter= createSelector(selectBoardState, s => s.filterPriority);
export const selectAssigneeFilter= createSelector(selectBoardState, s => s.filterAssigneeId);

// ── Derived selectors ──────────────────────────────────────────────────────

/** Tasks as array */
export const selectTasksArray = createSelector(
  selectAllTasks,
  tasks => Object.values(tasks)
);

/** Active (non-done) tasks count */
export const selectActiveCount = createSelector(
  selectTasksArray,
  tasks => tasks.filter(t => t.status !== 'done').length
);

/** In-progress count */
export const selectInProgressCount = createSelector(
  selectTasksArray,
  tasks => tasks.filter(t => t.status === 'in-progress').length
);

/** Done count */
export const selectDoneCount = createSelector(
  selectTasksArray,
  tasks => tasks.filter(t => t.status === 'done').length
);

/** Currently selected task */
export const selectSelectedTask = createSelector(
  selectAllTasks, selectSelectedId,
  (tasks, id) => (id ? tasks[id] ?? null : null)
);

/** Columns enriched with filtered, ordered task objects */
export const selectFilteredColumns = createSelector(
  selectColumns, selectAllTasks,
  selectSearchQuery, selectPriorityFilter, selectAssigneeFilter,
  (columns, tasks, query, priority, assigneeId) => {
    const q = query.trim().toLowerCase();

    const matchesFilter = (t: Task): boolean => {
      if (priority   && t.priority   !== priority)   return false;
      if (assigneeId && t.assigneeId !== assigneeId) return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
      return true;
    };

    return columns.map(col => ({
      ...col,
      tasks: col.taskIds
        .map(id => tasks[id])
        .filter((t): t is Task => !!t && matchesFilter(t)),
    }));
  }
);

/** User lookup map */
export const selectUserMap = createSelector(
  selectUsers,
  users => new Map(users.map(u => [u.id, u]))
);

/** Has any active filter */
export const selectHasActiveFilter = createSelector(
  selectSearchQuery, selectPriorityFilter, selectAssigneeFilter,
  (q, p, a) => !!q || !!p || !!a
);
