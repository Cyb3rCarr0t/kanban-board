import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stats-bar">
      <div class="stat">
        <span class="stat__value">{{ total }}</span>
        <span class="stat__label">Total</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat__value stat__value--blue">{{ active }}</span>
        <span class="stat__label">Active</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat__value stat__value--amber">{{ inProgress }}</span>
        <span class="stat__label">In Progress</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat__value stat__value--green">{{ done }}</span>
        <span class="stat__label">Done</span>
      </div>

      <!-- Completion progress bar -->
      <div class="progress-wrap">
        <div class="progress-bar">
          <div
            class="progress-bar__fill"
            [style.width.%]="completionPct"
            [title]="completionPct + '% complete'"
          ></div>
        </div>
        <span class="progress-label">{{ completionPct }}%</span>
      </div>
    </div>
  `,
  styles: [`
    .stats-bar {
      display: flex;
      align-items: center;
      gap: var(--space-5);
      padding: var(--space-3) var(--space-6);
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
    }

    .stat {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
    }

    .stat__value {
      font-size: var(--text-xl);
      font-weight: 700;
      font-family: var(--font-mono);
      color: var(--text-primary);

      &--blue  { color: var(--status-todo); }
      &--amber { color: var(--status-doing); }
      &--green { color: var(--status-done); }
    }

    .stat__label {
      font-size: var(--text-xs);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    .stat-divider {
      width: 1px;
      height: 20px;
      background: var(--border-subtle);
    }

    .progress-wrap {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-left: auto;
    }

    .progress-bar {
      width: 120px;
      height: 6px;
      background: var(--bg-elevated);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar__fill {
      height: 100%;
      background: var(--status-done);
      border-radius: 3px;
      transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .progress-label {
      font-size: var(--text-xs);
      font-family: var(--font-mono);
      color: var(--text-muted);
      min-width: 32px;
    }
  `],
})
export class StatsBarComponent {
  @Input() total = 0;
  @Input() active = 0;
  @Input() inProgress = 0;
  @Input() done = 0;

  get completionPct(): number {
    if (!this.total) return 0;
    return Math.round((this.done / this.total) * 100);
  }
}
