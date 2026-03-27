import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Review, ReviewSentiment } from '../../data/models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly _reviews = signal<Review[]>([]);

  readonly reviews = this._reviews.asReadonly();

  readonly totalCount = computed(() => this._reviews().length);

  readonly averageRating = computed(() => {
    const all = this._reviews();
    if (all.length === 0) return 0;
    const sum = all.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / all.length) * 10) / 10;
  });

  readonly ratingDistribution = computed(() => {
    const all = this._reviews();
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of all) {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
    }
    return dist;
  });

  readonly sentimentBreakdown = computed(() => {
    const all = this._reviews();
    return {
      positive: all.filter(r => r.sentiment === 'positive').length,
      neutral: all.filter(r => r.sentiment === 'neutral').length,
      negative: all.filter(r => r.sentiment === 'negative').length,
    };
  });

  constructor() {
    this.http.get<any>('/api/reviews?limit=100').subscribe(res =>
      this._reviews.set(res.data ?? res),
    );
  }

  getAll(): Review[] {
    return this._reviews();
  }

  getById(id: string): Review | undefined {
    return this._reviews().find(r => r.id === id);
  }

  reply(id: string, text: string): Observable<Review> {
    return this.http.post<Review>(`/api/reviews/${id}/reply`, { text }).pipe(
      tap(() => {
        this._reviews.update(reviews =>
          reviews.map(r => {
            if (r.id !== id) return r;
            return {
              ...r,
              reply: {
                text,
                author: 'Store Team',
                createdAt: new Date().toISOString(),
              },
            };
          }),
        );
      }),
    );
  }

  toggleHidden(id: string): Observable<Review> {
    return this.http.patch<Review>(`/api/reviews/${id}/hide`, {}).pipe(
      tap(() => {
        this._reviews.update(reviews =>
          reviews.map(r => {
            if (r.id !== id) return r;
            return { ...r, isHidden: !r.isHidden };
          }),
        );
      }),
    );
  }

  toggleFlagged(id: string): Observable<Review> {
    return this.http.patch<Review>(`/api/reviews/${id}/flag`, {}).pipe(
      tap(() => {
        this._reviews.update(reviews =>
          reviews.map(r => {
            if (r.id !== id) return r;
            return { ...r, isFlagged: !r.isFlagged };
          }),
        );
      }),
    );
  }
}
