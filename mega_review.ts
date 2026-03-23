type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
type NonNullable<T> = T extends null | undefined ? never : T;
type RecursiveRequired<T> = { [P in keyof T]-?: T[P] extends object ? RecursiveRequired<T[P]> : T[P] };
type Flatten<T> = T extends Array<infer Item> ? Item : T;
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

interface Schema { fields: Record<string, FieldDef>; primaryKey: string[]; indexes: string[][]; }
interface FieldDef { type: 'string' | 'number' | 'boolean' | 'date' | 'json'; nullable?: boolean; defaultValue?: unknown; maxLength?: number; }
interface QueryOptions { where?: Record<string, unknown>; orderBy?: string; order?: 'asc' | 'desc'; limit?: number; offset?: number; includes?: string[]; }
interface AggregateResult { count: number; sum?: Record<string, number>; avg?: Record<string, number>; min?: Record<string, number>; max?: Record<string, number>; }
interface MigrationStep { version: number; up: string; down: string; }

class SchemaValidator {
  private schema: Schema;
  constructor(schema: Schema) { this.schema = schema; }
  
  validate(record: Record<string, unknown>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    for (const [field, def] of Object.entries(this.schema.fields)) {
      const value = record[field];
      if (value === null || value === undefined) {
        if (!def.nullable && def.defaultValue === undefined) errors.push(`Field ${field} is required`);
        continue;
      }
      if (def.type === 'string' && typeof value !== 'string') errors.push(`Field ${field} must be a string`);
      else if (def.type === 'number' && typeof value !== 'number') errors.push(`Field ${field} must be a number`);
      else if (def.type === 'boolean' && typeof value !== 'boolean') errors.push(`Field ${field} must be a boolean`);
      else if (def.type === 'date' && !(value instanceof Date)) errors.push(`Field ${field} must be a Date`);
      if (def.maxLength && typeof value === 'string' && value.length > def.maxLength)
        errors.push(`Field ${field} exceeds max length ${def.maxLength}`);
    }
    for (const key of this.schema.primaryKey) {
      if (record[key] === undefined || record[key] === null) errors.push(`Primary key field ${key} is required`);
    }
    return { valid: errors.length === 0, errors };
  }

  applyDefaults(record: Record<string, unknown>): Record<string, unknown> {
    const result = { ...record };
    for (const [field, def] of Object.entries(this.schema.fields)) {
      if ((result[field] === undefined || result[field] === null) && def.defaultValue !== undefined)
        result[field] = typeof def.defaultValue === 'function' ? (def.defaultValue as () => unknown)() : def.defaultValue;
    }
    return result;
  }
}

class QueryBuilder {
  private conditions: string[] = [];
  private params: unknown[] = [];
  private _orderBy: string | null = null;
  private _order: 'asc' | 'desc' = 'asc';
  private _limit: number | null = null;
  private _offset: number | null = null;
  
  where(field: string, op: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN', value: unknown): this {
    if (op === 'IN' && Array.isArray(value)) {
      const placeholders = value.map((_, i) => `$${this.params.length + i + 1}`).join(', ');
      this.conditions.push(`${field} IN (${placeholders})`);
      this.params.push(...value);
    } else {
      this.conditions.push(`${field} ${op} $${this.params.length + 1}`);
      this.params.push(value);
    }
    return this;
  }
  
  orderBy(field: string, order: 'asc' | 'desc' = 'asc'): this { this._orderBy = field; this._order = order; return this; }
  limit(n: number): this { this._limit = n; return this; }
  offset(n: number): this { this._offset = n; return this; }
  
  build(table: string): { sql: string; params: unknown[] } {
    let sql = `SELECT * FROM ${table}`;
    if (this.conditions.length > 0) sql += ` WHERE ${this.conditions.join(' AND ')}`;
    if (this._orderBy) sql += ` ORDER BY ${this._orderBy} ${this._order.toUpperCase()}`;
    if (this._limit !== null) sql += ` LIMIT ${this._limit}`;
    if (this._offset !== null) sql += ` OFFSET ${this._offset}`;
    return { sql, params: [...this.params] };
  }
  
  buildCount(table: string): { sql: string; params: unknown[] } {
    let sql = `SELECT COUNT(*) FROM ${table}`;
    if (this.conditions.length > 0) sql += ` WHERE ${this.conditions.join(' AND ')}`;
    return { sql, params: [...this.params] };
  }
}

class Repository<T extends Record<string, unknown>> {
  protected schema: SchemaValidator;
  
  constructor(protected tableName: string, schema: Schema) {
    this.schema = new SchemaValidator(schema);
  }
  
  protected async executeQuery(sql: string, params: unknown[]): Promise<T[]> {
    throw new Error('executeQuery must be implemented by subclass');
  }
  
  protected async executeScalar(sql: string, params: unknown[]): Promise<number> {
    throw new Error('executeScalar must be implemented by subclass');
  }
  
  async findMany(options: QueryOptions = {}): Promise<T[]> {
    const builder = new QueryBuilder();
    if (options.where) {
      for (const [key, value] of Object.entries(options.where)) {
        if (Array.isArray(value)) builder.where(key, 'IN', value);
        else builder.where(key, '=', value);
      }
    }
    if (options.orderBy) builder.orderBy(options.orderBy, options.order);
    if (options.limit) builder.limit(options.limit);
    if (options.offset) builder.offset(options.offset);
    const { sql, params } = builder.build(this.tableName);
    return this.executeQuery(sql, params);
  }
  
  async findOne(id: unknown): Promise<T | null> {
    const results = await this.findMany({ where: { id }, limit: 1 });
    return results[0] || null;
  }
  
  async count(where?: Record<string, unknown>): Promise<number> {
    const builder = new QueryBuilder();
    if (where) {
      for (const [key, value] of Object.entries(where)) builder.where(key, '=', value);
    }
    const { sql, params } = builder.buildCount(this.tableName);
    return this.executeScalar(sql, params);
  }
  
  async create(data: Omit<T, 'id'>): Promise<T> {
    const withDefaults = this.schema.applyDefaults(data as Record<string, unknown>);
    const { valid, errors } = this.schema.validate(withDefaults);
    if (!valid) throw new Error(`Validation failed: ${errors.join(', ')}`);
    const fields = Object.keys(withDefaults).join(', ');
    const placeholders = Object.keys(withDefaults).map((_, i) => `$${i + 1}`).join(', ');
    const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders}) RETURNING *`;
    const results = await this.executeQuery(sql, Object.values(withDefaults));
    return results[0];
  }
  
  async update(id: unknown, data: Partial<T>): Promise<T | null> {
    const existing = await this.findOne(id);
    if (!existing) return null;
    const merged = { ...existing, ...data };
    const { valid, errors } = this.schema.validate(merged as Record<string, unknown>);
    if (!valid) throw new Error(`Validation failed: ${errors.join(', ')}`);
    const setClauses = Object.keys(data).map((k, i) => `${k} = $${i + 1}`).join(', ');
    const sql = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = $${Object.keys(data).length + 1} RETURNING *`;
    const results = await this.executeQuery(sql, [...Object.values(data), id]);
    return results[0] || null;
  }
  
  async delete(id: unknown): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const count = await this.executeScalar(sql, [id]);
    return count > 0;
  }
  
  async aggregate(options: { where?: Record<string, unknown>; sum?: string[]; avg?: string[]; min?: string[]; max?: string[] }): Promise<AggregateResult> {
    const selects = ['COUNT(*) as count'];
    if (options.sum) selects.push(...options.sum.map(f => `SUM(${f}) as sum_${f}`));
    if (options.avg) selects.push(...options.avg.map(f => `AVG(${f}) as avg_${f}`));
    if (options.min) selects.push(...options.min.map(f => `MIN(${f}) as min_${f}`));
    if (options.max) selects.push(...options.max.map(f => `MAX(${f}) as max_${f}`));
    const builder = new QueryBuilder();
    if (options.where) {
      for (const [key, value] of Object.entries(options.where)) builder.where(key, '=', value);
    }
    const { sql: whereSql, params } = builder.build(this.tableName);
    const sql = `SELECT ${selects.join(', ')} FROM ${this.tableName}${whereSql.includes('WHERE') ? whereSql.slice(whereSql.indexOf('WHERE')) : ''}`;
    const results = await this.executeQuery(sql, params);
    const row = results[0] || {};
    const result: AggregateResult = { count: Number(row['count'] || 0) };
    if (options.sum) { result.sum = {}; for (const f of options.sum) result.sum[f] = Number(row[`sum_${f}`] || 0); }
    if (options.avg) { result.avg = {}; for (const f of options.avg) result.avg[f] = Number(row[`avg_${f}`] || 0); }
    if (options.min) { result.min = {}; for (const f of options.min) result.min[f] = Number(row[`min_${f}`] || 0); }
    if (options.max) { result.max = {}; for (const f of options.max) result.max[f] = Number(row[`max_${f}`] || 0); }
    return result;
  }
}

class MigrationRunner {
  private applied: Set<number> = new Set();
  
  constructor(private migrations: MigrationStep[]) {
    this.migrations.sort((a, b) => a.version - b.version);
  }
  
  async runUp(targetVersion?: number): Promise<number[]> {
    const applied: number[] = [];
    for (const migration of this.migrations) {
      if (this.applied.has(migration.version)) continue;
      if (targetVersion !== undefined && migration.version > targetVersion) break;
      await this.execute(migration.up);
      this.applied.add(migration.version);
      applied.push(migration.version);
    }
    return applied;
  }
  
  async runDown(targetVersion: number): Promise<number[]> {
    const rolled: number[] = [];
    const toRollback = [...this.migrations].reverse().filter(m => m.version > targetVersion && this.applied.has(m.version));
    for (const migration of toRollback) {
      await this.execute(migration.down);
      this.applied.delete(migration.version);
      rolled.push(migration.version);
    }
    return rolled;
  }
  
  private async execute(sql: string): Promise<void> {
    console.log(`Executing: ${sql.slice(0, 50)}...`);
  }
  
  getCurrentVersion(): number {
    return Math.max(0, ...Array.from(this.applied));
  }
  
  getPendingMigrations(): MigrationStep[] {
    return this.migrations.filter(m => !this.applied.has(m.version));
  }
}

export { SchemaValidator, QueryBuilder, Repository, MigrationRunner };
export type { Schema, FieldDef, QueryOptions, AggregateResult, MigrationStep };
