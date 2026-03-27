import { Component, computed, inject, signal } from '@angular/core';
import { ReviewService } from '../review.service';
import { ReviewSentiment } from '../../../data/models/review.model';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [
    SearchInputComponent,
    PaginatorComponent,
    ModalComponent,
    BadgeComponent,
    EmptyStateComponent,
    RelativeTimePipe,
  ],
  templateUrl: './review-list.html',
  styleUrl: './review-list.scss',
})
export class ReviewList {
  readonly reviewService = inject(ReviewService);

  readonly Math = Math;
  readonly pageSize = 5;

  readonly searchQuery = signal('');
  readonly ratingFilter = signal(0);
  readonly sentimentFilter = signal<ReviewSentiment | 'all'>('all');
  readonly currentPage = signal(1);

  readonly replyModalOpen = signal(false);
  readonly replyReviewId = signal<string | null>(null);
  readonly replyText = signal('');

  readonly sentimentTabs: { label: string; value: ReviewSentiment | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Positive', value: 'positive' },
    { label: 'Neutral', value: 'neutral' },
    { label: 'Negative', value: 'negative' },
  ];

  readonly filteredReviews = computed(() => {
    let reviews = this.reviewService.getAll();
    const query = this.searchQuery().toLowerCase().trim();
    const rating = this.ratingFilter();
    const sentiment = this.sentimentFilter();

    if (query) {
      reviews = reviews.filter(
        r =>
          r.productName.toLowerCase().includes(query) ||
          r.customerName.toLowerCase().includes(query),
      );
    }

    if (rating > 0) {
      reviews = reviews.filter(r => r.rating === rating);
    }

    if (sentiment !== 'all') {
      reviews = reviews.filter(r => r.sentiment === sentiment);
    }

    return reviews;
  });

  readonly paginatedReviews = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredReviews().slice(start, start + this.pageSize);
  });

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  onRatingFilter(event: Event): void {
    this.ratingFilter.set(Number((event.target as HTMLSelectElement).value));
    this.currentPage.set(1);
  }

  getSentimentBadgeClass(sentiment: ReviewSentiment): string {
    const map: Record<ReviewSentiment, string> = {
      positive: 'badge badge--success',
      neutral: 'badge badge--muted',
      negative: 'badge badge--danger',
    };
    return map[sentiment];
  }

  openReplyModal(reviewId: string): void {
    this.replyReviewId.set(reviewId);
    this.replyText.set('');
    this.replyModalOpen.set(true);
  }

  closeReplyModal(): void {
    this.replyModalOpen.set(false);
    this.replyReviewId.set(null);
    this.replyText.set('');
  }

  onReplyInput(event: Event): void {
    this.replyText.set((event.target as HTMLTextAreaElement).value);
  }

  submitReply(): void {
    const id = this.replyReviewId();
    const text = this.replyText().trim();
    if (id && text) {
      this.reviewService.reply(id, text);
      this.closeReplyModal();
    }
  }
}
