import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: Toast[] = [];
  toastsSubject = new Subject<Toast[]>();

  constructor() {}

  showToast(message: string, duration = 3000) {
    const id = Math.random().toString(36).substring(2);
    const toast: Toast = { id, message, duration };
    this.toasts.push(toast);
    this.toastsSubject.next(this.toasts);

    setTimeout(() => this.removeToast(id), duration);
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastsSubject.next(this.toasts);
  }
}