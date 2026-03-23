type FilterOp = '=' | '!=' | '>' | '<' | '>=' | '<=';
interface Col { type: string; nullable?: boolean; }
interface Qry { table: string; where: Array<{col: string; op: FilterOp; val: unknown}>; lim?: number; offs?: number; ord?: string; }
class QB {
  private q: Qry;
  constructor(t: string) { this.q = { table: t, where: [] }; }
  where(col: string, op: FilterOp, val: unknown): this { this.q.where.push({col, op, val}); return this; }
  limit(n: number): this { this.q.lim = n; return this; }
  offset(n: number): this { this.q.offs = n; return this; }
  order(col: string): this { this.q.ord = col; return this; }
  build(): string {
    let s = `SELECT * FROM ${this.q.table}`;
    if (this.q.where.length) s += ' WHERE ' + this.q.where.map((w,i) => `${w.col} ${w.op} $${i+1}`).join(' AND ');
    if (this.q.ord) s += ` ORDER BY ${this.q.ord}`;
    if (this.q.lim) s += ` LIMIT ${this.q.lim}`;
    if (this.q.offs) s += ` OFFSET ${this.q.offs}`;
    return s;
  }
}
export { QB };
export type { Col, Qry, FilterOp };
