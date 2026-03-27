export type ProductStatus = 'draft' | 'active' | 'archived';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>; // e.g. { color: 'Red', size: 'M' }
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  status: ProductStatus;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  revenue: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}
