interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'dark' | 'light';
  language: string;
  notifications: boolean;
  timezone: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  tags: string[];
  metadata: Record<string, any>;
}

interface Order {
  id: number;
  userId: number;
  products: Array<{ productId: number; quantity: number; unitPrice: number }>;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: Address;
  totalAmount: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

class UserRepository {
  private users: Map<number, User> = new Map();
  private emailIndex: Map<string, number> = new Map();

  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    if (this.emailIndex.has(data.email)) {
      throw new Error('Email already exists');
    }
    const id = this.users.size + 1;
    const user: User = { ...data, id, createdAt: new Date() };
    this.users.set(id, user);
    this.emailIndex.set(data.email, id);
    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const id = this.emailIndex.get(email);
    if (!id) return null;
    return this.findById(id);
  }

  async update(id: number, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    if (data.email && data.email !== user.email) {
      if (this.emailIndex.has(data.email)) throw new Error('Email taken');
      this.emailIndex.delete(user.email);
      this.emailIndex.set(data.email, id);
    }
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;
    this.emailIndex.delete(user.email);
    this.users.delete(id);
    return true;
  }

  async findAll(filter?: { role?: User['role']; limit?: number; offset?: number }): Promise<User[]> {
    let users = Array.from(this.users.values());
    if (filter?.role) users = users.filter(u => u.role === filter.role);
    const offset = filter?.offset || 0;
    const limit = filter?.limit || users.length;
    return users.slice(offset, offset + limit);
  }
}

class ProductRepository {
  private products: Map<number, Product> = new Map();

  async create(data: Omit<Product, 'id'>): Promise<Product> {
    const id = this.products.size + 1;
    const product: Product = { ...data, id };
    this.products.set(id, product);
    return product;
  }

  async findById(id: number): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async search(query: string, category?: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }

  async updateStock(id: number, delta: number): Promise<Product | null> {
    const product = this.products.get(id);
    if (!product) return null;
    if (product.stock + delta < 0) throw new Error('Insufficient stock');
    const updated = { ...product, stock: product.stock + delta };
    this.products.set(id, updated);
    return updated;
  }

  async getLowStock(threshold: number = 10): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.stock < threshold);
  }
}

class OrderService {
  constructor(
    private userRepo: UserRepository,
    private productRepo: ProductRepository,
    private orders: Map<number, Order> = new Map()
  ) {}

  async createOrder(userId: number, items: Array<{ productId: number; quantity: number }>, shippingAddress: Address): Promise<Order> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error('User not found');

    const orderItems: Order['products'] = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await this.productRepo.findById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price
      });
      totalAmount += product.price * item.quantity;
    }

    for (const item of items) {
      await this.productRepo.updateStock(item.productId, -item.quantity);
    }

    const id = this.orders.size + 1;
    const order: Order = {
      id,
      userId,
      products: orderItems,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      shippingAddress,
      totalAmount
    };
    this.orders.set(id, order);
    return order;
  }

  async updateStatus(orderId: number, status: Order['status']): Promise<Order | null> {
    const order = this.orders.get(orderId);
    if (!order) return null;
    const validTransitions: Record<Order['status'], Order['status'][]> = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };
    if (!validTransitions[order.status].includes(status)) {
      throw new Error(`Invalid status transition from ${order.status} to ${status}`);
    }
    const updated = { ...order, status, updatedAt: new Date() };
    this.orders.set(orderId, updated);
    return updated;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.userId === userId);
  }

  async getOrderStats(): Promise<Record<Order['status'], number>> {
    const stats: Record<string, number> = {};
    for (const order of this.orders.values()) {
      stats[order.status] = (stats[order.status] || 0) + 1;
    }
    return stats as Record<Order['status'], number>;
  }
}

function calculateDiscount(user: User, order: Order): number {
  let discount = 0;
  if (user.role === 'admin') discount += 0.2;
  if (order.totalAmount > 100) discount += 0.05;
  if (order.totalAmount > 500) discount += 0.1;
  const daysSinceCreated = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated > 365) discount += 0.03;
  return Math.min(discount, 0.3);
}

async function processRefund(orderId: number, orderService: OrderService, productRepo: ProductRepository): Promise<void> {
  const orders = await orderService.getUserOrders(0);
  const order = orders.find(o => o.id === orderId);
  if (!order) throw new Error('Order not found');
  if (order.status !== 'delivered') throw new Error('Can only refund delivered orders');
  
  for (const item of order.products) {
    await productRepo.updateStock(item.productId, item.quantity);
  }
  await orderService.updateStatus(orderId, 'cancelled');
}

export { UserRepository, ProductRepository, OrderService, calculateDiscount, processRefund };
export type { User, Product, Order, Address, UserPreferences };
