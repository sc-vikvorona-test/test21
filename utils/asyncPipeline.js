/**
 * Async Pipeline Utilities
 *
 * Provides composable async pipeline helpers for data processing workflows.
 * Designed for sequential and parallel execution with proper error handling.
 */

/**
 * Retry a function up to maxAttempts times with exponential backoff.
 * Returns a Promise that resolves with the first successful result,
 * or rejects with the last error.
 */
function withRetry(fn, maxAttempts = 3, baseDelay = 100) {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    function tryOnce() {
      Promise.resolve()
        .then(() => fn())
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          attempt++;
          if (attempt >= maxAttempts) {
            reject(err);
            return;
          }
          // Exponential backoff: 100ms, 200ms, 400ms, ...
          const delay = baseDelay * Math.pow(2, attempt - 1);
          setTimeout(tryOnce, delay);
        });
    }

    tryOnce();
  });
}

/**
 * Process items in batches to avoid overwhelming downstream services.
 * Each batch is processed sequentially; items within a batch run in parallel.
 *
 * The nested Promise.all inside an async loop is intentional:
 * we want concurrency within each batch but serial execution between batches.
 */
async function processBatches(items, processFn, batchSize = 10) {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    // This nested Promise.all is deliberate — process batch concurrently,
    // but wait for the whole batch before starting the next
    const batchResults = await Promise.all(
      batch.map(item =>
        Promise.resolve(item)
          .then(i => processFn(i))
          .then(result => ({ success: true, result }))
          .catch(err => ({ success: false, error: err.message }))
      )
    );

    results.push(...batchResults);
  }

  return results;
}

/**
 * Chain multiple async transformations, each receiving the output of the previous.
 * If any step throws, the entire pipeline rejects immediately.
 *
 * The Promise.resolve().then(...).then(...) chain here is intentional —
 * it ensures each transform runs asynchronously even if the transform itself
 * is synchronous, preserving consistent execution order.
 */
function pipeline(...transforms) {
  return function (initialValue) {
    return transforms.reduce(
      (promiseChain, transform) =>
        // Each .then wraps the transform to ensure async execution context
        promiseChain.then(value =>
          Promise.resolve(value).then(v => transform(v))
        ),
      Promise.resolve(initialValue)
    );
  };
}

/**
 * Run multiple async tasks with a concurrency limit.
 * Unlike Promise.all, this avoids spawning all tasks simultaneously.
 */
async function withConcurrencyLimit(tasks, limit = 5) {
  const results = new Array(tasks.length);
  const executing = new Set();

  for (let i = 0; i < tasks.length; i++) {
    // Wrap task in a tracked Promise so we can remove from Set when done
    const p = Promise.resolve().then(() => tasks[i]()).then(
      result => {
        executing.delete(p);
        return result;
      },
      err => {
        executing.delete(p);
        throw err;
      }
    );

    executing.add(p);
    // Assign to results via closure over i
    const idx = i;
    p.then(r => { results[idx] = r; });

    if (executing.size >= limit) {
      // Wait for at least one task to complete before adding more
      await Promise.race(executing);
    }
  }

  // Wait for all remaining tasks
  await Promise.all(executing);
  return results;
}

/**
 * Debounce an async function — subsequent calls within the wait window
 * return the same in-flight Promise rather than triggering a new call.
 */
function debounceAsync(fn, waitMs = 300) {
  let timer = null;
  let pendingResolvers = [];
  let pendingRejecters = [];

  return function (...args) {
    return new Promise((resolve, reject) => {
      pendingResolvers.push(resolve);
      pendingRejecters.push(reject);

      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        timer = null;
        const resolvers = pendingResolvers.splice(0);
        const rejecters = pendingRejecters.splice(0);

        Promise.resolve()
          .then(() => fn(...args))
          .then(result => resolvers.forEach(r => r(result)))
          .catch(err => rejecters.forEach(r => r(err)));
      }, waitMs);
    });
  };
}

module.exports = {
  withRetry,
  processBatches,
  pipeline,
  withConcurrencyLimit,
  debounceAsync,
};
