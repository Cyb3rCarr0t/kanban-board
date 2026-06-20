import { createReducer, on } from '@ngrx/store';
import { BoardState, Column } from '../models/task.model';
import { BoardActions } from './board.actions';
import { MOCK_USERS, MOCK_TASKS, INITIAL_COLUMNS } from '../models/mock-data';

// ── Initial State ──────────────────────────────────────────────────────────

function tasksToRecord(tasks: typeof MOCK_TASKS) {
  return tasks.reduce((acc, t) => ({ ...acc, [t.id]: t }), {} as BoardState['tasks']);
}

export const initialBoardState: BoardState = {
  tasks: tasksToRecord(MOCK_TASKS),
  columns: INITIAL_COLUMNS,
  users: MOCK_USERS,
  selectedTaskId: null,
  isModalOpen: false,
  filterPriority: null,
  filterAssigneeId: null,
  searchQuery: '',
};

// ── Helper ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return 't' + Math.random().toString(36).slice(2, 9);
}

function now(): string {
  return new Date().toISOString();
}

// ── Reducer ────────────────────────────────────────────────────────────────

export const boardReducer = createReducer(
  initialBoardState,

  // Load
  on(BoardActions.loadBoardSuccess, (state, { tasks }) => ({
    ...state,
    tasks: tasksToRecord(tasks),
  })),

  // Add task
  on(BoardActions.addTask, (state, { dto }) => {
    const id = generateId();
    const task = { ...dto, id, createdAt: now(), updatedAt: now() };
    const columns = state.columns.map(col =>
      col.id === dto.status
        ? { ...col, taskIds: [...col.taskIds, id] }
        : col
    );
    return { ...state, tasks: { ...state.tasks, [id]: task }, columns };
  }),

  // Update task
  on(BoardActions.updateTask, (state, { id, changes }) => {
    const existing = state.tasks[id];
    if (!existing) return state;

    const updated = { ...existing, ...changes, updatedAt: now() };
    let columns = state.columns;

    // If status changed, move between columns
    if (changes.status && changes.status !== existing.status) {
      columns = state.columns.map(col => {
        if (col.id === existing.status) {
          return { ...col, taskIds: col.taskIds.filter(tid => tid !== id) };
        }
        if (col.id === changes.status) {
          return { ...col, taskIds: [...col.taskIds, id] };
        }
        return col;
      });
    }

    return { ...state, tasks: { ...state.tasks, [id]: updated }, columns };
  }),

  // Delete task
  on(BoardActions.deleteTask, (state, { id }) => {
    const { [id]: _removed, ...remainingTasks } = state.tasks;
    const columns = state.columns.map(col => ({
      ...col,
      taskIds: col.taskIds.filter(tid => tid !== id),
    }));
    return { ...state, tasks: remainingTasks, columns };
  }),

  // Move task between columns (drag & drop)
  on(BoardActions.moveTask, (state, { taskId, fromStatus, toStatus, newIndex }) => {
    const task = state.tasks[taskId];
    if (!task) return state;

    const updatedTask = { ...task, status: toStatus, updatedAt: now() };

    const columns: Column[] = state.columns.map(col => {
      if (col.id === fromStatus) {
        return { ...col, taskIds: col.taskIds.filter(id => id !== taskId) };
      }
      if (col.id === toStatus) {
        const ids = col.taskIds.filter(id => id !== taskId);
        ids.splice(newIndex, 0, taskId);
        return { ...col, taskIds: ids };
      }
      return col;
    });

    return {
      ...state,
      tasks: { ...state.tasks, [taskId]: updatedTask },
      columns,
    };
  }),

  // Reorder within same column
  on(BoardActions.reorderTask, (state, { status, previousIndex, currentIndex }) => {
    const columns = state.columns.map(col => {
      if (col.id !== status) return col;
      const ids = [...col.taskIds];
      const [moved] = ids.splice(previousIndex, 1);
      ids.splice(currentIndex, 0, moved);
      return { ...col, taskIds: ids };
    });
    return { ...state, columns };
  }),

  // Modal
  on(BoardActions.openTaskModal,  (state, { taskId }) => ({ ...state, selectedTaskId: taskId, isModalOpen: true })),
  on(BoardActions.closeTaskModal, (state)              => ({ ...state, selectedTaskId: null,  isModalOpen: false })),

  // Filters
  on(BoardActions.setSearchQuery,    (state, { query })      => ({ ...state, searchQuery: query })),
  on(BoardActions.setPriorityFilter, (state, { priority })   => ({ ...state, filterPriority: priority })),
  on(BoardActions.setAssigneeFilter, (state, { assigneeId }) => ({ ...state, filterAssigneeId: assigneeId })),
  on(BoardActions.clearFilters,      (state)                  => ({
    ...state, searchQuery: '', filterPriority: null, filterAssigneeId: null,
  })),
);
