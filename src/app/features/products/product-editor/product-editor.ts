import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product, ProductStatus } from '../../../data/models/product.model';

@Component({
  selector: 'app-product-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './product-editor.html',
  styleUrl: './product-editor.scss',
})
export class ProductEditor implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);

  readonly isEditMode = signal(false);
  readonly productId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly tags = signal<string[]>([]);
  readonly imageUrls = signal<{ url: string; isPrimary: boolean }[]>([]);

  form!: FormGroup;

  readonly categories = this.productService.categories;

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(id).subscribe(product => {
        if (product) {
          this.isEditMode.set(true);
          this.productId.set(id);
          this.populateForm(product);
        } else {
          this.router.navigate(['/products']);
        }
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      slug: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      subcategory: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      compareAtPrice: [null],
      cost: [null],
      sku: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      lowStockThreshold: [10, [Validators.required, Validators.min(0)]],
      status: ['draft' as ProductStatus],
      seoTitle: [''],
      seoDescription: [''],
      variants: this.fb.array([]),
    });

    // Auto-generate slug from name
    this.form.get('name')!.valueChanges.subscribe((name: string) => {
      if (!this.isEditMode() || !this.form.get('slug')!.dirty) {
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        this.form.get('slug')!.setValue(slug, { emitEvent: false });
      }
    });
  }

  private populateForm(product: Product): void {
    this.form.patchValue({
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory || '',
      price: product.price,
      compareAtPrice: product.compareAtPrice || null,
      cost: product.cost || null,
      sku: product.sku,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      status: product.status,
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
    });

    this.tags.set([...product.tags]);
    this.imageUrls.set(product.images.map(img => ({ url: img.url, isPrimary: img.isPrimary })));

    // Populate variants
    const variantsArray = this.form.get('variants') as FormArray;
    variantsArray.clear();
    product.variants.forEach(v => {
      variantsArray.push(this.createVariantGroup(v.name, v.sku, v.price, v.stock, v.attributes));
    });
  }

  get variantsArray(): FormArray {
    return this.form.get('variants') as FormArray;
  }

  createVariantGroup(
    name = '',
    sku = '',
    price = 0,
    stock = 0,
    attributes: Record<string, string> = {},
  ): FormGroup {
    return this.fb.group({
      name: [name, Validators.required],
      sku: [sku, Validators.required],
      price: [price, [Validators.required, Validators.min(0)]],
      stock: [stock, [Validators.required, Validators.min(0)]],
      attributeKeys: [Object.keys(attributes).join(', ')],
      attributeValues: [Object.values(attributes).join(', ')],
    });
  }

  addVariant(): void {
    this.variantsArray.push(this.createVariantGroup());
  }

  removeVariant(index: number): void {
    this.variantsArray.removeAt(index);
  }

  // Tags
  addTag(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim().toLowerCase();
    if (value && !this.tags().includes(value)) {
      this.tags.update(t => [...t, value]);
    }
    input.value = '';
  }

  onTagKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag(event);
    }
  }

  removeTag(tag: string): void {
    this.tags.update(t => t.filter(item => item !== tag));
  }

  // Images
  addImage(): void {
    const url = prompt('Enter image URL:');
    if (url?.trim()) {
      const isPrimary = this.imageUrls().length === 0;
      this.imageUrls.update(imgs => [...imgs, { url: url.trim(), isPrimary }]);
    }
  }

  removeImage(index: number): void {
    this.imageUrls.update(imgs => {
      const next = imgs.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some(img => img.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  }

  setPrimaryImage(index: number): void {
    this.imageUrls.update(imgs =>
      imgs.map((img, i) => ({ ...img, isPrimary: i === index })),
    );
  }

  // Form submission
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formValue = this.form.getRawValue();

    // Build variants
    const variants = formValue.variants.map((v: any, i: number) => {
      const keys = (v.attributeKeys || '').split(',').map((k: string) => k.trim()).filter(Boolean);
      const values = (v.attributeValues || '').split(',').map((val: string) => val.trim()).filter(Boolean);
      const attributes: Record<string, string> = {};
      keys.forEach((k: string, idx: number) => {
        if (k) attributes[k] = values[idx] || '';
      });
      return {
        id: `var-new-${Date.now()}-${i}`,
        name: v.name,
        sku: v.sku,
        price: Number(v.price),
        stock: Number(v.stock),
        attributes,
      };
    });

    // Build images
    const images = this.imageUrls().map((img, i) => ({
      id: `img-new-${Date.now()}-${i}`,
      url: img.url,
      alt: formValue.name,
      isPrimary: img.isPrimary,
    }));

    const productData = {
      name: formValue.name,
      slug: formValue.slug,
      description: formValue.description,
      category: formValue.category,
      subcategory: formValue.subcategory || undefined,
      status: formValue.status as ProductStatus,
      price: Number(formValue.price),
      compareAtPrice: formValue.compareAtPrice ? Number(formValue.compareAtPrice) : undefined,
      cost: formValue.cost ? Number(formValue.cost) : undefined,
      sku: formValue.sku,
      stock: Number(formValue.stock),
      lowStockThreshold: Number(formValue.lowStockThreshold),
      images,
      variants,
      tags: this.tags(),
      rating: 0,
      reviewCount: 0,
      salesCount: 0,
      revenue: 0,
      seoTitle: formValue.seoTitle || undefined,
      seoDescription: formValue.seoDescription || undefined,
    };

    const id = this.productId();
    if (this.isEditMode() && id) {
      this.productService.update(id, productData).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/products', id]);
        },
        error: () => this.saving.set(false),
      });
    } else {
      this.productService.create(productData).subscribe({
        next: (created) => {
          this.saving.set(false);
          this.router.navigate(['/products', created.id]);
        },
        error: () => this.saving.set(false),
      });
    }
  }

  cancel(): void {
    if (this.isEditMode() && this.productId()) {
      this.router.navigate(['/products', this.productId()]);
    } else {
      this.router.navigate(['/products']);
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
