import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole, ROLE_PERMISSIONS } from '../../data/models';
import { MOCK_USERS } from '../../data/mock';

const STORAGE_KEY = 'marketplace_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<User | null>(this.loadUser());

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly role = computed(() => this.currentUser()?.role ?? null);

  login(email: string, _password: string): boolean {
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) {
      this.currentUser.set(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  loginAs(role: UserRole): void {
    const user = MOCK_USERS.find(u => u.role === role)!;
    this.currentUser.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  hasPermission(resource: string, action: 'read' | 'create' | 'update' | 'delete'): boolean {
    const user = this.currentUser();
    if (!user) return false;
    const permission = user.permissions.find(p => p.resource === resource);
    return permission?.actions.includes(action) ?? false;
  }

  switchRole(role: UserRole): void {
    const user = this.currentUser();
    if (user) {
      const updated: User = { ...user, role, permissions: ROLE_PERMISSIONS[role] };
      this.currentUser.set(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }

  private loadUser(): User | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
