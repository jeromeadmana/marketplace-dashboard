import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Promotion, PromotionStatus } from '../../data/models/promotion.model';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly http = inject(HttpClient);
  private readonly promotionsSignal = signal<Promotion[]>([]);

  readonly promotions = this.promotionsSignal.asReadonly();

  readonly statusCounts = computed(() => {
    const promos = this.promotionsSignal();
    return {
      active: promos.filter(p => p.status === 'active').length,
      scheduled: promos.filter(p => p.status === 'scheduled').length,
      expired: promos.filter(p => p.status === 'expired').length,
      disabled: promos.filter(p => p.status === 'disabled').length,
    };
  });

  constructor() {
    this.http.get<any>('/api/promotions?limit=100').subscribe(res =>
      this.promotionsSignal.set(res.data ?? res),
    );
  }

  getAll(): Promotion[] {
    return this.promotionsSignal();
  }

  getById(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(`/api/promotions/${id}`);
  }

  create(promo: Omit<Promotion, 'id' | 'createdAt'>): Observable<Promotion> {
    return this.http.post<Promotion>('/api/promotions', promo).pipe(
      tap(newPromo => {
        this.promotionsSignal.update(list => [newPromo, ...list]);
      }),
    );
  }

  update(id: string, changes: Partial<Promotion>): Observable<Promotion> {
    return this.http.put<Promotion>(`/api/promotions/${id}`, changes).pipe(
      tap(updated => {
        this.promotionsSignal.update(list =>
          list.map(item => item.id === id ? updated : item),
        );
      }),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/api/promotions/${id}`).pipe(
      tap(() => {
        this.promotionsSignal.update(list => list.filter(p => p.id !== id));
      }),
    );
  }

  toggleStatus(id: string): void {
    this.promotionsSignal.update(list =>
      list.map(p => {
        if (p.id !== id) return p;
        const newStatus: PromotionStatus = p.status === 'active' ? 'disabled' : 'active';
        return { ...p, status: newStatus };
      }),
    );
    const promo = this.promotionsSignal().find(p => p.id === id);
    if (promo) {
      this.http.put<Promotion>(`/api/promotions/${id}`, promo).subscribe();
    }
  }

  generateCouponCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
