import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromotionService } from '../promotion.service';
import { Promotion, DiscountType, PromotionStatus } from '../../../data/models/promotion.model';
import { MOCK_PRODUCTS } from '../../../data/mock/products.mock';

@Component({
  selector: 'app-promotion-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './promotion-editor.html',
  styleUrl: './promotion-editor.scss',
})
export class PromotionEditor implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly promotionService = inject(PromotionService);

  readonly isEditMode = signal(false);
  readonly promoId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly selectedCategories = signal<Set<string>>(new Set());

  form!: FormGroup;

  readonly availableCategories = computed(() => {
    const cats = new Set(MOCK_PRODUCTS.map(p => p.category));
    return Array.from(cats).sort();
  });

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.promotionService.getById(id).subscribe(promo => {
        if (promo) {
          this.isEditMode.set(true);
          this.promoId.set(id);
          this.populateForm(promo);
        } else {
          this.router.navigate(['/promotions']);
        }
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      discountType: ['percentage' as DiscountType, Validators.required],
      discountValue: [0, [Validators.required, Validators.min(0.01)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['active' as PromotionStatus],
      minOrderAmount: [null],
      maxUsesTotal: [null],
      maxUsesPerCustomer: [null],
    });
  }

  private populateForm(promo: Promotion): void {
    this.form.patchValue({
      name: promo.name,
      code: promo.code,
      description: promo.description || '',
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      startDate: this.toDateInputValue(promo.startDate),
      endDate: this.toDateInputValue(promo.endDate),
      status: promo.status,
      minOrderAmount: promo.conditions.minOrderAmount ?? null,
      maxUsesTotal: promo.conditions.maxUsesTotal ?? null,
      maxUsesPerCustomer: promo.conditions.maxUsesPerCustomer ?? null,
    });

    if (promo.conditions.applicableCategories?.length) {
      this.selectedCategories.set(new Set(promo.conditions.applicableCategories));
    }
  }

  private toDateInputValue(iso: string): string {
    return iso.slice(0, 10);
  }

  generateCode(): void {
    const code = this.promotionService.generateCouponCode();
    this.form.get('code')!.setValue(code);
    this.form.get('code')!.markAsDirty();
  }

  toggleCategory(cat: string): void {
    this.selectedCategories.update(set => {
      const next = new Set(set);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  isCategorySelected(cat: string): boolean {
    return this.selectedCategories().has(cat);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const v = this.form.getRawValue();

    const promoData: Omit<Promotion, 'id' | 'createdAt'> = {
      name: v.name,
      code: v.code.toUpperCase(),
      description: v.description || undefined,
      discountType: v.discountType,
      discountValue: Number(v.discountValue),
      startDate: new Date(v.startDate).toISOString(),
      endDate: new Date(v.endDate + 'T23:59:59').toISOString(),
      status: v.status,
      conditions: {
        minOrderAmount: v.minOrderAmount ? Number(v.minOrderAmount) : undefined,
        maxUsesTotal: v.maxUsesTotal ? Number(v.maxUsesTotal) : undefined,
        maxUsesPerCustomer: v.maxUsesPerCustomer ? Number(v.maxUsesPerCustomer) : undefined,
        applicableCategories: this.selectedCategories().size > 0
          ? Array.from(this.selectedCategories())
          : undefined,
      },
      usageCount: 0,
      revenue: 0,
    };

    const id = this.promoId();
    if (this.isEditMode() && id) {
      this.promotionService.getById(id).subscribe(existing => {
        this.promotionService.update(id, {
          ...promoData,
          usageCount: existing?.usageCount ?? 0,
          revenue: existing?.revenue ?? 0,
        }).subscribe({
          next: (updated) => {
            this.saving.set(false);
            if (updated) {
              this.router.navigate(['/promotions', id]);
            }
          },
          error: () => this.saving.set(false),
        });
      });
    } else {
      this.promotionService.create(promoData).subscribe({
        next: (created) => {
          this.saving.set(false);
          this.router.navigate(['/promotions', created.id]);
        },
        error: () => this.saving.set(false),
      });
    }
  }

  cancel(): void {
    const id = this.promoId();
    if (this.isEditMode() && id) {
      this.router.navigate(['/promotions', id]);
    } else {
      this.router.navigate(['/promotions']);
    }
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
    return 'Invalid value';
  }
}
