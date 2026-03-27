import { Injectable, signal, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

export interface ActivityEvent {
  id: string;
  type: 'order' | 'review' | 'signup' | 'refund' | 'stock';
  message: string;
  timestamp: string;
}

const SAMPLE_EVENTS: Omit<ActivityEvent, 'id' | 'timestamp'>[] = [
  { type: 'order', message: 'New order #ORD-{n} placed — ${amount}' },
  { type: 'review', message: '{customer} left a {stars}-star review on {product}' },
  { type: 'signup', message: 'New customer signed up from {city}' },
  { type: 'refund', message: 'Refund processed for order #ORD-{n} — ${amount}' },
  { type: 'stock', message: '{product} stock running low ({count} remaining)' },
];

const NAMES = ['Sarah', 'Marcus', 'Emily', 'David', 'Aisha', 'James', 'Lisa', 'Tom'];
const PRODUCTS = ['Wireless Headphones', 'Cotton T-Shirt', 'Smart Hub', 'Ceramic Mugs', 'Running Shoes', 'Keyboard RGB', 'Yoga Mat', 'Messenger Bag'];
const CITIES = ['San Francisco', 'New York', 'Austin', 'Chicago', 'Seattle', 'Denver', 'Portland', 'Miami'];

@Injectable({ providedIn: 'root' })
export class ActivityFeedService implements OnDestroy {
  private readonly events = signal<ActivityEvent[]>([]);
  private subscription: Subscription | null = null;
  private orderCounter = 1051;

  readonly feed = this.events.asReadonly();

  start(intervalMs = 8000): void {
    if (this.subscription) return;
    this.generateEvent(); // first one immediately
    this.subscription = interval(intervalMs).subscribe(() => this.generateEvent());
  }

  stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private generateEvent(): void {
    const template = SAMPLE_EVENTS[Math.floor(Math.random() * SAMPLE_EVENTS.length)];
    const message = template.message
      .replace('{n}', String(this.orderCounter++))
      .replace('{amount}', (Math.random() * 400 + 20).toFixed(2))
      .replace('{customer}', NAMES[Math.floor(Math.random() * NAMES.length)])
      .replace('{stars}', String(Math.floor(Math.random() * 4) + 2))
      .replace('{product}', PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)])
      .replace('{city}', CITIES[Math.floor(Math.random() * CITIES.length)])
      .replace('{count}', String(Math.floor(Math.random() * 15) + 3));

    const event: ActivityEvent = {
      id: crypto.randomUUID(),
      type: template.type,
      message,
      timestamp: new Date().toISOString(),
    };

    this.events.update(list => [event, ...list].slice(0, 50));
  }
}
