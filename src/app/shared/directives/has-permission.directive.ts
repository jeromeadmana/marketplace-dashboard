import { Directive, input, inject, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({ selector: '[appHasPermission]', standalone: true })
export class HasPermissionDirective {
  private readonly auth = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private rendered = false;

  readonly appHasPermission = input.required<string>();

  constructor() {
    effect(() => {
      const value = this.appHasPermission();
      const [resource, action] = value.split('.');
      const hasPermission = this.auth.hasPermission(resource, action as 'read' | 'create' | 'update' | 'delete');

      if (hasPermission && !this.rendered) {
        this.vcr.createEmbeddedView(this.templateRef);
        this.rendered = true;
      } else if (!hasPermission && this.rendered) {
        this.vcr.clear();
        this.rendered = false;
      }
    });
  }
}
