import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Task, User } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  host: { '[attr.data-priority]': 'task.priority' },
  template: `
    <article class="task-card" tabindex="0" role="button" [attr.aria-label]="'Open task: ' + task.title">
      <!-- Priority stripe -->
      <span class="task-card__stripe" [style.background]="priorityColor"></span>

      <!-- Tags -->
      @if (task.tags.length > 0) {
        <div class="task-card__tags">
          @for (tag of task.tags; track tag) {
            <span class="tag">{{ tag }}</span>
          }
        </div>
      }

      <!-- Title -->
      <p class="task-card__title">{{ task.title }}</p>

      <!-- Footer row -->
      <div class="task-card__footer">
        <!-- Due date -->
        @if (task.dueDate) {
          <span class="task-card__due" [class.overdue]="isOverdue">
            <svg viewBox="0 0 16 16" fill="none" width="11" height="11">
              <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.3"/>
              <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            {{ formattedDue }}
          </span>
        }

        <!-- Assignee avatar -->
        @if (user) {
          <span
            class="task-card__avatar"
            [style.background]="user.avatarColor"
            [title]="user.name"
          >{{ user.avatarInitials }}</span>
        } @else {
          <span class="task-card__avatar task-card__avatar--unassigned" title="Unassigned">?</span>
        }
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
      cursor: grab;

      &:active { cursor: grabbing; }
    }

    .task-card {
      position: relative;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: var(--space-3) var(--space-3) var(--space-3) var(--space-5);
      transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
      overflow: hidden;
      user-select: none;

      &:hover {
        border-color: var(--border-default);
        box-shadow: var(--shadow-sm);
      }

      &:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }
    }

    /* Coloured left stripe based on priority */
    .task-card__stripe {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      border-radius: var(--radius-sm) 0 0 var(--radius-sm);
    }

    .task-card__tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-1);
      margin-bottom: var(--space-2);
    }

    .tag {
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--text-muted);
      background: var(--bg-hover);
      padding: 1px 6px;
      border-radius: var(--radius-sm);
    }

    .task-card__title {
      font-size: var(--text-sm);
      font-weight: 500;
      line-height: 1.4;
      color: var(--text-primary);
      margin-bottom: var(--space-3);
    }

    .task-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
    }

    .task-card__due {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--text-muted);

      &.overdue {
        color: var(--priority-high);
      }
    }

    .task-card__avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 9px;
      font-weight: 700;
      color: var(--bg-base);
      flex-shrink: 0;
      margin-left: auto;
    }

    .task-card__avatar--unassigned {
      background: var(--bg-hover);
      color: var(--text-muted);
      border: 1px dashed var(--border-default);
    }

    /* CDK drag preview */
    :host.cdk-drag-preview .task-card {
      box-shadow: var(--shadow-lg);
      border-color: var(--accent);
    }
  `],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Input() user: User | undefined;

  @Output() activate = new EventEmitter<void>();

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeyActivate(event?: Event): void {
    event?.preventDefault(); // stops space from scrolling the page
    this.activate.emit();
  }

  get priorityColor(): string {
    const map: Record<string, string> = {
      high: 'var(--priority-high)',
      medium: 'var(--priority-medium)',
      low: 'var(--priority-low)',
    };
    return map[this.task.priority];
  }

  get formattedDue(): string {
    if (!this.task.dueDate) return '';
    const d = new Date(this.task.dueDate);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  get isOverdue(): boolean {
    if (!this.task.dueDate || this.task.status === 'done') return false;
    return new Date(this.task.dueDate) < new Date();
  }
}
