import { Directive, ElementRef, output, inject, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[appClickOutside]', standalone: true })
export class ClickOutsideDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  readonly appClickOutside = output<void>();
  private handler!: (event: MouseEvent) => void;

  ngOnInit(): void {
    this.handler = (event: MouseEvent) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.appClickOutside.emit();
      }
    };
    document.addEventListener('click', this.handler, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handler, true);
  }
}
