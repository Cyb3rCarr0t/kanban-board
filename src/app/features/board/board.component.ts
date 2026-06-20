import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BoardActions } from '../../core/store/board.actions';
import {
  selectFilteredColumns, selectUsers, selectIsModalOpen,
  selectSelectedTask, selectHasActiveFilter,
  selectActiveCount, selectInProgressCount, selectDoneCount,
  selectTasksArray,
} from '../../core/store/board.selectors';
import { BoardHeaderComponent } from './components/board-header/board-header.component';
import { ColumnComponent } from './components/column/column.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { StatsBarComponent } from '../dashboard/components/stats-bar/stats-bar.component';
import { AsyncPipe } from '@angular/common';
import { TaskStatus, TaskPriority, CreateTaskDto } from '../../core/models/task.model';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CdkDropListGroup,
    BoardHeaderComponent,
    StatsBarComponent,
    ColumnComponent,
    TaskModalComponent,
  ],
  template: `
    <div class="board-shell">

      <app-board-header
        [users]="(users$ | async) ?? []"
        [hasActiveFilter]="(hasFilter$ | async) ?? false"
        (searchChange)="onSearch($event)"
        (priorityChange)="onPriorityFilter($event)"
        (assigneeChange)="onAssigneeFilter($event)"
        (clearFilters)="onClearFilters()"
      />

      <app-stats-bar
        [total]="(tasks$ | async)?.length ?? 0"
        [active]="(activeCount$ | async) ?? 0"
        [inProgress]="(inProgressCount$ | async) ?? 0"
        [done]="(doneCount$ | async) ?? 0"
      />

      <div class="board-columns" cdkDropListGroup>
        @for (col of (columns$ | async) ?? []; track col.id) {
          <app-column
            [column]="col"
            [users]="(users$ | async) ?? []"
            (taskClicked)="onTaskClick($event)"
            (taskMoved)="onTaskMoved($event)"
            (addTask)="onAddTask($event)"
          />
        }
      </div>

      @if (isModalOpen$ | async) {
        <app-task-modal
          [task]="(selectedTask$ | async) ?? null"
          [users]="(users$ | async) ?? []"
          (close)="onCloseModal()"
          (save)="onSaveTask($event)"
          (delete)="onDeleteTask($event)"
        />
      }

    </div>
  `,
  styles: [`
    .board-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background: var(--bg-base);
    }

    .board-columns {
      display: flex;
      gap: var(--space-4);
      padding: var(--space-4) var(--space-6);
      overflow-x: auto;
      overflow-y: hidden;
      flex: 1;
      align-items: flex-start;
    }
  `],
})
export class BoardComponent implements OnInit {
  private store = inject(Store);

  columns$        = this.store.select(selectFilteredColumns);
  users$          = this.store.select(selectUsers);
  isModalOpen$    = this.store.select(selectIsModalOpen);
  selectedTask$   = this.store.select(selectSelectedTask);
  hasFilter$      = this.store.select(selectHasActiveFilter);
  tasks$          = this.store.select(selectTasksArray);
  activeCount$    = this.store.select(selectActiveCount);
  inProgressCount$= this.store.select(selectInProgressCount);
  doneCount$      = this.store.select(selectDoneCount);

  ngOnInit(): void {
    // Trigger the load effect — in Phase 1 this returns mock data
    this.store.dispatch(BoardActions.loadBoard());
  }

  onSearch(query: string): void {
    this.store.dispatch(BoardActions.setSearchQuery({ query }));
  }

  onPriorityFilter(priority: TaskPriority | null): void {
    this.store.dispatch(BoardActions.setPriorityFilter({ priority }));
  }

  onAssigneeFilter(assigneeId: string | null): void {
    this.store.dispatch(BoardActions.setAssigneeFilter({ assigneeId }));
  }

  onClearFilters(): void {
    this.store.dispatch(BoardActions.clearFilters());
  }

  onTaskClick(taskId: string): void {
    this.store.dispatch(BoardActions.openTaskModal({ taskId }));
  }

  onCloseModal(): void {
    this.store.dispatch(BoardActions.closeTaskModal());
  }

  onSaveTask(payload: { id: string | null; dto: CreateTaskDto }): void {
    if (payload.id) {
      this.store.dispatch(BoardActions.updateTask({ id: payload.id, changes: payload.dto }));
    } else {
      this.store.dispatch(BoardActions.addTask({ dto: payload.dto }));
    }
    this.store.dispatch(BoardActions.closeTaskModal());
  }

  onDeleteTask(id: string): void {
    this.store.dispatch(BoardActions.deleteTask({ id }));
    this.store.dispatch(BoardActions.closeTaskModal());
  }

  onAddTask(status: TaskStatus): void {
    // Opens modal in "create" mode, pre-selecting the column's status
    this.store.dispatch(BoardActions.openTaskModal({ taskId: null }));
  }

  onTaskMoved(event: { taskId: string; fromStatus: TaskStatus; toStatus: TaskStatus; newIndex: number }): void {
    // console.log('Task moved:', event);
    this.store.dispatch(BoardActions.moveTask(event));
  }
}
