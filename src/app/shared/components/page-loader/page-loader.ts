import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  template: `
    @if (loading()) {
      <ng-content select="[skeleton]" />
    } @else {
      <ng-content />
    }
  `,
})
export class PageLoaderComponent {
  readonly loading = input(true);
}
