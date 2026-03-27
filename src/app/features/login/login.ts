import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../data/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-card__header">
          <span class="login-card__logo">🛍️</span>
          <h1>MarketHub</h1>
          <p>Marketplace Dashboard</p>
        </div>

        <form (ngSubmit)="onLogin()" class="login-card__form">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" [(ngModel)]="email" name="email" placeholder="alex@marketplace.com" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" [(ngModel)]="password" name="password" placeholder="Any password works" />
          </div>

          @if (error()) {
            <p class="login-card__error">{{ error() }}</p>
          }

          <button type="submit" class="btn btn--primary btn--lg login-card__submit">Sign In</button>
        </form>

        <div class="login-card__quick">
          <p>Quick login as:</p>
          <div class="login-card__quick-btns">
            <button class="btn btn--secondary btn--sm" (click)="quickLogin('admin')">Admin</button>
            <button class="btn btn--secondary btn--sm" (click)="quickLogin('manager')">Manager</button>
            <button class="btn btn--secondary btn--sm" (click)="quickLogin('viewer')">Viewer</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      padding: 1rem;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: var(--shadow-lg);

      &__header {
        text-align: center;
        margin-bottom: 2rem;

        h1 { font-size: 1.5rem; margin: 0.5rem 0 0.25rem; color: var(--text-primary); }
        p { color: var(--text-secondary); font-size: 0.875rem; }
      }

      &__logo { font-size: 2.5rem; }

      &__form { margin-bottom: 1.5rem; }

      &__error {
        color: var(--color-danger);
        font-size: 0.8125rem;
        margin-bottom: 0.75rem;
        text-align: center;
      }

      &__submit { width: 100%; }

      &__quick {
        text-align: center;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border);

        p { font-size: 0.8125rem; color: var(--text-tertiary); margin-bottom: 0.75rem; }
      }

      &__quick-btns { display: flex; gap: 0.5rem; justify-content: center; }
    }
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly error = signal('');

  onLogin(): void {
    if (this.auth.login(this.email, this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error.set('Invalid email. Try alex@marketplace.com, jordan@marketplace.com, or casey@marketplace.com');
    }
  }

  quickLogin(role: UserRole): void {
    this.auth.loginAs(role);
    this.router.navigate(['/dashboard']);
  }
}
