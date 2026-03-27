import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { PromotionService } from '../promotion.service';
import { Promotion, PromotionStatus } from '../../../data/models/promotion.model';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';

type StatusTab = 'all' | PromotionStatus;

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    SearchInputComponent,
    PaginatorComponent,
    BadgeComponent,
    EmptyStateComponent,
    ModalComponent,
    CurrencyFormatPipe,
    StatusBadgePipe,
  ],
  templateUrl: './promotion-list.html',
  styleUrl: './promotion-list.scss',
})
export class PromotionList {
  private readonly promotionService = inject(PromotionService);
  private readonly router = inject(Router);

  readonly searchQuery = signal('');
  readonly statusTab = signal<StatusTab>('all');
  readonly currentPage = signal(1);
  readonly pageSize = 10;
  readonly showDeleteModal = signal(false);
  readonly deleteTargetId = signal<string | null>(null);

  readonly statusCounts = this.promotionService.statusCounts;

  readonly totalAll = computed(() => this.promotionService.promotions().length);

  readonly filteredPromotions = computed(() => {
    let promos = this.promotionService.promotions();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.statusTab();

    if (query) {
      promos = promos.filter(p =>
        p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query),
      );
    }
    if (status !== 'all') {
      promos = promos.filter(p => p.status === status);
    }

    return promos;
  });

  readonly totalFiltered = computed(() => this.filteredPromotions().length);

  readonly paginatedPromotions = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return this.filteredPromotions().slice(start, start + this.pageSize);
  });

  readonly summaryActiveCount = computed(() => this.statusCounts().active);

  readonly summaryTotalRevenue = computed(() =>
    this.promotionService.promotions().reduce((sum, p) => sum + p.revenue, 0),
  );

  readonly summaryTotalUsage = computed(() =>
    this.promotionService.promotions().reduce((sum, p) => sum + p.usageCount, 0),
  );

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  setStatusTab(tab: StatusTab): void {
    this.statusTab.set(tab);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  formatDiscount(promo: Promotion): string {
    if (promo.discountType === 'percentage') {
      return promo.discountValue + '%';
    }
    return '$' + promo.discountValue.toFixed(2);
  }

  formatDateRange(promo: Promotion): string {
    const start = new Date(promo.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const end = new Date(promo.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return start + ' - ' + end;
  }

  navigateTo(promo: Promotion): void {
    this.router.navigate(['/promotions', promo.id]);
  }

  editPromo(promo: Promotion, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/promotions', promo.id, 'edit']);
  }

  toggleStatus(promo: Promotion, event: Event): void {
    event.stopPropagation();
    this.promotionService.toggleStatus(promo.id);
  }

  confirmDelete(promo: Promotion, event: Event): void {
    event.stopPropagation();
    this.deleteTargetId.set(promo.id);
    this.showDeleteModal.set(true);
  }

  executeDelete(): void {
    const id = this.deleteTargetId();
    if (id) {
      this.promotionService.delete(id);
    }
    this.showDeleteModal.set(false);
    this.deleteTargetId.set(null);
  }
}
