import { useEffect, useRef } from "react";

export function useAwait<T>(
  promise: Promise<T | null>,
  onResolve: (data: T) => void
) {
  const callbackRef = useRef(onResolve);

  useEffect(() => {
    callbackRef.current = onResolve;
  });

  useEffect(() => {
    let isCancelled = false;

    const awaitPromise = async () => {
      try {
        const data = await promise;
        if (data !== null && !isCancelled) {
          callbackRef.current(data);
        }
      } catch (error) {
        console.error("Failed to await promise:", error);
      }
    };

    awaitPromise();

    return () => {
      isCancelled = true;
    };
  }, [promise]);
}
