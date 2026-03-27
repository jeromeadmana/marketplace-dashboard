import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';
import { StatusBadgePipe } from '../../shared/pipes/status-badge.pipe';
import { BadgeComponent } from '../../shared/components/badge/badge';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton';
import { ActivityFeedService } from '../../core/services/activity-feed.service';
import { MOCK_ANALYTICS } from '../../data/mock';
import { MOCK_ORDERS } from '../../data/mock';
import { MOCK_PRODUCTS } from '../../data/mock';
import { listAnimation } from '../../shared/animations/list.animation';
import { fadeInUp } from '../../shared/animations/fade.animation';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe, CurrencyFormatPipe, RelativeTimePipe, StatusBadgePipe, BadgeComponent, SkeletonComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  animations: [listAnimation, fadeInUp],
})
export class DashboardComponent implements OnInit {
  readonly loading = signal(true);

  protected readonly activityFeed = inject(ActivityFeedService);
  protected readonly analytics = MOCK_ANALYTICS;
  protected readonly recentOrders = MOCK_ORDERS.slice(0, 5);
  protected readonly topProducts = MOCK_ANALYTICS.topProducts;
  protected readonly lowStockProducts = MOCK_PRODUCTS.filter(p => p.stock <= p.lowStockThreshold * 1.5).slice(0, 5);

  ngOnInit(): void {
    this.activityFeed.start();
    setTimeout(() => this.loading.set(false), 600);
  }
}
