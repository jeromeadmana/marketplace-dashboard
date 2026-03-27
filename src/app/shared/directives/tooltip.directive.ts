import { Directive, ElementRef, input, inject, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
  },
})
export class TooltipDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  readonly appTooltip = input.required<string>();
  private tooltipEl: HTMLDivElement | null = null;

  show(): void {
    const text = this.appTooltip();
    if (!text) return;

    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'app-tooltip';
    this.tooltipEl.textContent = text;
    document.body.appendChild(this.tooltipEl);

    const rect = this.el.nativeElement.getBoundingClientRect();
    this.tooltipEl.style.left = `${rect.left + rect.width / 2}px`;
    this.tooltipEl.style.top = `${rect.top - 8}px`;
  }

  hide(): void {
    this.tooltipEl?.remove();
    this.tooltipEl = null;
  }

  ngOnDestroy(): void {
    this.hide();
  }
}
