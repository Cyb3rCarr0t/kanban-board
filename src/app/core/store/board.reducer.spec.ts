import { boardReducer, initialBoardState } from './board.reducer';
import { BoardActions } from './board.actions';
import { CreateTaskDto } from '../models/task.model';

describe('boardReducer', () => {

  // ── addTask ──────────────────────────────────────────────────────────────

  describe('addTask', () => {
    it('should add a new task to the correct column', () => {
      const dto: CreateTaskDto = {
        title: 'Test task',
        description: '',
        status: 'todo',
        priority: 'low',
        assigneeId: null,
        tags: [],
        dueDate: null,
      };
      const action = BoardActions.addTask({ dto });
      const state = boardReducer(initialBoardState, action);

      const taskValues = Object.values(state.tasks);
      const added = taskValues.find(t => t.title === 'Test task');

      expect(added).toBeDefined();
      expect(added!.status).toBe('todo');

      const todoCol = state.columns.find(c => c.id === 'todo')!;
      expect(todoCol.taskIds).toContain(added!.id);
    });
  });

  // ── deleteTask ──────────────────────────────────────────────────────────

  describe('deleteTask', () => {
    it('should remove the task from tasks map and column', () => {
      const idToDelete = 't1';
      const action = BoardActions.deleteTask({ id: idToDelete });
      const state = boardReducer(initialBoardState, action);

      expect(state.tasks[idToDelete]).toBeUndefined();
      const allColumnTaskIds = state.columns.flatMap(c => c.taskIds);
      expect(allColumnTaskIds).not.toContain(idToDelete);
    });
  });

  // ── updateTask ──────────────────────────────────────────────────────────

  describe('updateTask', () => {
    it('should update task fields', () => {
      const action = BoardActions.updateTask({ id: 't1', changes: { title: 'Updated' } });
      const state = boardReducer(initialBoardState, action);
      expect(state.tasks['t1'].title).toBe('Updated');
    });

    it('should move task between columns when status changes', () => {
      const originalTask = initialBoardState.tasks['t1'];
      const fromStatus = originalTask.status; // 'done'
      const action = BoardActions.updateTask({ id: 't1', changes: { status: 'todo' } });
      const state = boardReducer(initialBoardState, action);

      const fromCol = state.columns.find(c => c.id === fromStatus)!;
      const toCol   = state.columns.find(c => c.id === 'todo')!;

      expect(fromCol.taskIds).not.toContain('t1');
      expect(toCol.taskIds).toContain('t1');
      expect(state.tasks['t1'].status).toBe('todo');
    });
  });

  // ── moveTask ────────────────────────────────────────────────────────────

  describe('moveTask', () => {
    it('should transfer task between columns at the correct index', () => {
      const action = BoardActions.moveTask({
        taskId: 't7',
        fromStatus: 'todo',
        toStatus: 'in-progress',
        newIndex: 0,
      });
      const state = boardReducer(initialBoardState, action);

      expect(state.columns.find(c => c.id === 'todo')!.taskIds).not.toContain('t7');
      expect(state.columns.find(c => c.id === 'in-progress')!.taskIds[0]).toBe('t7');
      expect(state.tasks['t7'].status).toBe('in-progress');
    });
  });

  // ── filters ─────────────────────────────────────────────────────────────

  describe('filters', () => {
    it('should set search query', () => {
      const state = boardReducer(initialBoardState, BoardActions.setSearchQuery({ query: 'ngrx' }));
      expect(state.searchQuery).toBe('ngrx');
    });

    it('should clear all filters', () => {
      let state = boardReducer(initialBoardState, BoardActions.setSearchQuery({ query: 'test' }));
      state = boardReducer(state, BoardActions.setPriorityFilter({ priority: 'high' }));
      state = boardReducer(state, BoardActions.clearFilters());

      expect(state.searchQuery).toBe('');
      expect(state.filterPriority).toBeNull();
      expect(state.filterAssigneeId).toBeNull();
    });
  });

  // ── modal ────────────────────────────────────────────────────────────────

  describe('modal', () => {
    it('should open modal with selected task id', () => {
      const state = boardReducer(initialBoardState, BoardActions.openTaskModal({ taskId: 't1' }));
      expect(state.isModalOpen).toBeTrue();
      expect(state.selectedTaskId).toBe('t1');
    });

    it('should close modal and clear selected task', () => {
      let state = boardReducer(initialBoardState, BoardActions.openTaskModal({ taskId: 't1' }));
      state = boardReducer(state, BoardActions.closeTaskModal());
      expect(state.isModalOpen).toBeFalse();
      expect(state.selectedTaskId).toBeNull();
    });
  });
});
