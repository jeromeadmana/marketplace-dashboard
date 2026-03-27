import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer, CustomerSegment } from '../../../data/models/customer.model';
import { CustomerService } from '../customer.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';

type SegmentTab = 'all' | CustomerSegment;
type SortField = 'name' | 'totalSpent' | 'totalOrders' | 'createdAt';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    BadgeComponent,
    SearchInputComponent,
    PaginatorComponent,
    EmptyStateComponent,
    CurrencyFormatPipe,
    RelativeTimePipe,
    StatusBadgePipe,
    InitialsPipe,
    SkeletonComponent,
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  readonly loading = signal(true);

  readonly activeTab = signal<SegmentTab>('all');
  readonly searchQuery = signal('');
  readonly sortField = signal<SortField>('createdAt');
  readonly sortDir = signal<SortDir>('desc');
  readonly currentPage = signal(1);
  readonly pageSize = 10;

  readonly tabs: { key: SegmentTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'returning', label: 'Returning' },
    { key: 'vip', label: 'VIP' },
  ];

  readonly counts = this.customerService.segmentCounts;

  ngOnInit(): void {
    setTimeout(() => this.loading.set(false), 800);
  }
  readonly totalRevenue = this.customerService.totalRevenue;
  readonly avgLifetimeValue = this.customerService.avgLifetimeValue;

  readonly filteredCustomers = computed(() => {
    let customers = this.customerService.customers();
    const tab = this.activeTab();
    if (tab !== 'all') {
      customers = customers.filter(c => c.segment === tab);
    }
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      customers = customers.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
      );
    }
    const field = this.sortField();
    const dir = this.sortDir();
    customers = [...customers].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return dir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return customers;
  });

  readonly totalFiltered = computed(() => this.filteredCustomers().length);

  readonly paginatedCustomers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredCustomers().slice(start, start + this.pageSize);
  });

  setTab(tab: SegmentTab): void {
    this.activeTab.set(tab);
    this.currentPage.set(1);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
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

  getTabCount(tab: SegmentTab): number {
    const c = this.counts();
    return c[tab as keyof typeof c] ?? 0;
  }

  goToDetail(customer: Customer): void {
    this.router.navigate(['/customers', customer.id]);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
