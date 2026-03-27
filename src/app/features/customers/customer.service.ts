import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Customer, CustomerSegment } from '../../data/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly _customers = signal<Customer[]>([]);

  readonly customers = this._customers.asReadonly();

  readonly segmentCounts = computed(() => {
    const all = this._customers();
    return {
      all: all.length,
      new: all.filter(c => c.segment === 'new').length,
      returning: all.filter(c => c.segment === 'returning').length,
      vip: all.filter(c => c.segment === 'vip').length,
    };
  });

  readonly totalRevenue = computed(() =>
    this._customers().reduce((sum, c) => sum + c.totalSpent, 0),
  );

  readonly avgLifetimeValue = computed(() => {
    const customers = this._customers();
    if (customers.length === 0) return 0;
    return this.totalRevenue() / customers.length;
  });

  constructor() {
    this.http.get<any>('/api/customers?limit=100').subscribe(res =>
      this._customers.set(res.data ?? res),
    );
  }

  getAll(): Customer[] {
    return this._customers();
  }

  getById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`/api/customers/${id}`);
  }

  updateTags(id: string, tags: string[]): Observable<Customer> {
    return this.http.put<Customer>(`/api/customers/${id}/tags`, { tags }).pipe(
      tap(updated => {
        this._customers.update(customers =>
          customers.map(c => c.id === id ? { ...c, tags: [...tags] } : c),
        );
      }),
    );
  }

  getSegmentCounts(): Record<'all' | CustomerSegment, number> {
    return this.segmentCounts();
  }
}
