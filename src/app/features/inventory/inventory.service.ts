import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../data/models/product.model';
import { MOCK_PRODUCTS } from '../../data/mock/products.mock';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';
export type RestockRequestStatus = 'pending' | 'approved' | 'rejected';
export type HistoryEntryType = 'restock' | 'sale' | 'adjustment';

export interface RestockRequest {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  status: RestockRequestStatus;
  createdAt: string;
}

export interface InventoryHistoryEntry {
  id: string;
  productId: string;
  productName: string;
  type: HistoryEntryType;
  quantity: number;
  note: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly _products = signal<Product[]>(
    MOCK_PRODUCTS.filter(p => p.status === 'active'),
  );

  private readonly _restockRequests = signal<RestockRequest[]>([
    {
      id: 'rr-001', productId: 'prod-003', productName: 'Smart Home Hub Pro',
      quantity: 50, status: 'pending', createdAt: '2026-03-26T09:00:00Z',
    },
    {
      id: 'rr-002', productId: 'prod-005', productName: 'Running Shoes Ultra Boost',
      quantity: 100, status: 'approved', createdAt: '2026-03-24T14:30:00Z',
    },
    {
      id: 'rr-003', productId: 'prod-008', productName: 'Leather Messenger Bag',
      quantity: 30, status: 'pending', createdAt: '2026-03-27T11:00:00Z',
    },
    {
      id: 'rr-004', productId: 'prod-001', productName: 'Wireless Noise-Cancelling Headphones',
      quantity: 75, status: 'rejected', createdAt: '2026-03-20T08:00:00Z',
    },
  ]);

  private readonly _historyLog = signal<InventoryHistoryEntry[]>([
    {
      id: 'h-001', productId: 'prod-001', productName: 'Wireless Noise-Cancelling Headphones',
      type: 'sale', quantity: -12, note: 'Bulk order fulfillment', createdAt: '2026-03-27T16:30:00Z',
    },
    {
      id: 'h-002', productId: 'prod-002', productName: 'Organic Cotton T-Shirt',
      type: 'restock', quantity: 200, note: 'Supplier shipment received', createdAt: '2026-03-27T10:00:00Z',
    },
    {
      id: 'h-003', productId: 'prod-006', productName: 'Mechanical Keyboard RGB',
      type: 'adjustment', quantity: -5, note: 'Damaged units removed', createdAt: '2026-03-26T14:15:00Z',
    },
    {
      id: 'h-004', productId: 'prod-009', productName: 'Stainless Steel Water Bottle',
      type: 'sale', quantity: -34, note: 'Weekend flash sale orders', createdAt: '2026-03-26T09:00:00Z',
    },
    {
      id: 'h-005', productId: 'prod-004', productName: 'Artisan Ceramic Coffee Mug Set',
      type: 'restock', quantity: 50, note: 'Artisan batch delivery', createdAt: '2026-03-25T11:30:00Z',
    },
    {
      id: 'h-006', productId: 'prod-005', productName: 'Running Shoes Ultra Boost',
      type: 'sale', quantity: -8, note: 'Online orders', createdAt: '2026-03-25T08:45:00Z',
    },
    {
      id: 'h-007', productId: 'prod-007', productName: 'Yoga Mat Premium',
      type: 'adjustment', quantity: 10, note: 'Inventory recount correction', createdAt: '2026-03-24T15:00:00Z',
    },
    {
      id: 'h-008', productId: 'prod-010', productName: 'Bluetooth Portable Speaker',
      type: 'restock', quantity: 100, note: 'Warehouse transfer', createdAt: '2026-03-23T13:00:00Z',
    },
  ]);

  private _nextRequestId = 5;
  private _nextHistoryId = 9;

  // Public read-only signals
  readonly products = this._products.asReadonly();
  readonly restockRequests = this._restockRequests.asReadonly();
  readonly historyLog = computed(() =>
    [...this._historyLog()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  );

  // Computed summary signals
  readonly totalProducts = computed(() => this._products().length);

  readonly lowStockCount = computed(() =>
    this._products().filter(p => this.getStockStatus(p) === 'low-stock').length,
  );

  readonly outOfStockCount = computed(() =>
    this._products().filter(p => this.getStockStatus(p) === 'out-of-stock').length,
  );

  readonly inStockCount = computed(() =>
    this._products().filter(p => this.getStockStatus(p) === 'in-stock').length,
  );

  getAll(): Product[] {
    return this._products();
  }

  getById(id: string): Product | undefined {
    return this._products().find(p => p.id === id);
  }

  getStockStatus(product: Product): StockStatus {
    if (product.stock <= 0) return 'out-of-stock';
    if (product.stock < product.lowStockThreshold) return 'low-stock';
    return 'in-stock';
  }

  updateStock(id: string, newStock: number): void {
    this._products.update(products =>
      products.map(p => p.id === id ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p),
    );
  }

  createRestockRequest(productId: string, quantity: number): void {
    const product = this.getById(productId);
    if (!product) return;
    const request: RestockRequest = {
      id: `rr-${String(this._nextRequestId++).padStart(3, '0')}`,
      productId,
      productName: product.name,
      quantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this._restockRequests.update(list => [request, ...list]);
  }

  updateRequestStatus(id: string, status: RestockRequestStatus): void {
    this._restockRequests.update(list =>
      list.map(r => r.id === id ? { ...r, status } : r),
    );
  }

  addHistoryEntry(productId: string, type: HistoryEntryType, quantity: number, note: string): void {
    const product = this.getById(productId);
    if (!product) return;
    const entry: InventoryHistoryEntry = {
      id: `h-${String(this._nextHistoryId++).padStart(3, '0')}`,
      productId,
      productName: product.name,
      type,
      quantity,
      note,
      createdAt: new Date().toISOString(),
    };
    this._historyLog.update(list => [entry, ...list]);
  }
}
