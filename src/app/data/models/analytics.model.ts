export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface CategoryBreakdown {
  category: string;
  revenue: number;
  orders: number;
  percentage: number;
}

export interface GeoData {
  region: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface FunnelStep {
  name: string;
  value: number;
  percentage: number;
}

export interface DashboardKPIs {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  conversionRate: number;
  conversionChange: number;
  averageOrderValue: number;
  aovChange: number;
}

export interface AnalyticsSummary {
  kpis: DashboardKPIs;
  revenueTimeSeries: TimeSeriesPoint[];
  categoryBreakdown: CategoryBreakdown[];
  geoData: GeoData[];
  conversionFunnel: FunnelStep[];
  topProducts: { productId: string; name: string; revenue: number; units: number }[];
}
