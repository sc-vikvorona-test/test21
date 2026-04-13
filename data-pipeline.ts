/**
 * Type-safe data pipeline with proper generics, null handling, and recursive types.
 * This is intentionally well-written code to test for false positives.
 */

// Recursive type for tree structures
type TreeNode<T> = {
  value: T;
  children: TreeNode<T>[];
  metadata?: Record<string, unknown>;
};

// Branded type for validated IDs
type BrandedId<T extends string> = string & { readonly __brand: T };
type UserId = BrandedId<'UserId'>;
type ResourceId = BrandedId<'ResourceId'>;

function createUserId(raw: string): UserId {
  if (!raw || raw.trim().length === 0) {
    throw new Error('User ID cannot be empty');
  }
  return raw as UserId;
}

// Generic pipeline stage with proper error handling
interface PipelineStage<TIn, TOut> {
  name: string;
  process: (input: TIn) => Promise<TOut>;
  onError?: (error: Error, input: TIn) => TOut | never;
}

// Type-safe pipeline builder
class Pipeline<T> {
  private stages: PipelineStage<unknown, unknown>[] = [];

  addStage<TOut>(stage: PipelineStage<T, TOut>): Pipeline<TOut> {
    this.stages.push(stage as PipelineStage<unknown, unknown>);
    return this as unknown as Pipeline<TOut>;
  }

  async execute(input: T): Promise<unknown> {
    let current: unknown = input;
    
    for (const stage of this.stages) {
      try {
        current = await stage.process(current);
      } catch (error) {
        if (stage.onError && error instanceof Error) {
          current = stage.onError(error, current as never);
        } else {
          throw error;
        }
      }
    }
    
    return current;
  }
}

// Null-safe tree traversal with proper typing
function traverseTree<T>(
  node: TreeNode<T> | null | undefined,
  visitor: (node: TreeNode<T>, depth: number) => void,
  depth = 0
): void {
  if (node == null) {
    return;
  }
  
  visitor(node, depth);
  
  for (const child of node.children) {
    traverseTree(child, visitor, depth + 1);
  }
}

// Generic memoization with proper type inference
function memoize<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyFn?: (...args: TArgs) => string
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();
  
  return (...args: TArgs): TReturn => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Example usage with proper types
const examplePipeline = new Pipeline<string>()
  .addStage({
    name: 'parse',
    process: async (input: string) => JSON.parse(input) as Record<string, unknown>,
    onError: (err) => { throw new Error(`Parse failed: ${err.message}`); }
  })
  .addStage({
    name: 'validate',
    process: async (data: Record<string, unknown>) => {
      if (!data.id || typeof data.id !== 'string') {
        throw new Error('Missing required field: id');
      }
      return { ...data, id: createUserId(data.id) };
    }
  });

export {
  TreeNode,
  BrandedId,
  UserId,
  ResourceId,
  createUserId,
  PipelineStage,
  Pipeline,
  traverseTree,
  memoize,
  examplePipeline,
};
