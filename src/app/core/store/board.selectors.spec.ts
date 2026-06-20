import {
  selectFilteredColumns, selectDoneCount,
  selectInProgressCount, selectHasActiveFilter,
} from './board.selectors';
import { initialBoardState } from './board.reducer';
import { BoardState } from '../models/task.model';

describe('Board Selectors', () => {

  describe('selectDoneCount', () => {
    it('should count done tasks correctly', () => {
      const count = selectDoneCount.projector(Object.values(initialBoardState.tasks));
      const expected = Object.values(initialBoardState.tasks).filter(t => t.status === 'done').length;
      expect(count).toBe(expected);
    });
  });

  describe('selectInProgressCount', () => {
    it('should count in-progress tasks', () => {
      const count = selectInProgressCount.projector(Object.values(initialBoardState.tasks));
      const expected = Object.values(initialBoardState.tasks).filter(t => t.status === 'in-progress').length;
      expect(count).toBe(expected);
    });
  });

  describe('selectHasActiveFilter', () => {
    it('should return false when no filters are set', () => {
      expect(selectHasActiveFilter.projector('', null, null)).toBeFalse();
    });

    it('should return true when search query is set', () => {
      expect(selectHasActiveFilter.projector('ngrx', null, null)).toBeTrue();
    });

    it('should return true when priority filter is set', () => {
      expect(selectHasActiveFilter.projector('', 'high', null)).toBeTrue();
    });
  });

  describe('selectFilteredColumns', () => {
    it('should return all tasks when no filters applied', () => {
      const cols = selectFilteredColumns.projector(
        initialBoardState.columns,
        initialBoardState.tasks,
        '', null, null
      );
      const allTaskCount = cols.reduce((sum, c) => sum + c.tasks.length, 0);
      expect(allTaskCount).toBe(Object.keys(initialBoardState.tasks).length);
    });

    it('should filter tasks by search query', () => {
      const cols = selectFilteredColumns.projector(
        initialBoardState.columns,
        initialBoardState.tasks,
        'ngrx', null, null
      );
      const tasks = cols.flatMap(c => c.tasks);
      expect(tasks.every(t =>
        t.title.toLowerCase().includes('ngrx') ||
        t.description.toLowerCase().includes('ngrx')
      )).toBeTrue();
    });

    it('should filter tasks by priority', () => {
      const cols = selectFilteredColumns.projector(
        initialBoardState.columns,
        initialBoardState.tasks,
        '', 'high', null
      );
      const tasks = cols.flatMap(c => c.tasks);
      expect(tasks.every(t => t.priority === 'high')).toBeTrue();
    });
  });
});
