import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../../../data/models/product.model';
import { DecimalPipe } from '@angular/common';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

type DetailTab = 'details' | 'variants' | 'reviews';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink,
    DecimalPipe,
    BadgeComponent,
    CurrencyFormatPipe,
    StatusBadgePipe,
    RelativeTimePipe,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  readonly product = signal<Product | null>(null);
  readonly activeTab = signal<DetailTab>('details');
  readonly selectedImageIndex = signal(0);

  readonly primaryImage = computed(() => {
    const p = this.product();
    if (!p || p.images.length === 0) return '';
    return p.images[this.selectedImageIndex()]?.url ?? p.images[0].url;
  });

  readonly profit = computed(() => {
    const p = this.product();
    if (!p || !p.cost) return null;
    return p.price - p.cost;
  });

  readonly margin = computed(() => {
    const p = this.product();
    if (!p || !p.cost || p.price === 0) return null;
    return ((p.price - p.cost) / p.price) * 100;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(id).subscribe(found => {
        if (found) {
          this.product.set(found);
        } else {
          this.router.navigate(['/products']);
        }
      });
    }
  }

  setTab(tab: DetailTab): void {
    this.activeTab.set(tab);
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  getStockClass(product: Product): string {
    if (product.stock === 0) return 'stock--out';
    if (product.stock <= product.lowStockThreshold) return 'stock--low';
    return 'stock--ok';
  }

  getStarArray(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push('full');
      else if (rating >= i - 0.5) stars.push('half');
      else stars.push('empty');
    }
    return stars;
  }

  getAttributeEntries(attributes: Record<string, string>): { key: string; value: string }[] {
    return Object.entries(attributes).map(([key, value]) => ({ key, value }));
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
