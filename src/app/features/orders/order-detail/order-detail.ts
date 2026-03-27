import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Order, OrderNote, OrderStatus } from '../../../data/models/order.model';
import { OrderService } from '../order.service';
import { BadgeComponent } from '../../../shared/components/badge/badge';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { StatusBadgePipe } from '../../../shared/pipes/status-badge.pipe';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StatusAction {
  label: string;
  targetStatus: OrderStatus;
  btnClass: string;
}

const STATUS_TRANSITIONS: Record<string, StatusAction[]> = {
  pending: [
    { label: 'Mark as Processing', targetStatus: 'processing', btnClass: 'btn--primary' },
    { label: 'Cancel Order', targetStatus: 'cancelled', btnClass: 'btn--danger' },
  ],
  processing: [
    { label: 'Mark as Shipped', targetStatus: 'shipped', btnClass: 'btn--primary' },
    { label: 'Cancel Order', targetStatus: 'cancelled', btnClass: 'btn--danger' },
  ],
  shipped: [
    { label: 'Mark as Delivered', targetStatus: 'delivered', btnClass: 'btn--primary' },
  ],
  delivered: [],
  cancelled: [],
  refunded: [],
};

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    BadgeComponent,
    ModalComponent,
    CurrencyFormatPipe,
    RelativeTimePipe,
    StatusBadgePipe,
    DatePipe,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);

  readonly noteText = signal('');
  readonly noteInternal = signal(true);

  readonly showConfirmModal = signal(false);
  readonly pendingAction = signal<StatusAction | null>(null);

  readonly statusActions = computed<StatusAction[]>(() => {
    const o = this.order();
    if (!o) return [];
    return STATUS_TRANSITIONS[o.status] ?? [];
  });

  readonly sortedTimeline = computed(() => {
    const o = this.order();
    if (!o) return [];
    return [...o.timeline].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getById(id).subscribe(order => {
      this.order.set(order ?? null);
      this.loading.set(false);
    });
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  requestStatusChange(action: StatusAction): void {
    this.pendingAction.set(action);
    this.showConfirmModal.set(true);
  }

  confirmStatusChange(): void {
    const action = this.pendingAction();
    const o = this.order();
    if (!action || !o) return;
    this.showConfirmModal.set(false);
    this.orderService.updateStatus(o.id, action.targetStatus).subscribe(updated => {
      if (updated) this.order.set(updated);
      this.pendingAction.set(null);
    });
  }

  cancelStatusChange(): void {
    this.showConfirmModal.set(false);
    this.pendingAction.set(null);
  }

  addNote(): void {
    const text = this.noteText().trim();
    const o = this.order();
    if (!text || !o) return;
    const note: OrderNote = {
      id: '',
      text,
      author: 'Admin',
      createdAt: new Date().toISOString(),
      isInternal: this.noteInternal(),
    };
    this.orderService.addNote(o.id, note).subscribe(updated => {
      if (updated) this.order.set(updated);
      this.noteText.set('');
    });
  }
}
