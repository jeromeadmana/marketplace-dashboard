import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-input',
  standalone: true,
  template: `
    <div class="search-input">
      <span class="search-input__icon">&#128269;</span>
      <input
        type="text"
        class="search-input__field"
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="onInput($event)" />
      @if (value()) {
        <button class="search-input__clear" (click)="clear()">&times;</button>
      }
    </div>
  `,
  styles: `
    .search-input {
      position: relative;
      display: flex;
      align-items: center;

      &__icon {
        position: absolute;
        left: 0.75rem;
        font-size: 0.875rem;
        color: var(--text-tertiary);
        pointer-events: none;
      }

      &__field {
        width: 100%;
        padding: 0.5rem 2rem 0.5rem 2.25rem;
        border: 1px solid var(--border);
        border-radius: 0.5rem;
        background: var(--surface);
        color: var(--text-primary);
        font-size: 0.875rem;
        outline: none;
        transition: border-color 0.15s;

        &::placeholder { color: var(--text-tertiary); }
        &:focus { border-color: var(--primary); }
      }

      &__clear {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        color: var(--text-tertiary);
        cursor: pointer;
        font-size: 1.125rem;
        padding: 0;
        line-height: 1;

        &:hover { color: var(--text-primary); }
      }
    }
  `,
})
export class SearchInputComponent {
  readonly placeholder = input('Search...');
  readonly value = signal('');
  readonly searchChange = output<string>();

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.searchChange.emit(val);
  }

  clear(): void {
    this.value.set('');
    this.searchChange.emit('');
  }
}
