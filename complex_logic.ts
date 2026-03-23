function processItems(items: string[]): { result: string; count: number }[] {
  const output: { result: string; count: number }[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const words = item.split(' ');
    let count = 0;
    for (const word of words) {
      if (word.length > 3) count++;
    }
    const result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    output.push({ result, count });
  }
  return output;
}

function findDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();
  for (const n of arr) {
    if (seen.has(n)) duplicates.add(n);
    seen.add(n);
  }
  return Array.from(duplicates);
}

function mergeObjects<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source[key] !== undefined) {
      (result as any)[key] = source[key];
    }
  }
  return result;
}

function paginate<T>(items: T[], page: number, pageSize: number): { items: T[]; total: number; pages: number } {
  const total = items.length;
  const pages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { items: items.slice(start, end), total, pages };
}

async function fetchWithRetry(url: string, maxRetries: number = 3): Promise<string> {
  let lastError: Error | null = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (err) {
      lastError = err as Error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw lastError;
}
