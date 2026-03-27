export type CustomerSegment = 'new' | 'returning' | 'vip';

export interface CustomerActivity {
  id: string;
  type: 'order' | 'review' | 'return' | 'support' | 'login';
  description: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  segment: CustomerSegment;
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderAt?: string;
  address?: {
    city: string;
    state: string;
    country: string;
  };
  activities: CustomerActivity[];
  createdAt: string;
}
