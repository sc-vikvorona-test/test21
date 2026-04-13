// Type utility functions for data processing

function processValue(value: string | number): string {
  // BUG: only handles string branch, crashes on number
  const upper = (value as string).toUpperCase();
  return `Processed: ${upper}`;
}

// Intentional unsafe cast discarding type safety
function unsafeTransform(data: unknown): { id: number; name: string } {
  // Dangerous: bypasses all type checking
  return data as any;
}

function calculateLength(input: string | number): number {
  if (typeof input === "string") {
    return input.length;
  }
  // Missing number branch - returns undefined implicitly
  // TypeScript doesn't catch this without strict settings
}

export { processValue, unsafeTransform, calculateLength };
