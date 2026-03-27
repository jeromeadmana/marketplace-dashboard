import { Pipe, PipeTransform } from '@angular/core';

export interface BadgeStyle {
  label: string;
  cssClass: string;
}

const STATUS_MAP: Record<string, BadgeStyle> = {
  // Order statuses
  pending: { label: 'Pending', cssClass: 'badge--warning' },
  processing: { label: 'Processing', cssClass: 'badge--info' },
  shipped: { label: 'Shipped', cssClass: 'badge--primary' },
  delivered: { label: 'Delivered', cssClass: 'badge--success' },
  cancelled: { label: 'Cancelled', cssClass: 'badge--danger' },
  refunded: { label: 'Refunded', cssClass: 'badge--muted' },
  // Payment statuses
  paid: { label: 'Paid', cssClass: 'badge--success' },
  failed: { label: 'Failed', cssClass: 'badge--danger' },
  // Product statuses
  draft: { label: 'Draft', cssClass: 'badge--muted' },
  active: { label: 'Active', cssClass: 'badge--success' },
  archived: { label: 'Archived', cssClass: 'badge--muted' },
  // Promotion statuses
  scheduled: { label: 'Scheduled', cssClass: 'badge--info' },
  expired: { label: 'Expired', cssClass: 'badge--muted' },
  disabled: { label: 'Disabled', cssClass: 'badge--danger' },
  // Segments
  new: { label: 'New', cssClass: 'badge--info' },
  returning: { label: 'Returning', cssClass: 'badge--primary' },
  vip: { label: 'VIP', cssClass: 'badge--warning' },
  // Sentiment
  positive: { label: 'Positive', cssClass: 'badge--success' },
  neutral: { label: 'Neutral', cssClass: 'badge--muted' },
  negative: { label: 'Negative', cssClass: 'badge--danger' },
};

@Pipe({ name: 'statusBadge', standalone: true })
export class StatusBadgePipe implements PipeTransform {
  transform(value: string | null | undefined): BadgeStyle {
    if (!value) return { label: '—', cssClass: 'badge--muted' };
    return STATUS_MAP[value] ?? { label: value, cssClass: 'badge--muted' };
  }
}
