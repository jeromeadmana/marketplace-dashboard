import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="modal-backdrop" (click)="close.emit()">
        <div class="modal" [class]="'modal--' + size()" (click)="$event.stopPropagation()">
          <div class="modal__header">
            <h2 class="modal__title">{{ title() }}</h2>
            <button class="modal__close" (click)="close.emit()">&times;</button>
          </div>
          <div class="modal__body">
            <ng-content />
          </div>
          <div class="modal__footer">
            <ng-content select="[modal-footer]" />
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './modal.scss',
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly close = output<void>();
}
