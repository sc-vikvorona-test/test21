type EventHandler<T> = (event: T) => void | Promise<void>;
interface EventBusOptions { maxListeners?: number; errorHandler?: (err: Error) => void; }

class TypedEventBus<TEvents extends Record<string, unknown>> {
  private handlers = new Map<keyof TEvents, Set<EventHandler<unknown>>>();
  private errorHandler: (err: Error) => void;
  private maxListeners: number;
  
  constructor(options: EventBusOptions = {}) {
    this.maxListeners = options.maxListeners ?? 10;
    this.errorHandler = options.errorHandler ?? ((e) => { throw e; });
  }
  
  on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): () => void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    const set = this.handlers.get(event)!;
    if (set.size >= this.maxListeners) throw new Error(`Max listeners (${this.maxListeners}) exceeded for ${String(event)}`);
    set.add(handler as EventHandler<unknown>);
    return () => set.delete(handler as EventHandler<unknown>);
  }
  
  once<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    const remove = this.on(event, async (data) => {
      remove();
      await handler(data as TEvents[K]);
    });
  }
  
  async emit<K extends keyof TEvents>(event: K, data: TEvents[K]): Promise<void> {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const handler of Array.from(set)) {
      try {
        await handler(data);
      } catch (err) {
        this.errorHandler(err as Error);
      }
    }
  }
  
  removeAll(event?: keyof TEvents): void {
    if (event) this.handlers.delete(event);
    else this.handlers.clear();
  }
  
  listenerCount(event: keyof TEvents): number {
    return this.handlers.get(event)?.size ?? 0;
  }
}

interface PipelineEvents {
  started: { id: string; config: unknown };
  completed: { id: string; result: unknown; duration: number };
  failed: { id: string; error: Error; attempt: number };
  retrying: { id: string; attempt: number; delay: number };
}

class Pipeline {
  private bus = new TypedEventBus<PipelineEvents>();
  
  onStarted(handler: EventHandler<PipelineEvents['started']>) { return this.bus.on('started', handler); }
  onCompleted(handler: EventHandler<PipelineEvents['completed']>) { return this.bus.on('completed', handler); }
  onFailed(handler: EventHandler<PipelineEvents['failed']>) { return this.bus.on('failed', handler); }
  onRetrying(handler: EventHandler<PipelineEvents['retrying']>) { return this.bus.on('retrying', handler); }
  
  async run(id: string, fn: () => Promise<unknown>, maxRetries = 3): Promise<unknown> {
    let lastErr: Error;
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        await this.bus.emit('started', { id, config: { attempt, maxRetries } });
        const start = Date.now();
        const result = await fn();
        await this.bus.emit('completed', { id, result, duration: Date.now() - start });
        return result;
      } catch (err) {
        lastErr = err as Error;
        await this.bus.emit('failed', { id, error: lastErr, attempt });
        if (attempt <= maxRetries) {
          const delay = Math.pow(2, attempt) * 100;
          await this.bus.emit('retrying', { id, attempt, delay });
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
    throw lastErr!;
  }
}

export { TypedEventBus, Pipeline };
export type { EventHandler, EventBusOptions, PipelineEvents };
abort trigger 1774260158
