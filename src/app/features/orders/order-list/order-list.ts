import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrderStatus, PaymentStatus } from '../../../data/models/order.model';
import { OrderService } from '../order.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';

type StatusTab = 'all' | OrderStatus;
type SortField = 'orderNumber' | 'customerName' | 'total' | 'createdAt';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    BadgeComponent,
    SearchInputComponent,
    PaginatorComponent,
    EmptyStateComponent,
    CurrencyFormatPipe,
    RelativeTimePipe,
    StatusBadgePipe,
    SkeletonComponent,
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  readonly loading = signal(true);

  readonly activeTab = signal<StatusTab>('all');
  readonly searchQuery = signal('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');
  readonly paymentFilter = signal<PaymentStatus | ''>('');
  readonly sortField = signal<SortField>('createdAt');
  readonly sortDir = signal<SortDir>('desc');
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly tabs: { key: StatusTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  readonly counts = this.orderService.statusCounts;

  ngOnInit(): void {
    setTimeout(() => this.loading.set(false), 800);
  }

  readonly filteredOrders = computed(() => {
    let orders = this.orderService.orders();
    const tab = this.activeTab();
    if (tab !== 'all') {
      orders = orders.filter(o => o.status === tab);
    }
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      orders = orders.filter(
        o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q),
      );
    }
    const from = this.dateFrom();
    if (from) {
      orders = orders.filter(o => o.createdAt >= from);
    }
    const to = this.dateTo();
    if (to) {
      orders = orders.filter(o => o.createdAt <= to + 'T23:59:59Z');
    }
    const payment = this.paymentFilter();
    if (payment) {
      orders = orders.filter(o => o.paymentStatus === payment);
    }
    const field = this.sortField();
    const dir = this.sortDir();
    orders = [...orders].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return dir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return orders;
  });

  readonly totalFiltered = computed(() => this.filteredOrders().length);

  readonly paginatedOrders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredOrders().slice(start, start + this.pageSize);
  });

  setTab(tab: StatusTab): void {
    this.activeTab.set(tab);
    this.currentPage.set(1);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  onDateFrom(event: Event): void {
    this.dateFrom.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  onDateTo(event: Event): void {
    this.dateTo.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }

  onPaymentFilter(event: Event): void {
    this.paymentFilter.set((event.target as HTMLSelectElement).value as PaymentStatus | '');
    this.currentPage.set(1);
  }

  toggleSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
  }

  getSortIcon(field: SortField): string {
    if (this.sortField() !== field) return '';
    return this.sortDir() === 'asc' ? ' \u25B2' : ' \u25BC';
  }

  getTabCount(tab: StatusTab): number {
    const c = this.counts();
    return c[tab as keyof typeof c] ?? 0;
  }

  goToDetail(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  exportCsv(): void {
    const orders = this.filteredOrders();
    const header = 'Order Number,Customer,Email,Items,Total,Status,Payment,Date\n';
    const rows = orders.map(o =>
      [
        o.orderNumber,
        `"${o.customerName}"`,
        o.customerEmail,
        o.items.length,
        o.total.toFixed(2),
        o.status,
        o.paymentStatus,
        o.createdAt,
      ].join(','),
    );
    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
