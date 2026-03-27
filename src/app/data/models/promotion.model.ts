export type DiscountType = 'percentage' | 'fixed';
export type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'disabled';

export interface PromotionCondition {
  minOrderAmount?: number;
  applicableProductIds?: string[];
  applicableCategories?: string[];
  maxUsesTotal?: number;
  maxUsesPerCustomer?: number;
}

export interface Promotion {
  id: string;
  name: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  status: PromotionStatus;
  conditions: PromotionCondition;
  usageCount: number;
  revenue: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}
