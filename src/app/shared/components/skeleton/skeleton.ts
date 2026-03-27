import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div
      class="skeleton"
      [style.width]="width()"
      [style.height]="height()"
      [style.border-radius]="circle() ? '50%' : radius()">
    </div>
  `,
  styles: `
    .skeleton {
      background: var(--skeleton-base, #e2e8f0);
      background-image: linear-gradient(
        90deg,
        var(--skeleton-base, #e2e8f0) 0%,
        var(--skeleton-shine, #f1f5f9) 50%,
        var(--skeleton-base, #e2e8f0) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,
})
export class SkeletonComponent {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly circle = input(false);
  readonly radius = input('0.375rem');
}
