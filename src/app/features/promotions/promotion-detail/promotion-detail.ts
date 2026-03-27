import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PromotionService } from '../promotion.service';
import { Promotion } from '../../../data/models/promotion.model';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-promotion-detail',
  standalone: true,
  imports: [
    RouterLink,
    BadgeComponent,
    ModalComponent,
    CurrencyFormatPipe,
    StatusBadgePipe,
  ],
  templateUrl: './promotion-detail.html',
  styleUrl: './promotion-detail.scss',
})
export class PromotionDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly promotionService = inject(PromotionService);

  readonly promo = signal<Promotion | null>(null);
  readonly codeCopied = signal(false);
  readonly showDeleteModal = signal(false);

  readonly discountDisplay = computed(() => {
    const p = this.promo();
    if (!p) return '';
    if (p.discountType === 'percentage') return p.discountValue + '%';
    return '$' + p.discountValue.toFixed(2);
  });

  readonly dateRange = computed(() => {
    const p = this.promo();
    if (!p) return '';
    const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
    return fmt(p.startDate) + ' — ' + fmt(p.endDate);
  });

  readonly avgOrderValue = computed(() => {
    const p = this.promo();
    if (!p || p.usageCount === 0) return 0;
    return p.revenue / p.usageCount;
  });

  readonly conditionsList = computed(() => {
    const p = this.promo();
    if (!p) return [];
    const items: string[] = [];
    const c = p.conditions;
    if (c.minOrderAmount) items.push('Minimum order: $' + c.minOrderAmount.toFixed(2));
    if (c.maxUsesTotal) items.push('Max total uses: ' + c.maxUsesTotal);
    if (c.maxUsesPerCustomer) items.push('Max uses per customer: ' + c.maxUsesPerCustomer);
    if (c.applicableCategories?.length) items.push('Categories: ' + c.applicableCategories.join(', '));
    if (items.length === 0) items.push('No conditions — applies to all orders');
    return items;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.promotionService.getById(id).subscribe(found => {
        if (found) {
          this.promo.set(found);
        } else {
          this.router.navigate(['/promotions']);
        }
      });
    }
  }

  copyCode(): void {
    const p = this.promo();
    if (!p) return;
    navigator.clipboard.writeText(p.code).then(() => {
      this.codeCopied.set(true);
      setTimeout(() => this.codeCopied.set(false), 2000);
    });
  }

  toggleStatus(): void {
    const p = this.promo();
    if (!p) return;
    this.promotionService.toggleStatus(p.id);
    this.promotionService.getById(p.id).subscribe(updated => {
      this.promo.set(updated ?? null);
    });
  }

  confirmDelete(): void {
    this.showDeleteModal.set(true);
  }

  executeDelete(): void {
    const p = this.promo();
    if (!p) return;
    this.promotionService.delete(p.id).subscribe(() => {
      this.showDeleteModal.set(false);
      this.router.navigate(['/promotions']);
    });
  }

  goBack(): void {
    this.router.navigate(['/promotions']);
  }
}
