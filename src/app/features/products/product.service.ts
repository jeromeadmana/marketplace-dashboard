import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, forkJoin, of } from 'rxjs';
import { Product, ProductStatus } from '../../data/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly productsSignal = signal<Product[]>([]);
  private readonly loadingSignal = signal(false);

  readonly products = this.productsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  readonly categories = computed(() => {
    const cats = new Set(this.productsSignal().map(p => p.category));
    return Array.from(cats).sort();
  });

  constructor(private readonly http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loadingSignal.set(true);
    this.http.get<any>('/api/products?limit=100').subscribe({
      next: (res) => {
        this.productsSignal.set(res.data ?? res);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.loadingSignal.set(false);
      },
    });
  }

  getAll(): Product[] {
    return this.productsSignal();
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    return this.http.post<Product>('/api/products', product).pipe(
      tap(p => this.productsSignal.update(list => [p, ...list])),
    );
  }

  update(id: string, changes: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`/api/products/${id}`, changes).pipe(
      tap(p => this.productsSignal.update(list => list.map(item => item.id === id ? p : item))),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/api/products/${id}`).pipe(
      tap(() => this.productsSignal.update(list => list.filter(p => p.id !== id))),
    );
  }

  bulkUpdateStatus(ids: string[], status: ProductStatus): Observable<void> {
    this.productsSignal.update(list =>
      list.map(p => ids.includes(p.id) ? { ...p, status, updatedAt: new Date().toISOString() } : p),
    );
    const requests = ids.map(id => this.http.put<Product>(`/api/products/${id}`, { status }));
    return requests.length > 0
      ? forkJoin(requests).pipe(tap(() => {})) as unknown as Observable<void>
      : of(undefined as void);
  }

  bulkDelete(ids: string[]): Observable<void> {
    this.productsSignal.update(list => list.filter(p => !ids.includes(p.id)));
    const requests = ids.map(id => this.http.delete<void>(`/api/products/${id}`));
    return requests.length > 0
      ? forkJoin(requests).pipe(tap(() => {})) as unknown as Observable<void>
      : of(undefined as void);
  }
}
