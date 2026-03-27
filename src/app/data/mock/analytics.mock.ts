import { AnalyticsSummary } from '../models';

function generateTimeSeries(days: number, baseValue: number, variance: number): { date: string; value: number }[] {
  const series: { date: string; value: number }[] = [];
  const now = new Date('2026-03-28');
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendDip = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;
    const trend = 1 + (days - i) * 0.005;
    const random = 0.85 + Math.random() * 0.3;
    series.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(baseValue * weekendDip * trend * random * 100) / 100,
    });
  }
  return series;
}

export const MOCK_ANALYTICS: AnalyticsSummary = {
  kpis: {
    totalRevenue: 284567.89,
    revenueChange: 12.4,
    totalOrders: 1847,
    ordersChange: 8.2,
    conversionRate: 3.24,
    conversionChange: -0.3,
    averageOrderValue: 154.07,
    aovChange: 3.8,
  },
  revenueTimeSeries: generateTimeSeries(30, 9500, 2000),
  categoryBreakdown: [
    { category: 'Electronics', revenue: 124560.00, orders: 623, percentage: 43.8 },
    { category: 'Clothing', revenue: 56780.00, orders: 412, percentage: 20.0 },
    { category: 'Home & Kitchen', revenue: 48920.00, orders: 387, percentage: 17.2 },
    { category: 'Sports', revenue: 28450.00, orders: 198, percentage: 10.0 },
    { category: 'Accessories', revenue: 25857.89, orders: 227, percentage: 9.0 },
  ],
  geoData: [
    { region: 'California', revenue: 68296.29, orders: 443, customers: 312 },
    { region: 'New York', revenue: 51222.22, orders: 332, customers: 245 },
    { region: 'Texas', revenue: 39839.50, orders: 258, customers: 189 },
    { region: 'Illinois', revenue: 25611.11, orders: 166, customers: 124 },
    { region: 'Washington', revenue: 22765.43, orders: 147, customers: 98 },
    { region: 'Colorado', revenue: 17074.07, orders: 110, customers: 87 },
    { region: 'Oregon', revenue: 14228.40, orders: 92, customers: 65 },
    { region: 'Florida', revenue: 11382.72, orders: 74, customers: 56 },
    { region: 'Other', revenue: 34347.15, orders: 225, customers: 178 },
  ],
  conversionFunnel: [
    { name: 'Visitors', value: 57000, percentage: 100 },
    { name: 'Product Views', value: 28500, percentage: 50.0 },
    { name: 'Add to Cart', value: 5700, percentage: 10.0 },
    { name: 'Checkout', value: 2565, percentage: 4.5 },
    { name: 'Purchase', value: 1847, percentage: 3.24 },
  ],
  topProducts: [
    { productId: 'prod-001', name: 'Wireless Noise-Cancelling Headphones', revenue: 567208.08, units: 1892 },
    { productId: 'prod-006', name: 'Mechanical Keyboard RGB', revenue: 264419.66, units: 2034 },
    { productId: 'prod-005', name: 'Running Shoes Ultra Boost', revenue: 232945.44, units: 1456 },
    { productId: 'prod-010', name: 'Bluetooth Portable Speaker', revenue: 205346.33, units: 2567 },
    { productId: 'prod-003', name: 'Smart Home Hub Pro', revenue: 197390.13, units: 987 },
  ],
};
