import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Input, OnChanges, Output, signal, computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, User, TaskStatus, TaskPriority, CreateTaskDto } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <!-- Backdrop -->
    <div class="modal-backdrop" (click)="close.emit()" role="presentation"></div>

    <div class="modal" role="dialog" aria-modal="true" [attr.aria-label]="isEditing() ? 'Edit task' : 'New task'">
      <div class="modal__header">
        <h2 class="modal__title">{{ isEditing() ? 'Edit task' : 'New task' }}</h2>
        <button class="modal__close" (click)="close.emit()" aria-label="Close modal">
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
            <path d="m4 4 12 12M16 4 4 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="modal__body">
        <!-- Title -->
        <div class="field">
          <label class="field__label" for="task-title">Title <span class="required">*</span></label>
          <input
            id="task-title"
            type="text"
            placeholder="What needs to be done?"
            [ngModel]="form().title"
            (ngModelChange)="patch({ title: $event })"
          />
        </div>

        <!-- Description -->
        <div class="field">
          <label class="field__label" for="task-desc">Description</label>
          <textarea
            id="task-desc"
            rows="3"
            placeholder="Add more detail…"
            [ngModel]="form().description"
            (ngModelChange)="patch({ description: $event })"
          ></textarea>
        </div>

        <!-- Row: Status + Priority -->
        <div class="field-row">
          <div class="field">
            <label class="field__label" for="task-status">Status</label>
            <select
              id="task-status"
              [ngModel]="form().status"
              (ngModelChange)="patch({ status: $event })"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div class="field">
            <label class="field__label" for="task-priority">Priority</label>
            <select
              id="task-priority"
              [ngModel]="form().priority"
              (ngModelChange)="patch({ priority: $event })"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>
        </div>

        <!-- Row: Assignee + Due date -->
        <div class="field-row">
          <div class="field">
            <label class="field__label" for="task-assignee">Assignee</label>
            <select
              id="task-assignee"
              [ngModel]="form().assigneeId ?? ''"
              (ngModelChange)="patch({ assigneeId: $event || null })"
            >
              <option value="">Unassigned</option>
              @for (user of users; track user.id) {
                <option [value]="user.id">{{ user.name }}</option>
              }
            </select>
          </div>

          <div class="field">
            <label class="field__label" for="task-due">Due date</label>
            <input
              id="task-due"
              type="date"
              [ngModel]="form().dueDate ?? ''"
              (ngModelChange)="patch({ dueDate: $event || null })"
            />
          </div>
        </div>

        <!-- Tags -->
        <div class="field">
          <label class="field__label" for="task-tags">Tags <span class="field__hint">(comma-separated)</span></label>
          <input
            id="task-tags"
            type="text"
            placeholder="e.g. angular, ux, api"
            [ngModel]="tagsString()"
            (ngModelChange)="onTagsChange($event)"
          />
        </div>
      </div>

      <div class="modal__footer">
        @if (isEditing()) {
          <button class="btn btn--danger" (click)="onDelete()">Delete task</button>
        }
        <div class="modal__footer-right">
          <button class="btn btn--ghost" (click)="close.emit()">Cancel</button>
          <button
            class="btn btn--primary"
            [disabled]="!canSave()"
            (click)="onSave()"
          >{{ isEditing() ? 'Save changes' : 'Create task' }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(2px);
      z-index: 100;
      animation: fadeIn 0.15s ease;
    }

    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 101;
      background: var(--bg-elevated);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      width: 520px;
      max-width: calc(100vw - 2rem);
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
      animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-5) var(--space-6);
      border-bottom: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }

    .modal__title {
      font-size: var(--text-lg);
      font-weight: 600;
    }

    .modal__close {
      color: var(--text-muted);
      padding: var(--space-1);
      border-radius: var(--radius-sm);
      transition: color 0.15s;

      &:hover { color: var(--text-primary); }
    }

    .modal__body {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      padding: var(--space-5) var(--space-6);
      overflow-y: auto;
      flex: 1;
    }

    .modal__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--border-subtle);
      gap: var(--space-3);
      flex-shrink: 0;
    }

    .modal__footer-right {
      display: flex;
      gap: var(--space-3);
      margin-left: auto;
    }

    /* Fields */
    .field { display: flex; flex-direction: column; gap: var(--space-2); }

    .field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    .field__label {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-secondary);
    }

    .field__hint {
      font-weight: 400;
      color: var(--text-muted);
    }

    .required { color: var(--priority-high); }

    textarea {
      resize: vertical;
      min-height: 80px;
    }

    /* Buttons */
    .btn {
      height: 36px;
      padding: 0 var(--space-5);
      font-size: var(--text-sm);
      font-weight: 500;
      border-radius: var(--radius-md);
      transition: background 0.15s, color 0.15s, opacity 0.15s;
      cursor: pointer;
      border: none;

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .btn--primary {
      background: var(--accent);
      color: var(--bg-base);
      font-weight: 600;

      &:hover:not(:disabled) { background: #ffb94a; }
    }

    .btn--ghost {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-default);

      &:hover { color: var(--text-primary); border-color: var(--border-default); }
    }

    .btn--danger {
      background: transparent;
      color: var(--priority-high);
      border: 1px solid transparent;

      &:hover { background: rgba(239,68,68,0.1); border-color: var(--priority-high); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)); }
      to   { opacity: 1; transform: translate(-50%, -50%); }
    }
  `],
})
export class TaskModalComponent implements OnChanges {
  @Input() task: Task | null = null;
  @Input() users: User[] = [];
  @Input() defaultStatus: TaskStatus = 'todo';

  @Output() close  = new EventEmitter<void>();
  @Output() save   = new EventEmitter<{ id: string | null; dto: CreateTaskDto }>();
  @Output() delete = new EventEmitter<string>();

  // ── Signals ─────────────────────────────────────────────────────────────
  form = signal<CreateTaskDto>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigneeId: null,
    tags: [],
    dueDate: null,
  });

  isEditing  = computed(() => !!this.task);
  canSave    = computed(() => this.form().title.trim().length > 0);
  tagsString = computed(() => this.form().tags.join(', '));

  ngOnChanges(): void {
    if (this.task) {
      this.form.set({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        priority: this.task.priority,
        assigneeId: this.task.assigneeId,
        tags: [...this.task.tags],
        dueDate: this.task.dueDate,
      });
    } else {
      // Reset form for new task
      this.form.set({
        title: '', description: '', status: this.defaultStatus,
        priority: 'medium', assigneeId: null, tags: [], dueDate: null,
      });
    }
  }

  patch(partial: Partial<CreateTaskDto>): void {
    this.form.update(prev => ({ ...prev, ...partial }));
  }

  onTagsChange(raw: string): void {
    const tags = raw.split(',').map(t => t.trim()).filter(Boolean);
    this.patch({ tags });
  }

  onSave(): void {
    if (!this.canSave()) return;
    this.save.emit({ id: this.task?.id ?? null, dto: this.form() });
  }

  onDelete(): void {
    if (this.task) this.delete.emit(this.task.id);
  }
}
