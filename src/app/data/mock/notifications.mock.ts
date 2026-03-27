import { AppNotification } from '../models';

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'notif-001', type: 'success', title: 'New Order', message: 'Order #ORD-1050 placed by Emily Rodriguez — $290.23', isRead: false, link: '/orders/ord-001', createdAt: '2026-03-27T16:00:00Z' },
  { id: 'notif-002', type: 'warning', title: 'Low Stock Alert', message: 'Leather Messenger Bag (Brown) is down to 30 units', isRead: false, link: '/products/prod-008', createdAt: '2026-03-27T14:00:00Z' },
  { id: 'notif-003', type: 'info', title: 'Review Posted', message: 'David Kim left a 2-star review on Bluetooth Portable Speaker', isRead: false, link: '/reviews', createdAt: '2026-03-27T08:00:00Z' },
  { id: 'notif-004', type: 'success', title: 'Order Delivered', message: 'Order #ORD-1045 delivered to Lisa Wang', isRead: true, link: '/orders/ord-004', createdAt: '2026-03-27T11:00:00Z' },
  { id: 'notif-005', type: 'error', title: 'Payment Failed', message: 'Payment retry failed for order #ORD-1051 — manual review needed', isRead: false, createdAt: '2026-03-27T09:30:00Z' },
  { id: 'notif-006', type: 'info', title: 'Promotion Starting', message: 'Electronics Flash Sale (TECHFLASH) starts April 1st', isRead: true, link: '/promotions/promo-003', createdAt: '2026-03-26T10:00:00Z' },
  { id: 'notif-007', type: 'warning', title: 'Flagged Review', message: 'A review on Yoga Mat Premium has been flagged for moderation', isRead: true, link: '/reviews', createdAt: '2026-03-17T07:30:00Z' },
  { id: 'notif-008', type: 'success', title: 'Milestone', message: 'You\'ve surpassed 1,800 orders this month!', isRead: true, createdAt: '2026-03-25T00:00:00Z' },
];
