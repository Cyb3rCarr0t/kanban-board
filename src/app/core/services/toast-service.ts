import { Injectable, signal, computed } from '@angular/core';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);

  // Public read-only view of the toasts signal
  toasts = computed(() => this._toasts());

  show(message: string, type: ToastType = 'success'): void {
    const id = Math.random().toString(36).slice(2, 9);
    const toast: Toast = { id, message, type };

    this._toasts.update(current => [...current, toast]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: string): void {
    this._toasts.update(current => current.filter(t => t.id !== id));
  }

  // Convenience methods
  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void   { this.show(message, 'error'); }
  info(message: string): void    { this.show(message, 'info'); }
}