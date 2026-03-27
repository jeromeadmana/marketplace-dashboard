import { Component, inject, signal, computed } from '@angular/core';
import { Product } from '../../../data/models/product.model';
import { InventoryService, StockStatus } from '../inventory.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

type TabKey = 'stock-levels' | 'restock-requests' | 'history-log';

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [
    BadgeComponent,
    SearchInputComponent,
    ModalComponent,
    EmptyStateComponent,
    RelativeTimePipe,
  ],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.scss',
})
export class InventoryPage {
  readonly service = inject(InventoryService);

  // Tab state
  readonly activeTab = signal<TabKey>('stock-levels');
  readonly tabs: { key: TabKey; label: string }[] = [
    { key: 'stock-levels', label: 'Stock Levels' },
    { key: 'restock-requests', label: 'Restock Requests' },
    { key: 'history-log', label: 'History Log' },
  ];

  // Stock levels filters
  readonly searchQuery = signal('');
  readonly stockFilter = signal<StockStatus | 'all'>('all');

  // Restock filter
  readonly restockStatusFilter = signal<string>('all');

  // Adjust stock modal
  readonly adjustModalOpen = signal(false);
  readonly selectedProduct = signal<Product | null>(null);
  readonly adjustNewStock = signal(0);
  readonly adjustNote = signal('');

  // New request modal
  readonly newRequestModalOpen = signal(false);
  readonly requestProductId = signal('');
  readonly requestQuantity = signal(0);

  // Computed: filtered products
  readonly filteredProducts = computed(() => {
    let products = this.service.products();
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      products = products.filter(p => p.name.toLowerCase().includes(q));
    }
    const filter = this.stockFilter();
    if (filter !== 'all') {
      products = products.filter(p => this.service.getStockStatus(p) === filter);
    }
    return products;
  });

  // Computed: filtered restock requests
  readonly filteredRequests = computed(() => {
    let requests = this.service.restockRequests();
    const filter = this.restockStatusFilter();
    if (filter !== 'all') {
      requests = requests.filter(r => r.status === filter);
    }
    return requests;
  });

  setTab(key: TabKey): void {
    this.activeTab.set(key);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }

  onStockFilter(event: Event): void {
    this.stockFilter.set((event.target as HTMLSelectElement).value as StockStatus | 'all');
  }

  onRestockFilter(event: Event): void {
    this.restockStatusFilter.set((event.target as HTMLSelectElement).value);
  }

  // Adjust stock modal
  openAdjustModal(product: Product): void {
    this.selectedProduct.set(product);
    this.adjustNewStock.set(product.stock);
    this.adjustNote.set('');
    this.adjustModalOpen.set(true);
  }

  closeAdjustModal(): void {
    this.adjustModalOpen.set(false);
    this.selectedProduct.set(null);
  }

  onAdjustStockInput(event: Event): void {
    this.adjustNewStock.set(+(event.target as HTMLInputElement).value);
  }

  onAdjustNoteInput(event: Event): void {
    this.adjustNote.set((event.target as HTMLTextAreaElement).value);
  }

  confirmAdjust(): void {
    const product = this.selectedProduct();
    if (!product) return;
    const newStock = this.adjustNewStock();
    const note = this.adjustNote() || 'Manual stock adjustment';
    const diff = newStock - product.stock;
    this.service.updateStock(product.id, newStock);
    this.service.addHistoryEntry(product.id, 'adjustment', diff, note);
    this.closeAdjustModal();
  }

  // Restock request actions
  approveRequest(id: string): void {
    this.service.updateRequestStatus(id, 'approved');
  }

  rejectRequest(id: string): void {
    this.service.updateRequestStatus(id, 'rejected');
  }

  // New request modal
  openNewRequestModal(): void {
    this.requestProductId.set('');
    this.requestQuantity.set(0);
    this.newRequestModalOpen.set(true);
  }

  closeNewRequestModal(): void {
    this.newRequestModalOpen.set(false);
  }

  onRequestProductChange(event: Event): void {
    this.requestProductId.set((event.target as HTMLSelectElement).value);
  }

  onRequestQuantityInput(event: Event): void {
    this.requestQuantity.set(+(event.target as HTMLInputElement).value);
  }

  confirmNewRequest(): void {
    const productId = this.requestProductId();
    const quantity = this.requestQuantity();
    if (!productId || !quantity) return;
    this.service.createRestockRequest(productId, quantity);
    this.closeNewRequestModal();
  }
}
