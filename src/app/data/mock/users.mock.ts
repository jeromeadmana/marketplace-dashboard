import { User, ROLE_PERMISSIONS } from '../models';

export const MOCK_USERS: User[] = [
  {
    id: 'user-001', name: 'Alex Rivera', email: 'alex@marketplace.com',
    avatar: 'https://i.pravatar.cc/150?u=alex', role: 'admin',
    permissions: ROLE_PERMISSIONS['admin'],
  },
  {
    id: 'user-002', name: 'Jordan Lee', email: 'jordan@marketplace.com',
    avatar: 'https://i.pravatar.cc/150?u=jordan', role: 'manager',
    permissions: ROLE_PERMISSIONS['manager'],
  },
  {
    id: 'user-003', name: 'Casey Morgan', email: 'casey@marketplace.com',
    avatar: 'https://i.pravatar.cc/150?u=casey', role: 'viewer',
    permissions: ROLE_PERMISSIONS['viewer'],
  },
];
