import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge" [class]="cssClass()">{{ label() }}</span>`,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.125rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      line-height: 1.5;
      white-space: nowrap;
    }

    .badge--success { background: var(--badge-success-bg); color: var(--badge-success-text); }
    .badge--danger { background: var(--badge-danger-bg); color: var(--badge-danger-text); }
    .badge--warning { background: var(--badge-warning-bg); color: var(--badge-warning-text); }
    .badge--info { background: var(--badge-info-bg); color: var(--badge-info-text); }
    .badge--primary { background: var(--badge-primary-bg); color: var(--badge-primary-text); }
    .badge--muted { background: var(--badge-muted-bg); color: var(--badge-muted-text); }
  `,
})
export class BadgeComponent {
  readonly label = input('');
  readonly cssClass = input('badge--muted');
}
