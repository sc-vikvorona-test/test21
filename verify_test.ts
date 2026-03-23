interface DataPoint { timestamp: number; value: number; label: string; }
interface Series { id: string; points: DataPoint[]; metadata: Record<string, string>; }

class TimeSeriesAnalyzer {
  constructor(private series: Series[]) {}
  
  getRange(seriesId: string, from: number, to: number): DataPoint[] {
    const s = this.series.find(s => s.id === seriesId);
    if (!s) return [];
    return s.points.filter(p => p.timestamp >= from && p.timestamp <= to);
  }
  
  aggregate(seriesId: string, interval: number): DataPoint[] {
    const s = this.series.find(s => s.id === seriesId);
    if (!s || s.points.length === 0) return [];
    const buckets = new Map<number, number[]>();
    for (const p of s.points) {
      const bucket = Math.floor(p.timestamp / interval) * interval;
      if (!buckets.has(bucket)) buckets.set(bucket, []);
      buckets.get(bucket)!.push(p.value);
    }
    return Array.from(buckets.entries()).sort(([a], [b]) => a - b).map(([ts, vals]) => ({
      timestamp: ts,
      value: vals.reduce((a, b) => a + b, 0) / vals.length,
      label: `bucket_${ts}`
    }));
  }
  
  anomalies(seriesId: string, stdDevThreshold: number = 2): DataPoint[] {
    const s = this.series.find(s => s.id === seriesId);
    if (!s || s.points.length < 2) return [];
    const values = s.points.map(p => p.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    return s.points.filter(p => Math.abs(p.value - mean) > stdDevThreshold * stdDev);
  }
}

export { TimeSeriesAnalyzer };
export type { DataPoint, Series };
