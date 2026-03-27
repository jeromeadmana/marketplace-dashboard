export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  isInternal: boolean;
}

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  message: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  notes: OrderNote[];
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}
