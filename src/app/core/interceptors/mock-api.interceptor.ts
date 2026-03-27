import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { MOCK_PRODUCTS } from '../../data/mock/products.mock';
import { MOCK_ORDERS } from '../../data/mock/orders.mock';
import { MOCK_CUSTOMERS } from '../../data/mock/customers.mock';
import { MOCK_REVIEWS } from '../../data/mock/reviews.mock';
import { MOCK_PROMOTIONS } from '../../data/mock/promotions.mock';
import { MOCK_ANALYTICS } from '../../data/mock/analytics.mock';
import { MOCK_NOTIFICATIONS } from '../../data/mock/notifications.mock';

function json(body: unknown, status = 200) {
  return of(new HttpResponse({ status, body })).pipe(delay(300 + Math.random() * 500));
}

function paginate(items: unknown[], params: URLSearchParams) {
  const page = +(params.get('page') ?? 1);
  const limit = +(params.get('limit') ?? 20);
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total: items.length,
    page,
    limit,
    totalPages: Math.ceil(items.length / limit),
  };
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;
  const params = url.searchParams;
  const method = req.method;

  // --- Products ---
  if (path === '/api/products' && method === 'GET') {
    let items = [...MOCK_PRODUCTS];
    const search = params.get('search');
    const status = params.get('status');
    const category = params.get('category');

    if (search) items = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (status) items = items.filter(p => p.status === status);
    if (category) items = items.filter(p => p.category === category);

    return json(paginate(items, params));
  }

  if (path.match(/^\/api\/products\/[\w-]+$/) && method === 'GET') {
    const id = path.split('/').pop()!;
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return product ? json(product) : json({ error: 'Not found' }, 404);
  }

  if (path === '/api/products' && method === 'POST') {
    return json({ ...(req.body as Record<string, unknown>), id: `prod-${Date.now()}` }, 201);
  }

  if (path.match(/^\/api\/products\/[\w-]+$/) && method === 'PUT') {
    return json(req.body);
  }

  if (path.match(/^\/api\/products\/[\w-]+$/) && method === 'DELETE') {
    return json({ success: true });
  }

  // --- Orders ---
  if (path === '/api/orders' && method === 'GET') {
    let items = [...MOCK_ORDERS];
    const status = params.get('status');
    const search = params.get('search');
    const customerId = params.get('customerId');

    if (status) items = items.filter(o => o.status === status);
    if (search) items = items.filter(o =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
    );
    if (customerId) items = items.filter(o => o.customerId === customerId);

    return json(paginate(items, params));
  }

  if (path.match(/^\/api\/orders\/[\w-]+$/) && method === 'GET') {
    const id = path.split('/').pop()!;
    const order = MOCK_ORDERS.find(o => o.id === id);
    return order ? json(order) : json({ error: 'Not found' }, 404);
  }

  if (path.match(/^\/api\/orders\/[\w-]+\/status$/) && method === 'PATCH') {
    return json({ success: true });
  }

  if (path.match(/^\/api\/orders\/[\w-]+\/notes$/) && method === 'POST') {
    return json({ ...(req.body as Record<string, unknown>), id: `note-${Date.now()}`, createdAt: new Date().toISOString() }, 201);
  }

  // --- Customers ---
  if (path === '/api/customers' && method === 'GET') {
    let items = [...MOCK_CUSTOMERS];
    const search = params.get('search');
    const segment = params.get('segment');

    if (search) items = items.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
    if (segment) items = items.filter(c => c.segment === segment);

    return json(paginate(items, params));
  }

  if (path.match(/^\/api\/customers\/[\w-]+$/) && method === 'GET') {
    const id = path.split('/').pop()!;
    const customer = MOCK_CUSTOMERS.find(c => c.id === id);
    return customer ? json(customer) : json({ error: 'Not found' }, 404);
  }

  if (path.match(/^\/api\/customers\/[\w-]+\/tags$/) && method === 'PUT') {
    return json({ success: true });
  }

  // --- Reviews ---
  if (path === '/api/reviews' && method === 'GET') {
    let items = [...MOCK_REVIEWS];
    const rating = params.get('rating');
    const sentiment = params.get('sentiment');

    if (rating) items = items.filter(r => r.rating === +rating);
    if (sentiment) items = items.filter(r => r.sentiment === sentiment);

    return json(paginate(items, params));
  }

  if (path.match(/^\/api\/reviews\/[\w-]+\/reply$/) && method === 'POST') {
    return json({ success: true }, 201);
  }

  if (path.match(/^\/api\/reviews\/[\w-]+\/(hide|flag)$/) && method === 'PATCH') {
    return json({ success: true });
  }

  // --- Promotions ---
  if (path === '/api/promotions' && method === 'GET') {
    let items = [...MOCK_PROMOTIONS];
    const status = params.get('status');

    if (status) items = items.filter(p => p.status === status);

    return json(paginate(items, params));
  }

  if (path.match(/^\/api\/promotions\/[\w-]+$/) && method === 'GET') {
    const id = path.split('/').pop()!;
    const promo = MOCK_PROMOTIONS.find(p => p.id === id);
    return promo ? json(promo) : json({ error: 'Not found' }, 404);
  }

  if (path === '/api/promotions' && method === 'POST') {
    return json({ ...(req.body as Record<string, unknown>), id: `promo-${Date.now()}` }, 201);
  }

  if (path.match(/^\/api\/promotions\/[\w-]+$/) && method === 'PUT') {
    return json(req.body);
  }

  if (path.match(/^\/api\/promotions\/[\w-]+$/) && method === 'DELETE') {
    return json({ success: true });
  }

  // --- Analytics ---
  if (path === '/api/analytics/summary' && method === 'GET') {
    return json(MOCK_ANALYTICS);
  }

  if (path === '/api/analytics/revenue' && method === 'GET') {
    const days = +(params.get('days') ?? 30);
    return json(MOCK_ANALYTICS.revenueTimeSeries.slice(-days));
  }

  // --- Notifications ---
  if (path === '/api/notifications' && method === 'GET') {
    return json(MOCK_NOTIFICATIONS);
  }

  if (path.match(/^\/api\/notifications\/[\w-]+\/read$/) && method === 'PATCH') {
    return json({ success: true });
  }

  // --- Inventory ---
  if (path === '/api/inventory' && method === 'GET') {
    const items = MOCK_PRODUCTS.filter(p => p.status === 'active');
    return json(paginate(items, params));
  }

  if (path.match(/^\/api\/inventory\/[\w-]+\/stock$/) && method === 'PATCH') {
    return json({ success: true });
  }

  // --- Auth ---
  if (path === '/api/auth/login' && method === 'POST') {
    return json({ token: 'mock-jwt-token-' + Date.now(), user: req.body });
  }

  if (path === '/api/auth/me' && method === 'GET') {
    return json({ id: 'user-001', name: 'Alex Rivera', email: 'alex@marketplace.com', role: 'admin' });
  }

  // Fallback — let it through (or 404 for /api routes)
  if (path.startsWith('/api/')) {
    return json({ error: 'Endpoint not found', path }, 404);
  }

  return next(req);
};
