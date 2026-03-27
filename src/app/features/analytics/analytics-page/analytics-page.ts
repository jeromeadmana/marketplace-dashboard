import { Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton';
import { MOCK_ANALYTICS } from '../../../data/mock';
import { AnalyticsSummary, TimeSeriesPoint, GeoData } from '../../../data/models/analytics.model';

type Period = 7 | 30 | 90;
type SortColumn = 'region' | 'revenue' | 'orders' | 'customers';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [DecimalPipe, CurrencyFormatPipe, SkeletonComponent],
  templateUrl: './analytics-page.html',
  styleUrl: './analytics-page.scss',
})
export class AnalyticsPage {
  protected readonly periods: { label: string; value: Period }[] = [
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 },
  ];

  protected readonly selectedPeriod = signal<Period>(30);
  protected readonly geoSortColumn = signal<SortColumn>('revenue');
  protected readonly geoSortDir = signal<SortDir>('desc');

  private readonly allData: AnalyticsSummary = MOCK_ANALYTICS;

  protected readonly kpis = computed(() => {
    const period = this.selectedPeriod();
    const factor = period === 7 ? 0.25 : period === 90 ? 2.8 : 1;
    const kpis = this.allData.kpis;
    return {
      totalRevenue: kpis.totalRevenue * factor,
      revenueChange: kpis.revenueChange,
      totalOrders: Math.round(kpis.totalOrders * factor),
      ordersChange: kpis.ordersChange,
      conversionRate: kpis.conversionRate,
      conversionChange: kpis.conversionChange,
      averageOrderValue: kpis.averageOrderValue,
      aovChange: kpis.aovChange,
    };
  });

  protected readonly timeSeries = computed(() => {
    const period = this.selectedPeriod();
    const full = this.allData.revenueTimeSeries;
    if (period <= full.length) {
      return full.slice(full.length - period);
    }
    // For 90 days generate extended data
    return this.generateExtended(period);
  });

  protected readonly categories = computed(() => this.allData.categoryBreakdown);
  protected readonly maxCategoryRevenue = computed(() =>
    Math.max(...this.categories().map(c => c.revenue))
  );

  protected readonly funnel = computed(() => this.allData.conversionFunnel);
  protected readonly topProducts = computed(() => this.allData.topProducts);
  protected readonly maxProductRevenue = computed(() =>
    this.topProducts().length > 0 ? this.topProducts()[0].revenue : 1
  );

  protected readonly sortedGeoData = computed(() => {
    const col = this.geoSortColumn();
    const dir = this.geoSortDir();
    const data = [...this.allData.geoData];
    data.sort((a, b) => {
      const aVal = a[col as keyof GeoData];
      const bVal = b[col as keyof GeoData];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return dir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return data;
  });

  protected readonly maxGeoRevenue = computed(() =>
    Math.max(...this.allData.geoData.map(g => g.revenue))
  );

  // Comparison section: mock "last period" as current * random factor
  protected readonly comparison = computed(() => {
    const kpis = this.kpis();
    const factors = { revenue: 0.88, orders: 0.92, aov: 0.95 };
    return {
      current: {
        revenue: kpis.totalRevenue,
        orders: kpis.totalOrders,
        aov: kpis.averageOrderValue,
      },
      previous: {
        revenue: kpis.totalRevenue * factors.revenue,
        orders: Math.round(kpis.totalOrders * factors.orders),
        aov: kpis.averageOrderValue * factors.aov,
      },
    };
  });

  // SVG Chart computations
  protected readonly chartViewBox = '0 0 800 300';
  protected readonly chartPadding = { top: 20, right: 20, bottom: 40, left: 70 };

  protected readonly chartPoints = computed(() => {
    const series = this.timeSeries();
    const pad = this.chartPadding;
    const w = 800 - pad.left - pad.right;
    const h = 300 - pad.top - pad.bottom;
    const maxVal = Math.max(...series.map(p => p.value));
    const minVal = Math.min(...series.map(p => p.value)) * 0.9;
    const range = maxVal - minVal || 1;

    return series.map((p, i) => ({
      x: pad.left + (i / Math.max(series.length - 1, 1)) * w,
      y: pad.top + h - ((p.value - minVal) / range) * h,
      date: p.date,
      value: p.value,
    }));
  });

  protected readonly polylinePoints = computed(() =>
    this.chartPoints().map(p => `${p.x},${p.y}`).join(' ')
  );

  protected readonly areaPath = computed(() => {
    const pts = this.chartPoints();
    if (pts.length === 0) return '';
    const pad = this.chartPadding;
    const bottom = 300 - pad.bottom;
    let d = `M ${pts[0].x},${bottom}`;
    pts.forEach(p => { d += ` L ${p.x},${p.y}`; });
    d += ` L ${pts[pts.length - 1].x},${bottom} Z`;
    return d;
  });

  protected readonly yAxisLabels = computed(() => {
    const series = this.timeSeries();
    const maxVal = Math.max(...series.map(p => p.value));
    const minVal = Math.min(...series.map(p => p.value)) * 0.9;
    const pad = this.chartPadding;
    const h = 300 - pad.top - pad.bottom;
    const steps = 5;
    const labels: { y: number; label: string }[] = [];
    for (let i = 0; i <= steps; i++) {
      const val = minVal + (maxVal - minVal) * (i / steps);
      labels.push({
        y: pad.top + h - (i / steps) * h,
        label: '$' + (val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val.toFixed(0)),
      });
    }
    return labels;
  });

  protected readonly xAxisLabels = computed(() => {
    const pts = this.chartPoints();
    const step = Math.max(1, Math.floor(pts.length / 6));
    return pts
      .filter((_, i) => i % step === 0 || i === pts.length - 1)
      .map(p => ({
        x: p.x,
        label: this.formatDateShort(p.date),
      }));
  });

  protected readonly categoryColors = [
    'var(--primary)',
    'var(--color-info)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-danger)',
  ];

  selectPeriod(period: Period): void {
    this.selectedPeriod.set(period);
  }

  sortGeo(column: SortColumn): void {
    if (this.geoSortColumn() === column) {
      this.geoSortDir.set(this.geoSortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.geoSortColumn.set(column);
      this.geoSortDir.set('desc');
    }
  }

  getSortIcon(column: SortColumn): string {
    if (this.geoSortColumn() !== column) return '↕';
    return this.geoSortDir() === 'asc' ? '↑' : '↓';
  }

  private formatDateShort(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  private generateExtended(days: number): TimeSeriesPoint[] {
    const base = this.allData.revenueTimeSeries;
    const series: TimeSeriesPoint[] = [];
    const now = new Date('2026-03-28');
    const avg = base.reduce((s, p) => s + p.value, 0) / base.length;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const existing = base.find(p => p.date === dateStr);
      if (existing) {
        series.push(existing);
      } else {
        const dayOfWeek = date.getDay();
        const weekendDip = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;
        const random = 0.85 + Math.random() * 0.3;
        series.push({ date: dateStr, value: Math.round(avg * weekendDip * random * 100) / 100 });
      }
    }
    return series;
  }
}
