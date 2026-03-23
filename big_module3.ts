import { EventEmitter } from 'events';

interface TaskOptions { priority: number; timeout: number; retries: number; metadata?: Record<string, unknown>; }
interface Task<T = unknown> { id: string; fn: () => Promise<T>; options: TaskOptions; resolve: (value: T) => void; reject: (reason?: unknown) => void; attempts: number; }
interface WorkerStats { processed: number; failed: number; retried: number; avgDuration: number; }

class PriorityQueue<T extends { options: { priority: number } }> {
  private items: T[] = [];
  enqueue(item: T): void {
    let i = 0;
    while (i < this.items.length && this.items[i].options.priority >= item.options.priority) i++;
    this.items.splice(i, 0, item);
  }
  dequeue(): T | undefined { return this.items.shift(); }
  get size(): number { return this.items.length; }
  peek(): T | undefined { return this.items[0]; }
  clear(): void { this.items = []; }
}

class TaskWorker extends EventEmitter {
  private queue = new PriorityQueue<Task>();
  private running = 0;
  private stats: WorkerStats = { processed: 0, failed: 0, retried: 0, avgDuration: 0 };
  
  constructor(private concurrency: number = 5) { super(); }

  submit<T>(fn: () => Promise<T>, options: Partial<TaskOptions> = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      const task: Task<T> = {
        id: Math.random().toString(36).slice(2),
        fn,
        options: { priority: 0, timeout: 30000, retries: 3, ...options },
        resolve: resolve as (value: unknown) => void,
        reject,
        attempts: 0
      };
      this.queue.enqueue(task as Task);
      this.emit('enqueued', task.id);
      this.drain();
    });
  }

  private async drain(): Promise<void> {
    while (this.running < this.concurrency && this.queue.size > 0) {
      const task = this.queue.dequeue();
      if (!task) break;
      this.running++;
      this.execute(task);
    }
  }

  private async execute(task: Task): Promise<void> {
    const start = Date.now();
    task.attempts++;
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Task ${task.id} timed out`)), task.options.timeout));
      const result = await Promise.race([task.fn(), timeoutPromise]);
      const duration = Date.now() - start;
      this.stats.processed++;
      this.stats.avgDuration = (this.stats.avgDuration * (this.stats.processed - 1) + duration) / this.stats.processed;
      task.resolve(result);
      this.emit('completed', task.id, duration);
    } catch (err) {
      if (task.attempts <= task.options.retries) {
        this.stats.retried++;
        const delay = Math.pow(2, task.attempts) * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
        this.queue.enqueue(task);
        this.emit('retrying', task.id, task.attempts);
      } else {
        this.stats.failed++;
        task.reject(err);
        this.emit('failed', task.id, err);
      }
    } finally {
      this.running--;
      this.drain();
    }
  }

  getStats(): WorkerStats { return { ...this.stats }; }
  getPending(): number { return this.queue.size; }
  getRunning(): number { return this.running; }
  
  async drain_all(): Promise<void> {
    return new Promise(resolve => {
      if (this.running === 0 && this.queue.size === 0) { resolve(); return; }
      const check = () => {
        if (this.running === 0 && this.queue.size === 0) { this.off('completed', check); this.off('failed', check); resolve(); }
      };
      this.on('completed', check);
      this.on('failed', check);
    });
  }
}

class Cache<K, V> {
  private store = new Map<K, { value: V; expires: number; hits: number }>();
  private maxSize: number;
  
  constructor(maxSize: number = 1000, private ttlMs: number = 60000) { this.maxSize = maxSize; }
  
  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expires) { this.store.delete(key); return undefined; }
    entry.hits++;
    return entry.value;
  }
  
  set(key: K, value: V, ttl?: number): void {
    if (this.store.size >= this.maxSize) this.evict();
    this.store.set(key, { value, expires: Date.now() + (ttl || this.ttlMs), hits: 0 });
  }
  
  private evict(): void {
    let lruKey: K | undefined;
    let minHits = Infinity;
    for (const [key, entry] of this.store) {
      if (entry.hits < minHits) { minHits = entry.hits; lruKey = key; }
    }
    if (lruKey !== undefined) this.store.delete(lruKey);
  }
  
  delete(key: K): boolean { return this.store.delete(key); }
  has(key: K): boolean { return this.get(key) !== undefined; }
  clear(): void { this.store.clear(); }
  get size(): number { return this.store.size; }
  
  getStats(): { size: number; maxSize: number; hitRate: number } {
    let totalHits = 0;
    for (const entry of this.store.values()) totalHits += entry.hits;
    return { size: this.store.size, maxSize: this.maxSize, hitRate: totalHits / Math.max(1, this.store.size) };
  }
}

export { TaskWorker, Cache, PriorityQueue };
export type { Task, TaskOptions, WorkerStats };
