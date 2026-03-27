import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  template: `
    <div class="paginator">
      <span class="paginator__info">
        {{ startItem() }}–{{ endItem() }} of {{ total() }}
      </span>
      <div class="paginator__controls">
        <button class="paginator__btn" [disabled]="currentPage() === 1" (click)="pageChange.emit(1)">
          &laquo;
        </button>
        <button class="paginator__btn" [disabled]="currentPage() === 1" (click)="pageChange.emit(currentPage() - 1)">
          &lsaquo;
        </button>
        @for (p of visiblePages(); track p) {
          <button
            class="paginator__btn"
            [class.paginator__btn--active]="p === currentPage()"
            (click)="pageChange.emit(p)">
            {{ p }}
          </button>
        }
        <button class="paginator__btn" [disabled]="currentPage() === totalPages()" (click)="pageChange.emit(currentPage() + 1)">
          &rsaquo;
        </button>
        <button class="paginator__btn" [disabled]="currentPage() === totalPages()" (click)="pageChange.emit(totalPages())">
          &raquo;
        </button>
      </div>
    </div>
  `,
  styleUrl: './paginator.scss',
})
export class PaginatorComponent {
  readonly total = input(0);
  readonly pageSize = input(10);
  readonly currentPage = input(1);
  readonly pageChange = output<number>();

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  readonly startItem = computed(() => Math.min((this.currentPage() - 1) * this.pageSize() + 1, this.total()));
  readonly endItem = computed(() => Math.min(this.currentPage() * this.pageSize(), this.total()));

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const pages: number[] = [];
    const start = Math.max(1, current - delta);
    const end = Math.min(total, current + delta);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });
}
