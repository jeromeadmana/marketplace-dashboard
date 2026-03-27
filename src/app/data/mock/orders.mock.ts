import { Order } from '../models';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001', orderNumber: 'ORD-1050', customerId: 'cust-003', customerName: 'Emily Rodriguez', customerEmail: 'emily.r@email.com',
    status: 'pending', paymentStatus: 'paid',
    items: [
      { id: 'oi-001', productId: 'prod-002', productName: 'Organic Cotton T-Shirt', productImage: 'https://picsum.photos/seed/tshirt/400/400', variantName: 'White / M', sku: 'OCT-TS-002-WM', quantity: 3, unitPrice: 34.99, total: 104.97 },
      { id: 'oi-002', productId: 'prod-008', productName: 'Leather Messenger Bag', productImage: 'https://picsum.photos/seed/bag/400/400', variantName: 'Brown', sku: 'LMB-008-BRN', quantity: 1, unitPrice: 189.99, total: 189.99 },
    ],
    subtotal: 294.96, tax: 24.77, shipping: 0, discount: 29.50, total: 290.23,
    couponCode: 'SPRING10',
    shippingAddress: { name: 'Emily Rodriguez', line1: '456 Park Ave', city: 'New York', state: 'NY', postalCode: '10022', country: 'US', phone: '+1 (555) 987-6543' },
    notes: [], timeline: [
      { id: 'tl-001', status: 'pending', message: 'Order placed', createdAt: '2026-03-27T16:00:00Z' },
    ],
    createdAt: '2026-03-27T16:00:00Z', updatedAt: '2026-03-27T16:00:00Z',
  },
  {
    id: 'ord-002', orderNumber: 'ORD-1049', customerId: 'cust-004', customerName: 'David Kim', customerEmail: 'david.kim@email.com',
    status: 'processing', paymentStatus: 'paid',
    items: [
      { id: 'oi-003', productId: 'prod-010', productName: 'Bluetooth Portable Speaker', productImage: 'https://picsum.photos/seed/speaker/400/400', sku: 'BPS-010', quantity: 1, unitPrice: 79.99, total: 79.99 },
    ],
    subtotal: 79.99, tax: 6.72, shipping: 5.99, discount: 0, total: 92.70,
    shippingAddress: { name: 'David Kim', line1: '789 Pine St', city: 'Seattle', state: 'WA', postalCode: '98101', country: 'US' },
    notes: [{ id: 'n-001', text: 'Customer requested gift wrapping', author: 'System', createdAt: '2026-03-26T09:05:00Z', isInternal: false }],
    timeline: [
      { id: 'tl-002', status: 'pending', message: 'Order placed', createdAt: '2026-03-26T09:00:00Z' },
      { id: 'tl-003', status: 'processing', message: 'Payment confirmed, preparing shipment', createdAt: '2026-03-26T09:30:00Z' },
    ],
    createdAt: '2026-03-26T09:00:00Z', updatedAt: '2026-03-26T09:30:00Z',
  },
  {
    id: 'ord-003', orderNumber: 'ORD-1047', customerId: 'cust-001', customerName: 'Sarah Chen', customerEmail: 'sarah.chen@email.com',
    status: 'shipped', paymentStatus: 'paid',
    items: [
      { id: 'oi-004', productId: 'prod-001', productName: 'Wireless Noise-Cancelling Headphones', productImage: 'https://picsum.photos/seed/headphones/400/400', variantName: 'Black', sku: 'WNC-HP-001-BLK', quantity: 1, unitPrice: 299.99, total: 299.99 },
      { id: 'oi-005', productId: 'prod-009', productName: 'Stainless Steel Water Bottle', productImage: 'https://picsum.photos/seed/bottle/400/400', variantName: 'Matte Black', sku: 'SSWB-009-MB', quantity: 2, unitPrice: 29.99, total: 59.98 },
    ],
    subtotal: 359.97, tax: 30.24, shipping: 0, discount: 0, total: 390.21,
    trackingNumber: 'TRK-9876543210',
    shippingAddress: { name: 'Sarah Chen', line1: '123 Market St', line2: 'Apt 4B', city: 'San Francisco', state: 'CA', postalCode: '94105', country: 'US', phone: '+1 (555) 123-4567' },
    notes: [], timeline: [
      { id: 'tl-004', status: 'pending', message: 'Order placed', createdAt: '2026-03-25T14:00:00Z' },
      { id: 'tl-005', status: 'processing', message: 'Payment confirmed', createdAt: '2026-03-25T14:15:00Z' },
      { id: 'tl-006', status: 'shipped', message: 'Shipped via FedEx — TRK-9876543210', createdAt: '2026-03-26T08:00:00Z' },
    ],
    createdAt: '2026-03-25T14:00:00Z', updatedAt: '2026-03-26T08:00:00Z',
  },
  {
    id: 'ord-004', orderNumber: 'ORD-1045', customerId: 'cust-007', customerName: 'Lisa Wang', customerEmail: 'lisa.w@email.com',
    status: 'delivered', paymentStatus: 'paid',
    items: [
      { id: 'oi-006', productId: 'prod-003', productName: 'Smart Home Hub Pro', productImage: 'https://picsum.photos/seed/smarthub/400/400', sku: 'SHH-PRO-003', quantity: 1, unitPrice: 199.99, total: 199.99 },
      { id: 'oi-007', productId: 'prod-006', productName: 'Mechanical Keyboard RGB', productImage: 'https://picsum.photos/seed/keyboard/400/400', variantName: 'Brown Switches', sku: 'MK-RGB-006-BR', quantity: 1, unitPrice: 129.99, total: 129.99 },
    ],
    subtotal: 329.98, tax: 27.72, shipping: 0, discount: 33.00, total: 324.70,
    couponCode: 'VIP10',
    trackingNumber: 'TRK-1234567890',
    shippingAddress: { name: 'Lisa Wang', line1: '321 Sunset Blvd', city: 'Los Angeles', state: 'CA', postalCode: '90028', country: 'US', phone: '+1 (555) 456-7890' },
    notes: [{ id: 'n-002', text: 'VIP customer — priority handling', author: 'Admin', createdAt: '2026-03-24T17:10:00Z', isInternal: true }],
    timeline: [
      { id: 'tl-007', status: 'pending', message: 'Order placed', createdAt: '2026-03-24T17:00:00Z' },
      { id: 'tl-008', status: 'processing', message: 'Payment confirmed', createdAt: '2026-03-24T17:05:00Z' },
      { id: 'tl-009', status: 'shipped', message: 'Shipped via UPS', createdAt: '2026-03-25T10:00:00Z' },
      { id: 'tl-010', status: 'delivered', message: 'Delivered — signed by recipient', createdAt: '2026-03-27T11:00:00Z' },
    ],
    createdAt: '2026-03-24T17:00:00Z', updatedAt: '2026-03-27T11:00:00Z',
  },
  {
    id: 'ord-005', orderNumber: 'ORD-1042', customerId: 'cust-002', customerName: 'Marcus Johnson', customerEmail: 'marcus.j@email.com',
    status: 'delivered', paymentStatus: 'paid',
    items: [
      { id: 'oi-008', productId: 'prod-006', productName: 'Mechanical Keyboard RGB', productImage: 'https://picsum.photos/seed/keyboard/400/400', variantName: 'Red Switches', sku: 'MK-RGB-006-R', quantity: 1, unitPrice: 129.99, total: 129.99 },
    ],
    subtotal: 129.99, tax: 10.92, shipping: 5.99, discount: 0, total: 146.90,
    trackingNumber: 'TRK-5555555555',
    shippingAddress: { name: 'Marcus Johnson', line1: '555 Congress Ave', city: 'Austin', state: 'TX', postalCode: '78701', country: 'US' },
    notes: [], timeline: [
      { id: 'tl-011', status: 'pending', message: 'Order placed', createdAt: '2026-03-22T10:00:00Z' },
      { id: 'tl-012', status: 'processing', message: 'Payment confirmed', createdAt: '2026-03-22T10:10:00Z' },
      { id: 'tl-013', status: 'shipped', message: 'Shipped via USPS', createdAt: '2026-03-23T09:00:00Z' },
      { id: 'tl-014', status: 'delivered', message: 'Delivered', createdAt: '2026-03-25T15:00:00Z' },
    ],
    createdAt: '2026-03-22T10:00:00Z', updatedAt: '2026-03-25T15:00:00Z',
  },
  {
    id: 'ord-006', orderNumber: 'ORD-1040', customerId: 'cust-005', customerName: 'Aisha Patel', customerEmail: 'aisha.p@email.com',
    status: 'delivered', paymentStatus: 'paid',
    items: [
      { id: 'oi-009', productId: 'prod-004', productName: 'Artisan Ceramic Coffee Mug Set', productImage: 'https://picsum.photos/seed/mugs/400/400', variantName: 'Ocean Blues', sku: 'ACM-SET-004-OB', quantity: 2, unitPrice: 59.99, total: 119.98 },
      { id: 'oi-010', productId: 'prod-009', productName: 'Stainless Steel Water Bottle', productImage: 'https://picsum.photos/seed/bottle/400/400', variantName: 'Rose Gold', sku: 'SSWB-009-RG', quantity: 1, unitPrice: 29.99, total: 29.99 },
    ],
    subtotal: 149.97, tax: 12.60, shipping: 0, discount: 0, total: 162.57,
    trackingNumber: 'TRK-7777777777',
    shippingAddress: { name: 'Aisha Patel', line1: '890 Michigan Ave', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US', phone: '+1 (555) 345-6789' },
    notes: [], timeline: [
      { id: 'tl-015', status: 'pending', message: 'Order placed', createdAt: '2026-03-20T11:00:00Z' },
      { id: 'tl-016', status: 'processing', message: 'Payment confirmed', createdAt: '2026-03-20T11:05:00Z' },
      { id: 'tl-017', status: 'shipped', message: 'Shipped via FedEx', createdAt: '2026-03-21T08:00:00Z' },
      { id: 'tl-018', status: 'delivered', message: 'Delivered', createdAt: '2026-03-23T14:00:00Z' },
    ],
    createdAt: '2026-03-20T11:00:00Z', updatedAt: '2026-03-23T14:00:00Z',
  },
  {
    id: 'ord-007', orderNumber: 'ORD-1038', customerId: 'cust-002', customerName: 'Marcus Johnson', customerEmail: 'marcus.j@email.com',
    status: 'cancelled', paymentStatus: 'refunded',
    items: [
      { id: 'oi-011', productId: 'prod-005', productName: 'Running Shoes Ultra Boost', productImage: 'https://picsum.photos/seed/shoes/400/400', variantName: 'Black / 10', sku: 'RS-UB-005-B10', quantity: 1, unitPrice: 159.99, total: 159.99 },
    ],
    subtotal: 159.99, tax: 13.44, shipping: 5.99, discount: 0, total: 179.42,
    shippingAddress: { name: 'Marcus Johnson', line1: '555 Congress Ave', city: 'Austin', state: 'TX', postalCode: '78701', country: 'US' },
    notes: [{ id: 'n-003', text: 'Customer requested cancellation — wrong size ordered', author: 'Support', createdAt: '2026-03-18T11:30:00Z', isInternal: true }],
    timeline: [
      { id: 'tl-019', status: 'pending', message: 'Order placed', createdAt: '2026-03-17T15:00:00Z' },
      { id: 'tl-020', status: 'processing', message: 'Payment confirmed', createdAt: '2026-03-17T15:10:00Z' },
      { id: 'tl-021', status: 'cancelled', message: 'Cancelled by customer — wrong size', createdAt: '2026-03-18T11:30:00Z' },
    ],
    createdAt: '2026-03-17T15:00:00Z', updatedAt: '2026-03-18T11:30:00Z',
  },
  {
    id: 'ord-008', orderNumber: 'ORD-1035', customerId: 'cust-006', customerName: 'James O\'Brien', customerEmail: 'james.ob@email.com',
    status: 'delivered', paymentStatus: 'paid',
    items: [
      { id: 'oi-012', productId: 'prod-007', productName: 'Yoga Mat Premium', productImage: 'https://picsum.photos/seed/yogamat/400/400', variantName: 'Teal', sku: 'YM-PRE-007-TEA', quantity: 1, unitPrice: 49.99, total: 49.99 },
      { id: 'oi-013', productId: 'prod-009', productName: 'Stainless Steel Water Bottle', productImage: 'https://picsum.photos/seed/bottle/400/400', variantName: 'Arctic White', sku: 'SSWB-009-AW', quantity: 1, unitPrice: 29.99, total: 29.99 },
    ],
    subtotal: 79.98, tax: 6.72, shipping: 5.99, discount: 0, total: 92.69,
    trackingNumber: 'TRK-3333333333',
    shippingAddress: { name: 'James O\'Brien', line1: '100 Colfax Ave', city: 'Denver', state: 'CO', postalCode: '80202', country: 'US' },
    notes: [], timeline: [
      { id: 'tl-022', status: 'pending', message: 'Order placed', createdAt: '2026-03-15T13:00:00Z' },
      { id: 'tl-023', status: 'processing', message: 'Payment confirmed', createdAt: '2026-03-15T13:05:00Z' },
      { id: 'tl-024', status: 'shipped', message: 'Shipped via USPS', createdAt: '2026-03-16T09:00:00Z' },
      { id: 'tl-025', status: 'delivered', message: 'Delivered', createdAt: '2026-03-18T12:00:00Z' },
    ],
    createdAt: '2026-03-15T13:00:00Z', updatedAt: '2026-03-18T12:00:00Z',
  },
];
