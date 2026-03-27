import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AppNotification, NotificationType } from '../../data/models';

export interface Toast {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly notifications = signal<AppNotification[]>([]);
  private readonly toasts = signal<Toast[]>([]);

  readonly allNotifications = this.notifications.asReadonly();
  readonly activeToasts = this.toasts.asReadonly();
  readonly unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  constructor() {
    this.http.get<any>('/api/notifications').subscribe(res =>
      this.notifications.set(res.data ?? res),
    );
  }

  showToast(type: NotificationType, title: string, message: string, duration = 5000): void {
    const toast: Toast = { id: crypto.randomUUID(), type, title, message, duration };
    this.toasts.update(list => [...list, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismissToast(toast.id), duration);
    }
  }

  dismissToast(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  markAsRead(id: string): void {
    this.http.patch<any>(`/api/notifications/${id}/read`, {}).pipe(
      tap(() => {
        this.notifications.update(list =>
          list.map(n => n.id === id ? { ...n, isRead: true } : n),
        );
      }),
    ).subscribe();
  }

  markAllAsRead(): void {
    this.notifications.update(list =>
      list.map(n => ({ ...n, isRead: true }))
    );
  }

  clearAll(): void {
    this.notifications.set([]);
  }

  addNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): void {
    const newNotification: AppNotification = {
      ...notification,
      id: crypto.randomUUID(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.update(list => [newNotification, ...list]);
    this.showToast(notification.type, notification.title, notification.message);
  }
}
