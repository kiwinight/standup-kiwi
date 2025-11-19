/**
 * Wraps a promise to prevent unhandled rejection errors during server-side streaming.
 *
 * **When to use:**
 * - For promises passed to React's `<Await>` component (deferred promises)
 * - These promises are resolved during streaming and need error handling
 *
 * **When NOT to use:**
 * - For promises that are immediately awaited in the loader
 * - Client-side promises (this is a no-op on the client)
 *
 * **Why this exists:**
 * During SSR streaming, if a deferred promise rejects before React's error boundary
 * catches it, Node will crash with an unhandled rejection. This wrapper adds a
 * server-side catch handler to prevent the crash while still allowing React to
 * handle the error with errorElement.
 *
 * @example
 * ```typescript
 * // ✅ Correct usage - deferred promise for <Await>
 * const boardPromise = streamable(getBoard(boardId, { accessToken }));
 * return data({ boardPromise });
 *
 * // ❌ Incorrect usage - immediately awaited
 * const board = await streamable(getBoard(boardId, { accessToken }));
 * ```
 */
export function streamable<T>(promise: Promise<T>): Promise<T> {
  if (typeof window === "undefined") {
    promise.catch((error) => console.error(error));
  }
  return promise;
}

