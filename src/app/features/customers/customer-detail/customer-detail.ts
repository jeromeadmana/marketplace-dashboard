import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../data/models/customer.model';
import { Order } from '../../../data/models/order.model';
import { CustomerService } from '../customer.service';
import { OrderService } from '../../orders/order.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';

type DetailTab = 'orders' | 'activity';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [
    BadgeComponent,
    EmptyStateComponent,
    CurrencyFormatPipe,
    RelativeTimePipe,
    StatusBadgePipe,
    InitialsPipe,
  ],
  templateUrl: './customer-detail.html',
  styleUrl: './customer-detail.scss',
})
export class CustomerDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);
  private readonly orderService = inject(OrderService);

  readonly customer = signal<Customer | undefined>(undefined);
  readonly orders = signal<Order[]>([]);
  readonly activeTab = signal<DetailTab>('orders');
  readonly newTag = signal('');

  readonly segmentBadge = computed(() => {
    const c = this.customer();
    if (!c) return { label: '', cssClass: 'badge--muted' };
    const map: Record<string, { label: string; cssClass: string }> = {
      new: { label: 'New', cssClass: 'badge--info' },
      returning: { label: 'Returning', cssClass: 'badge--primary' },
      vip: { label: 'VIP', cssClass: 'badge--warning' },
    };
    return map[c.segment] ?? { label: c.segment, cssClass: 'badge--muted' };
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.customerService.getById(id).subscribe(customer => {
      this.customer.set(customer);
      if (customer) {
        this.orderService.getByCustomerId(customer.id).subscribe(orders => {
          this.orders.set(orders);
        });
      }
    });
  }

  setTab(tab: DetailTab): void {
    this.activeTab.set(tab);
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  onTagInput(event: Event): void {
    this.newTag.set((event.target as HTMLInputElement).value);
  }

  addTag(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    const tag = this.newTag().trim().toLowerCase();
    const customer = this.customer();
    if (!tag || !customer) return;
    if (customer.tags.includes(tag)) {
      this.newTag.set('');
      return;
    }
    this.customerService.updateTags(customer.id, [...customer.tags, tag]).subscribe(updated => {
      if (updated) this.customer.set(updated);
    });
    this.newTag.set('');
  }

  removeTag(tag: string): void {
    const customer = this.customer();
    if (!customer) return;
    this.customerService.updateTags(
      customer.id,
      customer.tags.filter(t => t !== tag),
    ).subscribe(updated => {
      if (updated) this.customer.set(updated);
    });
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      order: '\uD83D\uDCE6',
      review: '\u2B50',
      return: '\uD83D\uDD04',
      support: '\uD83C\uDFA7',
      login: '\uD83D\uDD11',
    };
    return icons[type] ?? '\u25CF';
  }

  getActivityDotClass(type: string): string {
    const classes: Record<string, string> = {
      order: 'customer-detail__timeline-dot--order',
      review: 'customer-detail__timeline-dot--review',
      return: 'customer-detail__timeline-dot--return',
      support: 'customer-detail__timeline-dot--support',
      login: 'customer-detail__timeline-dot--login',
    };
    return classes[type] ?? '';
  }
}
