import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output,
} from '@angular/core';
import {
  CdkDropList, CdkDrag, CdkDragDrop, CdkDragPlaceholder, moveItemInArray, transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Task, User, TaskStatus } from '../../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

// Shape of a column as produced by the selectFilteredColumns selector
export interface ColumnViewModel {
  id: TaskStatus;
  label: string;
  colorVar: string;
  tasks: Task[];
}

@Component({
  selector: 'app-column',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, TaskCardComponent],
  template: `
    <div class="column">
      <!-- Column header -->
      <div class="column__header">
        <span class="column__dot" [style.background]="'var(' + column.colorVar + ')'"></span>
        <h2 class="column__label">{{ column.label }}</h2>
        <span class="column__count">{{ column.tasks.length }}</span>
      </div>

      <!-- Task list (CDK drop zone) -->
      <div
        class="column__list"
        cdkDropList
        [cdkDropListData]="column.tasks"
        [id]="column.id"
        [cdkDropListConnectedTo]="connectedTo"
        (cdkDropListDropped)="onDrop($event)"
      >
        @for (task of column.tasks; track task.id) {
          <app-task-card
            cdkDrag
            [cdkDragData]="task"
            [task]="task"
            [user]="getUserById(task.assigneeId)"
            (click)="taskClicked.emit(task.id)"
          >
            <!-- CDK drag placeholder -->
            <div *cdkDragPlaceholder class="drag-placeholder"></div>
          </app-task-card>
        } @empty {
          <div class="column__empty">
            <span>No tasks here</span>
          </div>
        }
      </div>

      <!-- Add task button -->
      <button class="column__add-btn" (click)="addTask.emit(column.id)">
        <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
          <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Add task
      </button>
    </div>
  `,
  styles: [`
    .column {
      display: flex;
      flex-direction: column;
      min-width: 280px;
      max-width: 300px;
      flex-shrink: 0;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      max-height: calc(100vh - 160px);

      @media (max-width: 768px) {
        min-width: unset;
        max-width: unset;
        max-height: unset;   /* let each column grow to fit all its cards */
        width: 100%;
      }
    }

    .column__header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4) var(--space-4) var(--space-3);
      border-bottom: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }

    .column__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .column__label {
      font-size: var(--text-sm);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-secondary);
      flex: 1;
    }

    .column__count {
      font-size: var(--text-xs);
      font-weight: 600;
      font-family: var(--font-mono);
      color: var(--text-muted);
      background: var(--bg-elevated);
      padding: 2px 7px;
      border-radius: 10px;
    }

    .column__list {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      padding: var(--space-3);
      overflow-y: auto;
      flex: 1;
      min-height: 80px;

      /* CDK drag states */
      &.cdk-drop-list-dragging app-task-card:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    }

    .drag-placeholder {
      border: 2px dashed var(--border-default);
      border-radius: var(--radius-md);
      height: 80px;
      background: var(--bg-elevated);
      opacity: 0.5;
    }

    .column__empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
      color: var(--text-muted);
      font-size: var(--text-sm);
      border: 1px dashed var(--border-subtle);
      border-radius: var(--radius-md);
    }

    .column__add-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      font-size: var(--text-sm);
      color: var(--text-muted);
      border-top: 1px solid var(--border-subtle);
      width: 100%;
      transition: color 0.15s, background 0.15s;
      flex-shrink: 0;

      &:hover {
        color: var(--accent);
        background: var(--accent-dim);
      }
    }
  `],
})
export class ColumnComponent {
  @Input({ required: true }) column!: ColumnViewModel;
  @Input() users: User[] = [];
  @Input() connectedTo: string[] = [];

  @Output() taskClicked = new EventEmitter<string>();
  @Output() addTask     = new EventEmitter<TaskStatus>();
  @Output() taskMoved = new EventEmitter<{
    taskId: string;
    fromStatus: TaskStatus;
    toStatus: TaskStatus;
    previousIndex: number;
    newIndex: number;
  }>();

  getUserById(id: string | null): User | undefined {
    return id ? this.users.find(u => u.id === id) : undefined;
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    const task: Task = event.item.data;
    const { status } = task;

    if (event.previousContainer === event.container) {
      // Reorder within same column — parent will update store
      this.taskMoved.emit({
        taskId: task.id,
        fromStatus: status,
        toStatus: status,
        previousIndex: event.previousIndex,
        newIndex: event.currentIndex,
      });
    } else {
      const toStatus = event.container.id as TaskStatus;
      this.taskMoved.emit({
        taskId: task.id,
        fromStatus: status,
        toStatus,
        previousIndex: event.previousIndex,
        newIndex: event.currentIndex,
      });
    }
  }
}
