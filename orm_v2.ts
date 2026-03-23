type FilterOp = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN' | 'IS NULL' | 'IS NOT NULL';
type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';

interface ColumnDef { type: string; nullable?: boolean; default?: unknown; unique?: boolean; references?: { table: string; column: string }; }
interface TableDef { columns: Record<string, ColumnDef>; primaryKey: string[]; indexes?: Array<{ columns: string[]; unique?: boolean }>; }
interface JoinClause { type: JoinType; table: string; on: string; }
interface SelectOptions { columns?: string[]; joins?: JoinClause[]; where?: WhereClause[]; groupBy?: string[]; having?: string; orderBy?: Array<{ column: string; direction: 'ASC' | 'DESC' }>; limit?: number; offset?: number; }
interface WhereClause { column: string; op: FilterOp; value?: unknown; }

class SQL {
  static escape(value: unknown): string {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'number') return String(value);
    if (value instanceof Date) return `'${value.toISOString()}'`;
    if (Array.isArray(value)) return `(${value.map(v => SQL.escape(v)).join(', ')})`;
    return `'${String(value).replace(/'/g, "''")}'`;
  }

  static identifier(name: string): string {
    if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(name)) throw new Error(`Invalid identifier: ${name}`);
    return `"${name}"`;
  }
}

class SelectBuilder {
  private table: string;
  private _columns: string[] = ['*'];
  private _joins: JoinClause[] = [];
  private _where: Array<{ clause: string; params: unknown[] }> = [];
  private _groupBy: string[] = [];
  private _having: string | null = null;
  private _orderBy: Array<{ column: string; direction: 'ASC' | 'DESC' }> = [];
  private _limit: number | null = null;
  private _offset: number | null = null;
  private params: unknown[] = [];

  constructor(table: string) { this.table = table; }

  select(...columns: string[]): this { this._columns = columns; return this; }
  
  join(table: string, on: string, type: JoinType = 'INNER'): this {
    this._joins.push({ type, table, on }); return this;
  }
  
  where(column: string, op: FilterOp, value?: unknown): this {
    if (op === 'IS NULL' || op === 'IS NOT NULL') {
      this._where.push({ clause: `${SQL.identifier(column)} ${op}`, params: [] });
    } else if (op === 'IN' || op === 'NOT IN') {
      const vals = Array.isArray(value) ? value : [value];
      const placeholders = vals.map((_, i) => `$${this.params.length + i + 1}`).join(', ');
      this._where.push({ clause: `${SQL.identifier(column)} ${op} (${placeholders})`, params: vals });
    } else {
      this._where.push({ clause: `${SQL.identifier(column)} ${op} $${this.params.length + 1}`, params: [value] });
    }
    return this;
  }
  
  groupBy(...columns: string[]): this { this._groupBy = columns; return this; }
  having(condition: string): this { this._having = condition; return this; }
  
  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this._orderBy.push({ column, direction }); return this;
  }
  
  limit(n: number): this { this._limit = n; return this; }
  offset(n: number): this { this._offset = n; return this; }

  build(): { sql: string; params: unknown[] } {
    let sql = `SELECT ${this._columns.map(c => c === '*' ? '*' : SQL.identifier(c)).join(', ')} FROM ${SQL.identifier(this.table)}`;
    for (const join of this._joins) sql += ` ${join.type} JOIN ${SQL.identifier(join.table)} ON ${join.on}`;
    const allParams: unknown[] = [];
    if (this._where.length > 0) {
      let paramOffset = 0;
      const clauses = this._where.map(w => {
        const clause = w.clause.replace(/\$(\d+)/g, (_, n) => `$${parseInt(n) + paramOffset}`);
        paramOffset += w.params.length;
        allParams.push(...w.params);
        return clause;
      });
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }
    if (this._groupBy.length > 0) sql += ` GROUP BY ${this._groupBy.map(c => SQL.identifier(c)).join(', ')}`;
    if (this._having) sql += ` HAVING ${this._having}`;
    if (this._orderBy.length > 0) sql += ` ORDER BY ${this._orderBy.map(o => `${SQL.identifier(o.column)} ${o.direction}`).join(', ')}`;
    if (this._limit !== null) sql += ` LIMIT ${this._limit}`;
    if (this._offset !== null) sql += ` OFFSET ${this._offset}`;
    return { sql, params: allParams };
  }
}

class InsertBuilder {
  constructor(private table: string, private data: Record<string, unknown>) {}
  
  build(returning?: string[]): { sql: string; params: unknown[] } {
    const columns = Object.keys(this.data);
    const params = Object.values(this.data);
    const placeholders = columns.map((_, i) => `$${i + 1}`);
    let sql = `INSERT INTO ${SQL.identifier(this.table)} (${columns.map(SQL.identifier).join(', ')}) VALUES (${placeholders.join(', ')})`;
    if (returning && returning.length > 0) sql += ` RETURNING ${returning.map(SQL.identifier).join(', ')}`;
    return { sql, params };
  }
  
  buildBulk(rows: Record<string, unknown>[], returning?: string[]): { sql: string; params: unknown[] } {
    if (rows.length === 0) throw new Error('No rows to insert');
    const columns = Object.keys(rows[0]);
    const params: unknown[] = [];
    const valueSets = rows.map(row => {
      const rowParams = columns.map(c => row[c]);
      const placeholders = rowParams.map((_, i) => `$${params.length + i + 1}`);
      params.push(...rowParams);
      return `(${placeholders.join(', ')})`;
    });
    let sql = `INSERT INTO ${SQL.identifier(this.table)} (${columns.map(SQL.identifier).join(', ')}) VALUES ${valueSets.join(', ')}`;
    if (returning && returning.length > 0) sql += ` RETURNING ${returning.map(SQL.identifier).join(', ')}`;
    return { sql, params };
  }
}

class UpdateBuilder {
  private _where: Array<{ clause: string; params: unknown[] }> = [];
  
  constructor(private table: string, private data: Record<string, unknown>) {}
  
  where(column: string, value: unknown): this {
    this._where.push({ clause: `${SQL.identifier(column)} = $OFFSET`, params: [value] });
    return this;
  }
  
  build(returning?: string[]): { sql: string; params: unknown[] } {
    const setParams = Object.values(this.data);
    const setClauses = Object.keys(this.data).map((col, i) => `${SQL.identifier(col)} = $${i + 1}`);
    const allParams = [...setParams];
    const whereClauses = this._where.map(w => {
      const clause = w.clause.replace('$OFFSET', `$${allParams.length + 1}`);
      allParams.push(...w.params);
      return clause;
    });
    let sql = `UPDATE ${SQL.identifier(this.table)} SET ${setClauses.join(', ')}`;
    if (whereClauses.length > 0) sql += ` WHERE ${whereClauses.join(' AND ')}`;
    if (returning && returning.length > 0) sql += ` RETURNING ${returning.map(SQL.identifier).join(', ')}`;
    return { sql, params: allParams };
  }
}

class UpsertBuilder {
  constructor(private table: string, private data: Record<string, unknown>, private conflictColumns: string[]) {}
  
  build(returning?: string[]): { sql: string; params: unknown[] } {
    const insertBuilder = new InsertBuilder(this.table, this.data);
    const { sql: insertSql, params } = insertBuilder.build();
    const nonConflict = Object.keys(this.data).filter(k => !this.conflictColumns.includes(k));
    const updateSet = nonConflict.map((col, i) => `${SQL.identifier(col)} = EXCLUDED.${SQL.identifier(col)}`).join(', ');
    let sql = `${insertSql} ON CONFLICT (${this.conflictColumns.map(SQL.identifier).join(', ')}) DO UPDATE SET ${updateSet}`;
    if (returning && returning.length > 0) sql += ` RETURNING ${returning.map(SQL.identifier).join(', ')}`;
    return { sql, params };
  }
}

export { SQL, SelectBuilder, InsertBuilder, UpdateBuilder, UpsertBuilder };
export type { ColumnDef, TableDef, SelectOptions, WhereClause, JoinClause, FilterOp, JoinType };
