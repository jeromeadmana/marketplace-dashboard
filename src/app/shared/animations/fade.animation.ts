import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease', style({ opacity: 1 })),
  ]),
]);

export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);
