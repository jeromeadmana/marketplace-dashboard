import { Component, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
  template: `
    @for (toast of notificationService.activeToasts(); track toast.id) {
      <div @toastAnimation class="toast toast--{{ toast.type }}" (click)="notificationService.dismissToast(toast.id)">
        <div class="toast__icon">
          @switch (toast.type) {
            @case ('success') { <span>&#10003;</span> }
            @case ('error') { <span>&#10007;</span> }
            @case ('warning') { <span>&#9888;</span> }
            @case ('info') { <span>&#8505;</span> }
          }
        </div>
        <div class="toast__content">
          <strong class="toast__title">{{ toast.title }}</strong>
          <p class="toast__message">{{ toast.message }}</p>
        </div>
        <button class="toast__close" (click)="notificationService.dismissToast(toast.id)">&times;</button>
      </div>
    }
  `,
  styleUrl: './toast.scss',
})
export class ToastComponent {
  protected readonly notificationService = inject(NotificationService);
}
