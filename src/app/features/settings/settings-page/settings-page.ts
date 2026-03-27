import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { NotificationService } from '../../../core/services/notification.service';
import { ROLE_PERMISSIONS, UserRole } from '../../../data/models';

type SettingsTab = 'profile' | 'notifications' | 'team' | 'roles' | 'api-keys';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  joinedDate: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdDate: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

interface StoreProfile {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  description: string;
  currency: string;
  timezone: string;
}

interface NotificationPrefs {
  newOrder: boolean;
  lowStock: boolean;
  customerReview: boolean;
  promotionReminder: boolean;
  weeklySalesReport: boolean;
  monthlyAnalyticsDigest: boolean;
  emailOrderConfirmation: boolean;
  emailShippingUpdates: boolean;
  emailMarketing: boolean;
}

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [FormsModule, TitleCasePipe, ModalComponent],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  private readonly notificationService = inject(NotificationService);

  readonly activeTab = signal<SettingsTab>('profile');

  readonly tabs: { key: SettingsTab; label: string }[] = [
    { key: 'profile', label: 'Store Profile' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'team', label: 'Team' },
    { key: 'roles', label: 'Roles & Permissions' },
    { key: 'api-keys', label: 'API Keys' },
  ];

  // Store Profile
  storeProfile: StoreProfile = {
    name: 'My Marketplace Store',
    email: 'store@marketplace.com',
    phone: '+1 (555) 123-4567',
    addressLine1: '123 Commerce St',
    addressLine2: 'Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'US',
    description: 'A premium marketplace store offering curated products across multiple categories.',
    currency: 'USD',
    timezone: 'America/Los_Angeles',
  };

  readonly currencies = ['USD', 'EUR', 'GBP', 'CAD'];
  readonly timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
  ];

  // Notification Preferences
  notifPrefs: NotificationPrefs = {
    newOrder: true,
    lowStock: true,
    customerReview: false,
    promotionReminder: true,
    weeklySalesReport: true,
    monthlyAnalyticsDigest: false,
    emailOrderConfirmation: true,
    emailShippingUpdates: true,
    emailMarketing: false,
  };

  // Team
  readonly teamMembers = signal<TeamMember[]>([
    {
      id: 'user-001', name: 'Alex Rivera', email: 'alex@marketplace.com',
      avatar: 'https://i.pravatar.cc/150?u=alex', role: 'admin', joinedDate: '2024-01-15',
    },
    {
      id: 'user-002', name: 'Jordan Lee', email: 'jordan@marketplace.com',
      avatar: 'https://i.pravatar.cc/150?u=jordan', role: 'manager', joinedDate: '2024-03-22',
    },
    {
      id: 'user-003', name: 'Casey Morgan', email: 'casey@marketplace.com',
      avatar: 'https://i.pravatar.cc/150?u=casey', role: 'viewer', joinedDate: '2024-06-10',
    },
  ]);

  readonly showInviteModal = signal(false);
  inviteEmail = '';
  inviteRole: UserRole = 'viewer';
  readonly editingRoleId = signal<string | null>(null);

  // Roles & Permissions
  readonly roles: UserRole[] = ['admin', 'manager', 'viewer'];
  readonly resources = ['products', 'orders', 'customers', 'analytics', 'promotions', 'inventory', 'reviews', 'settings'];
  readonly actions: ('read' | 'create' | 'update' | 'delete')[] = ['read', 'create', 'update', 'delete'];
  readonly rolePermissions = ROLE_PERMISSIONS;

  // API Keys
  readonly apiKeys = signal<ApiKey[]>([
    {
      id: 'key-001', name: 'Production API', key: 'mk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      createdDate: '2025-01-10', lastUsed: '2026-03-27', status: 'active',
    },
    {
      id: 'key-002', name: 'Staging API', key: 'mk_test_q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
      createdDate: '2025-06-15', lastUsed: '2026-03-25', status: 'active',
    },
    {
      id: 'key-003', name: 'Legacy Integration', key: 'mk_live_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4',
      createdDate: '2024-08-20', lastUsed: '2025-12-01', status: 'revoked',
    },
  ]);

  readonly showGenerateKeyModal = signal(false);
  newKeyName = '';
  readonly visibleKeys = signal<Set<string>>(new Set());
  readonly copiedKeyId = signal<string | null>(null);

  // Methods

  setTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  // Store Profile
  saveProfile(): void {
    this.notificationService.showToast('success', 'Settings Saved', 'Store profile has been updated successfully.');
  }

  // Notifications
  saveNotifications(): void {
    this.notificationService.showToast('success', 'Settings Saved', 'Notification preferences have been updated.');
  }

  // Team
  openInviteModal(): void {
    this.inviteEmail = '';
    this.inviteRole = 'viewer';
    this.showInviteModal.set(true);
  }

  closeInviteModal(): void {
    this.showInviteModal.set(false);
  }

  inviteMember(): void {
    if (!this.inviteEmail) return;
    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: this.inviteEmail.split('@')[0],
      email: this.inviteEmail,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      role: this.inviteRole,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    this.teamMembers.update(list => [...list, newMember]);
    this.showInviteModal.set(false);
    this.notificationService.showToast('success', 'Invitation Sent', `Invited ${this.inviteEmail} as ${this.inviteRole}.`);
  }

  startEditRole(memberId: string): void {
    this.editingRoleId.set(memberId);
  }

  updateMemberRole(memberId: string, newRole: UserRole): void {
    this.teamMembers.update(list =>
      list.map(m => m.id === memberId ? { ...m, role: newRole } : m)
    );
    this.editingRoleId.set(null);
    this.notificationService.showToast('info', 'Role Updated', 'Team member role has been changed.');
  }

  removeMember(member: TeamMember): void {
    this.teamMembers.update(list => list.filter(m => m.id !== member.id));
    this.notificationService.showToast('info', 'Member Removed', `${member.name} has been removed from the team.`);
  }

  // Roles & Permissions
  hasPermission(role: UserRole, resource: string, action: 'read' | 'create' | 'update' | 'delete'): boolean {
    const perms = this.rolePermissions[role];
    const perm = perms.find(p => p.resource === resource);
    return perm?.actions.includes(action) ?? false;
  }

  // API Keys
  toggleKeyVisibility(keyId: string): void {
    this.visibleKeys.update(set => {
      const next = new Set(set);
      if (next.has(keyId)) {
        next.delete(keyId);
      } else {
        next.add(keyId);
      }
      return next;
    });
  }

  isKeyVisible(keyId: string): boolean {
    return this.visibleKeys().has(keyId);
  }

  maskKey(key: string): string {
    return key.substring(0, 7) + '\u2022'.repeat(24);
  }

  copyKey(apiKey: ApiKey): void {
    navigator.clipboard.writeText(apiKey.key).then(() => {
      this.copiedKeyId.set(apiKey.id);
      this.notificationService.showToast('success', 'Copied', 'API key copied to clipboard.');
      setTimeout(() => this.copiedKeyId.set(null), 2000);
    });
  }

  openGenerateKeyModal(): void {
    this.newKeyName = '';
    this.showGenerateKeyModal.set(true);
  }

  closeGenerateKeyModal(): void {
    this.showGenerateKeyModal.set(false);
  }

  generateKey(): void {
    if (!this.newKeyName) return;
    const randomPart = Array.from({ length: 32 }, () =>
      'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 36))
    ).join('');
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: this.newKeyName,
      key: `mk_live_${randomPart}`,
      createdDate: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active',
    };
    this.apiKeys.update(list => [...list, newKey]);
    this.showGenerateKeyModal.set(false);
    this.notificationService.showToast('success', 'Key Generated', `API key "${this.newKeyName}" has been created.`);
  }

  revokeKey(apiKey: ApiKey): void {
    this.apiKeys.update(list =>
      list.map(k => k.id === apiKey.id ? { ...k, status: 'revoked' as const } : k)
    );
    this.notificationService.showToast('warning', 'Key Revoked', `API key "${apiKey.name}" has been revoked.`);
  }
}
