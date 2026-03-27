import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormat', standalone: true })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined, currency = 'USD', compact = false): string {
    if (value == null) return '—';
    if (compact && Math.abs(value) >= 1000) {
      const suffixes = ['', 'K', 'M', 'B'];
      const tier = Math.floor(Math.log10(Math.abs(value)) / 3);
      const suffix = suffixes[Math.min(tier, suffixes.length - 1)];
      const scaled = value / Math.pow(10, tier * 3);
      return `$${scaled.toFixed(1)}${suffix}`;
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  }
}
