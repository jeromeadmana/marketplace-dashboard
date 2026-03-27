import {
  trigger,
  transition,
  style,
  animate,
  query,
  group,
} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', [
      style({ position: 'absolute', width: '100%' }),
    ], { optional: true }),
    group([
      query(':leave', [
        style({ opacity: 1 }),
        animate('150ms ease-out', style({ opacity: 0 })),
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        animate('200ms 150ms ease-in', style({ opacity: 1 })),
      ], { optional: true }),
    ]),
  ]),
]);
