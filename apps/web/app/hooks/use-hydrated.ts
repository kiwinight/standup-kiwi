import { useSyncExternalStore } from "react";

function subscribe() {
  // biome-ignore lint/suspicious/noEmptyBlockStatements: Mock function
  return () => {};
}

/**
 * Originally from: https://github.com/sergiodxa/remix-utils/blob/main/src/react/use-hydrated.ts
 */
/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on. Even if a new component renders it will
 * always start with true.
 *
 * Example: Disable a button that needs JS to work.
 * ```tsx
 * let hydrated = useHydrated();
 * return (
 *   <button type="button" disabled={!hydrated} onClick={doSomethingCustom}>
 *     Click me
 *   </button>
 * );
 * ```
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
