import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Order, OrderStatus, OrderNote } from '../../data/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly _orders = signal<Order[]>([]);

  readonly orders = this._orders.asReadonly();

  readonly statusCounts = computed(() => {
    const all = this._orders();
    return {
      all: all.length,
      pending: all.filter(o => o.status === 'pending').length,
      processing: all.filter(o => o.status === 'processing').length,
      shipped: all.filter(o => o.status === 'shipped').length,
      delivered: all.filter(o => o.status === 'delivered').length,
      cancelled: all.filter(o => o.status === 'cancelled').length,
    };
  });

  constructor() {
    this.http.get<Order[]>('/api/orders?limit=100').subscribe(orders => {
      this._orders.set(orders);
    });
  }

  getAll() {
    return this._orders.asReadonly();
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`/api/orders/${id}`);
  }

  getByCustomerId(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`/api/orders?customerId=${customerId}&limit=100`);
  }

  updateStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`/api/orders/${id}/status`, { status }).pipe(
      tap(updated => {
        this._orders.update(orders =>
          orders.map(o => {
            if (o.id !== id) return o;
            const now = new Date().toISOString();
            const timelineEntry = {
              id: `tl-${Date.now()}`,
              status,
              message: this.getStatusMessage(status),
              createdAt: now,
            };
            return {
              ...o,
              status,
              timeline: [...o.timeline, timelineEntry],
              updatedAt: now,
            };
          }),
        );
      }),
    );
  }

  addNote(id: string, note: OrderNote): Observable<Order> {
    return this.http.post<Order>(`/api/orders/${id}/notes`, note).pipe(
      tap(updated => {
        this._orders.update(orders =>
          orders.map(o => {
            if (o.id !== id) return o;
            return {
              ...o,
              notes: [...o.notes, note],
              updatedAt: new Date().toISOString(),
            };
          }),
        );
      }),
    );
  }

  private getStatusMessage(status: OrderStatus): string {
    const messages: Record<OrderStatus, string> = {
      pending: 'Order placed',
      processing: 'Payment confirmed, preparing shipment',
      shipped: 'Order has been shipped',
      delivered: 'Order delivered successfully',
      cancelled: 'Order has been cancelled',
      refunded: 'Order has been refunded',
    };
    return messages[status];
  }
}
