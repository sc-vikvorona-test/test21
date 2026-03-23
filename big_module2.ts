interface Config { host: string; port: number; timeout: number; retries: number; }
interface Connection { id: string; config: Config; connected: boolean; lastPing: Date; }
interface Message { id: string; connectionId: string; payload: unknown; timestamp: Date; acknowledged: boolean; }
interface Handler<T> { handle(msg: Message): Promise<T>; validate(payload: unknown): payload is T; }

class ConnectionPool {
  private connections: Map<string, Connection> = new Map();
  private maxConnections: number;

  constructor(maxConnections: number = 10) { this.maxConnections = maxConnections; }

  async acquire(config: Config): Promise<Connection> {
    if (this.connections.size >= this.maxConnections) throw new Error('Pool exhausted');
    const id = Math.random().toString(36).slice(2);
    const conn: Connection = { id, config, connected: true, lastPing: new Date() };
    this.connections.set(id, conn);
    return conn;
  }

  async release(id: string): Promise<void> {
    const conn = this.connections.get(id);
    if (!conn) throw new Error('Connection not found');
    this.connections.delete(id);
  }

  async ping(id: string): Promise<boolean> {
    const conn = this.connections.get(id);
    if (!conn || !conn.connected) return false;
    conn.lastPing = new Date();
    return true;
  }

  getActive(): Connection[] {
    return Array.from(this.connections.values()).filter(c => c.connected);
  }

  async healthCheck(): Promise<{ healthy: number; total: number }> {
    const total = this.connections.size;
    let healthy = 0;
    for (const [id] of this.connections) {
      if (await this.ping(id)) healthy++;
    }
    return { healthy, total };
  }
}

class MessageBus {
  private handlers: Map<string, Handler<unknown>[]> = new Map();
  private queue: Message[] = [];
  private processing = false;

  register<T>(topic: string, handler: Handler<T>): void {
    const existing = this.handlers.get(topic) || [];
    existing.push(handler as Handler<unknown>);
    this.handlers.set(topic, existing);
  }

  async publish(topic: string, payload: unknown): Promise<string> {
    const id = Math.random().toString(36).slice(2);
    const msg: Message = { id, connectionId: topic, payload, timestamp: new Date(), acknowledged: false };
    this.queue.push(msg);
    if (!this.processing) await this.processQueue();
    return id;
  }

  private async processQueue(): Promise<void> {
    this.processing = true;
    while (this.queue.length > 0) {
      const msg = this.queue.shift()!;
      const handlers = this.handlers.get(msg.connectionId) || [];
      for (const handler of handlers) {
        if (handler.validate(msg.payload)) {
          await handler.handle(msg);
          msg.acknowledged = true;
        }
      }
    }
    this.processing = false;
  }

  getQueueDepth(): number { return this.queue.length; }
  isProcessing(): boolean { return this.processing; }
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(private limit: number, private windowMs: number) {}

  allow(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    const recent = timestamps.filter(t => now - t < this.windowMs);
    if (recent.length >= this.limit) return false;
    recent.push(now);
    this.requests.set(key, recent);
    return true;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    const recent = timestamps.filter(t => now - t < this.windowMs);
    return Math.max(0, this.limit - recent.length);
  }

  resetKey(key: string): void { this.requests.delete(key); }
}

async function withRetry<T>(fn: () => Promise<T>, options: { maxAttempts: number; delayMs: number; backoff?: number }): Promise<T> {
  let lastError: Error;
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (attempt < options.maxAttempts) {
        const delay = options.delayMs * Math.pow(options.backoff || 1, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError!;
}

export { ConnectionPool, MessageBus, RateLimiter, withRetry };
export type { Config, Connection, Message, Handler };
