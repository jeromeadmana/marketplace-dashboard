import { Promotion } from '../models';

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-001', name: 'Spring Sale', code: 'SPRING10', description: '10% off all orders over $50',
    discountType: 'percentage', discountValue: 10, status: 'active',
    conditions: { minOrderAmount: 50 }, usageCount: 142, revenue: 18450.00,
    startDate: '2026-03-01T00:00:00Z', endDate: '2026-04-15T23:59:59Z', createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'promo-002', name: 'VIP Exclusive', code: 'VIP10', description: '$10 off for VIP customers',
    discountType: 'fixed', discountValue: 10, status: 'active',
    conditions: { minOrderAmount: 100, maxUsesPerCustomer: 3 }, usageCount: 56, revenue: 9870.00,
    startDate: '2026-01-01T00:00:00Z', endDate: '2026-12-31T23:59:59Z', createdAt: '2025-12-20T10:00:00Z',
  },
  {
    id: 'promo-003', name: 'Electronics Flash Sale', code: 'TECHFLASH', description: '15% off electronics',
    discountType: 'percentage', discountValue: 15, status: 'scheduled',
    conditions: { applicableCategories: ['Electronics'], maxUsesTotal: 500 }, usageCount: 0, revenue: 0,
    startDate: '2026-04-01T00:00:00Z', endDate: '2026-04-03T23:59:59Z', createdAt: '2026-03-20T14:00:00Z',
  },
  {
    id: 'promo-004', name: 'Winter Clearance', code: 'WINTER25', description: '25% off winter clothing',
    discountType: 'percentage', discountValue: 25, status: 'expired',
    conditions: { applicableCategories: ['Clothing'], minOrderAmount: 75 }, usageCount: 312, revenue: 24560.00,
    startDate: '2026-01-15T00:00:00Z', endDate: '2026-02-28T23:59:59Z', createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'promo-005', name: 'New Customer Welcome', code: 'WELCOME20', description: '20% off first order',
    discountType: 'percentage', discountValue: 20, status: 'active',
    conditions: { maxUsesPerCustomer: 1 }, usageCount: 89, revenue: 7234.00,
    startDate: '2025-06-01T00:00:00Z', endDate: '2026-12-31T23:59:59Z', createdAt: '2025-05-28T10:00:00Z',
  },
  {
    id: 'promo-006', name: 'Free Shipping Friday', code: 'FREESHIP', description: 'Free shipping on orders over $30',
    discountType: 'fixed', discountValue: 5.99, status: 'disabled',
    conditions: { minOrderAmount: 30 }, usageCount: 678, revenue: 45230.00,
    startDate: '2025-09-01T00:00:00Z', endDate: '2026-06-30T23:59:59Z', createdAt: '2025-08-25T10:00:00Z',
  },
];
