import { Component, input, output, contentChildren, TemplateRef, computed, signal } from '@angular/core';
import { PaginatorComponent } from '../paginator/paginator';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface SortState {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [PaginatorComponent],
  template: `
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            @if (selectable()) {
              <th class="data-table__check">
                <input type="checkbox" [checked]="allSelected()" (change)="toggleSelectAll()" />
              </th>
            }
            @for (col of columns(); track col.key) {
              <th
                [style.width]="col.width ?? 'auto'"
                [class.data-table__sortable]="col.sortable"
                (click)="col.sortable ? toggleSort(col.key) : null">
                {{ col.label }}
                @if (col.sortable && sort().column === col.key) {
                  <span class="data-table__sort-icon">
                    {{ sort().direction === 'asc' ? '&#9650;' : '&#9660;' }}
                  </span>
                }
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of paginatedData(); track trackBy() ? trackBy()!(row) : $index) {
            <tr [class.data-table__row--selected]="selectedIds().has(getId(row))">
              @if (selectable()) {
                <td class="data-table__check">
                  <input type="checkbox" [checked]="selectedIds().has(getId(row))" (change)="toggleSelect(row)" />
                </td>
              }
              <ng-content />
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="columns().length + (selectable() ? 1 : 0)" class="data-table__empty">
                {{ emptyMessage() }}
              </td>
            </tr>
          }
        </tbody>
      </table>
      @if (paginate() && data().length > pageSize()) {
        <app-paginator
          [total]="data().length"
          [pageSize]="pageSize()"
          [currentPage]="page()"
          (pageChange)="page.set($event)" />
      }
    </div>
  `,
  styleUrl: './data-table.scss',
})
export class DataTableComponent<T = unknown> {
  readonly data = input<T[]>([]);
  readonly columns = input<ColumnDef[]>([]);
  readonly selectable = input(false);
  readonly paginate = input(true);
  readonly pageSize = input(10);
  readonly emptyMessage = input('No data available');
  readonly trackBy = input<((item: T) => string | number) | null>(null);

  readonly sortChange = output<SortState>();
  readonly selectionChange = output<T[]>();

  readonly sort = signal<SortState>({ column: '', direction: 'asc' });
  readonly page = signal(1);
  readonly selectedIds = signal(new Set<string>());

  readonly paginatedData = computed(() => {
    const all = this.data();
    if (!this.paginate()) return all;
    const start = (this.page() - 1) * this.pageSize();
    return all.slice(start, start + this.pageSize());
  });

  readonly allSelected = computed(() => {
    const data = this.paginatedData();
    if (data.length === 0) return false;
    return data.every(row => this.selectedIds().has(this.getId(row)));
  });

  getId(row: T): string {
    return (row as Record<string, unknown>)['id'] as string ?? '';
  }

  toggleSort(column: string): void {
    this.sort.update(s => ({
      column,
      direction: s.column === column && s.direction === 'asc' ? 'desc' : 'asc',
    }));
    this.sortChange.emit(this.sort());
  }

  toggleSelect(row: T): void {
    const id = this.getId(row);
    this.selectedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    this.emitSelection();
  }

  toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.paginatedData().map(r => this.getId(r))));
    }
    this.emitSelection();
  }

  private emitSelection(): void {
    const ids = this.selectedIds();
    this.selectionChange.emit(this.data().filter(r => ids.has(this.getId(r))));
  }
}
