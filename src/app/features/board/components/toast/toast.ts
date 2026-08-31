// src/app/shared/components/toast/toast.component.ts

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast"
          [class]="'toast toast--' + toast.type"
          role="alert"
        >
          <span class="toast__icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error')   { ✕ }
              @case ('info')    { ℹ }
            }
          </span>
          <span class="toast__message">{{ toast.message }}</span>
          <button
            class="toast__close"
            (click)="toastService.dismiss(toast.id)"
            aria-label="Dismiss notification"
          >×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: var(--space-6);
      right: var(--space-6);
      z-index: 200;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      pointer-events: none;

      @media (max-width: 768px) {
        bottom: var(--space-4);
        right: var(--space-4);
        left: var(--space-4);
      }
    }

    .toast {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      background: var(--bg-elevated);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      font-size: var(--text-sm);
      color: var(--text-primary);
      pointer-events: all;
      min-width: 260px;
      max-width: 380px;
      animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      &--success { border-left: 3px solid var(--status-done); }
      &--error   { border-left: 3px solid var(--priority-high); }
      &--info    { border-left: 3px solid var(--status-todo); }
    }

    .toast__icon {
      font-size: var(--text-base);
      flex-shrink: 0;

      .toast--success & { color: var(--status-done); }
      .toast--error &   { color: var(--priority-high); }
      .toast--info &    { color: var(--status-todo); }
    }

    .toast__message {
      flex: 1;
      line-height: 1.4;
    }

    .toast__close {
      font-size: 1.1rem;
      color: var(--text-muted);
      line-height: 1;
      padding: 2px 4px;
      border-radius: var(--radius-sm);
      flex-shrink: 0;
      transition: color 0.15s;

      &:hover { color: var(--text-primary); }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(16px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `],
})
export class ToastComponent {
  toastService = inject(ToastService);
}