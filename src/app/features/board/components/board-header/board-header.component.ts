import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Input, Output, signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, TaskPriority } from '../../../../core/models/task.model';

@Component({
  selector: 'app-board-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <header class="board-header">
      <div class="board-header__left">
        <span class="board-header__logo">⬡</span>
        <h1 class="board-header__title">Kanban</h1>
      </div>

      <div class="board-header__controls">
        <!-- Search -->
        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="m14 14 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            class="search-input"
            type="text"
            placeholder="Search tasks…"
            [ngModel]="searchValue()"
            (ngModelChange)="onSearch($event)"
            aria-label="Search tasks"
          />
        </div>

        <!-- Priority filter -->
        <select
          class="filter-select"
          [ngModel]="priorityValue()"
          (ngModelChange)="onPriority($event)"
          aria-label="Filter by priority"
        >
          <option value="">All priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        <!-- Assignee filter -->
        <select
          class="filter-select"
          [ngModel]="assigneeValue()"
          (ngModelChange)="onAssignee($event)"
          aria-label="Filter by assignee"
        >
          <option value="">All members</option>
          @for (user of users; track user.id) {
            <option [value]="user.id">{{ user.name }}</option>
          }
        </select>

        <!-- Clear filters -->
        @if (hasActiveFilter) {
          <button class="btn-clear" (click)="clearFilters.emit()" title="Clear all filters">
            ✕ Clear
          </button>
        }
      </div>
    </header>
  `,
  styles: [`
    .board-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-6);
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      gap: var(--space-4);
      flex-wrap: wrap;

      @media (max-width: 768px) {
        padding: var(--space-3) var(--space-4);
        gap: var(--space-3);
      }
    }

    .board-header__left {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .board-header__logo {
      font-size: 1.5rem;
      color: var(--accent);
      line-height: 1;
    }

    .board-header__title {
      font-size: var(--text-xl);
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text-primary);
    }

    .board-header__controls {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex-wrap: wrap;
    }

    .search-wrap {
      position: relative;
      display: flex;
      align-items: center;

      @media (max-width: 768px) {
        width: 100%;
      }
    }

    .search-icon {
      position: absolute;
      left: var(--space-3);
      width: 16px;
      height: 16px;
      color: var(--text-muted);
      pointer-events: none;
    }

    .search-input {
      width: 220px;
      padding-left: calc(var(--space-3) + 20px);
      font-size: var(--text-sm);
      height: 36px;

      @media (max-width: 768px) {
        width: 100%;
      }
    }

    .filter-select {
      height: 36px;
      padding: 0 var(--space-3);
      font-size: var(--text-sm);
      cursor: pointer;
      min-width: 140px;

      option { background: var(--bg-elevated); }
    }

    .btn-clear {
      height: 36px;
      padding: 0 var(--space-4);
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--bg-elevated);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      transition: color 0.15s, border-color 0.15s;

      &:hover {
        color: var(--text-primary);
        border-color: var(--accent);
      }
    }
  `],
})
export class BoardHeaderComponent {
  @Input() users: User[] = [];
  @Input() hasActiveFilter = false;

  @Output() searchChange   = new EventEmitter<string>();
  @Output() priorityChange = new EventEmitter<TaskPriority | null>();
  @Output() assigneeChange = new EventEmitter<string | null>();
  @Output() clearFilters   = new EventEmitter<void>();

  // ── Local Signals (Angular 21 pattern) ─────────────────────────────────
  // These drive only the UI state of this component (select values).
  // The real filter state lives in the NgRx store.
  searchValue   = signal('');
  priorityValue = signal('');
  assigneeValue = signal('');

  onSearch(query: string): void {
    this.searchValue.set(query);
    this.searchChange.emit(query);
  }

  onPriority(val: string): void {
    this.priorityValue.set(val);
    this.priorityChange.emit((val as TaskPriority) || null);
  }

  onAssignee(val: string): void {
    this.assigneeValue.set(val);
    this.assigneeChange.emit(val || null);
  }
}
