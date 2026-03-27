import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">{{ icon() }}</div>
      <h3 class="empty-state__title">{{ title() }}</h3>
      <p class="empty-state__message">{{ message() }}</p>
      <ng-content />
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 1.5rem;
      text-align: center;

      &__icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
      &__title { margin: 0; font-size: 1.125rem; color: var(--text-primary); font-weight: 600; }
      &__message { margin: 0.5rem 0 1.5rem; color: var(--text-secondary); font-size: 0.875rem; max-width: 360px; }
    }
  `,
})
export class EmptyStateComponent {
  readonly icon = input('📭');
  readonly title = input('Nothing here yet');
  readonly message = input('');
}
