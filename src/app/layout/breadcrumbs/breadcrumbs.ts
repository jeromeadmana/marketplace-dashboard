import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="breadcrumbs">
      @for (crumb of breadcrumbs(); track crumb.url; let last = $last) {
        @if (!last) {
          <a [routerLink]="crumb.url" class="breadcrumbs__link">{{ crumb.label }}</a>
          <span class="breadcrumbs__sep">/</span>
        } @else {
          <span class="breadcrumbs__current">{{ crumb.label }}</span>
        }
      }
    </nav>
  `,
  styles: `
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;

      &__link {
        color: var(--text-tertiary);
        text-decoration: none;
        &:hover { color: var(--primary); text-decoration: none; }
      }

      &__sep { color: var(--text-tertiary); }
      &__current { color: var(--text-primary); font-weight: 500; }
    }
  `,
})
export class BreadcrumbsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly breadcrumbs = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.buildBreadcrumbs(this.route.root)),
    ),
    { initialValue: [] as Breadcrumb[] },
  );

  private buildBreadcrumbs(route: ActivatedRoute, url = '', crumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children = route.children;
    if (children.length === 0) return crumbs;

    for (const child of children) {
      const snapshot = child.snapshot;
      if (!snapshot?.url) continue;
      const segments = snapshot.url.map(s => s.path);
      if (segments.length) {
        url += '/' + segments.join('/');
        const label = snapshot.data['breadcrumb'] ?? segments.join('/');
        crumbs.push({ label, url });
      }
      return this.buildBreadcrumbs(child, url, crumbs);
    }
    return crumbs;
  }
}
