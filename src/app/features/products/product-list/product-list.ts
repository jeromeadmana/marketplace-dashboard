import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product, ProductStatus } from '../../../data/models/product.model';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'price' | 'stock' | 'salesCount';
type SortDir = 'asc' | 'desc';
type StatusTab = 'all' | ProductStatus;

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    SearchInputComponent,
    PaginatorComponent,
    BadgeComponent,
    EmptyStateComponent,
    ModalComponent,
    CurrencyFormatPipe,
    StatusBadgePipe,
    RelativeTimePipe,
    SkeletonComponent,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly loading = signal(true);

  readonly viewMode = signal<ViewMode>('grid');
  readonly searchQuery = signal('');
  readonly statusTab = signal<StatusTab>('all');
  readonly categoryFilter = signal('');
  readonly sortField = signal<SortField>('name');
  readonly sortDir = signal<SortDir>('asc');
  readonly currentPage = signal(1);
  readonly selectedIds = signal<Set<string>>(new Set());
  readonly showDeleteModal = signal(false);
  readonly priceMin = signal<number | null>(null);
  readonly priceMax = signal<number | null>(null);

  readonly categories = this.productService.categories;

  ngOnInit(): void {
    setTimeout(() => this.loading.set(false), 800);
  }

  readonly pageSize = computed(() => this.viewMode() === 'grid' ? 12 : 10);

  readonly filteredProducts = computed(() => {
    let products = this.productService.products();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.statusTab();
    const category = this.categoryFilter();
    const minPrice = this.priceMin();
    const maxPrice = this.priceMax();

    if (query) {
      products = products.filter(p => p.name.toLowerCase().includes(query));
    }
    if (status !== 'all') {
      products = products.filter(p => p.status === status);
    }
    if (category) {
      products = products.filter(p => p.category === category);
    }
    if (minPrice !== null && minPrice > 0) {
      products = products.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== null && maxPrice > 0) {
      products = products.filter(p => p.price <= maxPrice);
    }

    const field = this.sortField();
    const dir = this.sortDir();
    products = [...products].sort((a, b) => {
      let cmp = 0;
      if (field === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else {
        cmp = (a[field] as number) - (b[field] as number);
      }
      return dir === 'asc' ? cmp : -cmp;
    });

    return products;
  });

  readonly totalFiltered = computed(() => this.filteredProducts().length);

  readonly paginatedProducts = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.filteredProducts().slice(start, start + size);
  });

  readonly allPageSelected = computed(() => {
    const pageProducts = this.paginatedProducts();
    if (pageProducts.length === 0) return false;
    const sel = this.selectedIds();
    return pageProducts.every(p => sel.has(p.id));
  });

  readonly selectionCount = computed(() => this.selectedIds().size);

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  setStatusTab(tab: StatusTab): void {
    this.statusTab.set(tab);
    this.currentPage.set(1);
    this.clearSelection();
  }

  setCategory(cat: string): void {
    this.categoryFilter.set(cat);
    this.currentPage.set(1);
  }

  setSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
  }

  setPriceMin(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.priceMin.set(val ? Number(val) : null);
    this.currentPage.set(1);
  }

  setPriceMax(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.priceMax.set(val ? Number(val) : null);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  toggleView(mode: ViewMode): void {
    this.viewMode.set(mode);
    this.currentPage.set(1);
  }

  toggleSelect(id: string): void {
    this.selectedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  toggleSelectAll(): void {
    const pageProducts = this.paginatedProducts();
    if (this.allPageSelected()) {
      this.selectedIds.update(set => {
        const next = new Set(set);
        pageProducts.forEach(p => next.delete(p.id));
        return next;
      });
    } else {
      this.selectedIds.update(set => {
        const next = new Set(set);
        pageProducts.forEach(p => next.add(p.id));
        return next;
      });
    }
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  bulkSetStatus(status: ProductStatus): void {
    const ids = Array.from(this.selectedIds());
    this.productService.bulkUpdateStatus(ids, status).subscribe(() => {
      this.clearSelection();
    });
  }

  bulkDelete(): void {
    const ids = Array.from(this.selectedIds());
    this.productService.bulkDelete(ids).subscribe(() => {
      this.clearSelection();
      this.showDeleteModal.set(false);
    });
  }

  confirmBulkDelete(): void {
    this.showDeleteModal.set(true);
  }

  getStockClass(product: Product): string {
    if (product.stock === 0) return 'product-card__stock--out';
    if (product.stock <= product.lowStockThreshold) return 'product-card__stock--low';
    return 'product-card__stock--ok';
  }

  getPrimaryImage(product: Product): string {
    const primary = product.images.find(i => i.isPrimary);
    return primary?.url ?? product.images[0]?.url ?? '';
  }

  getStarArray(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('full');
      } else if (rating >= i - 0.5) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  navigateTo(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }
}
