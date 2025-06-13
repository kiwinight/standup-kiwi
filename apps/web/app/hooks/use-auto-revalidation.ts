import { useEffect, useRef } from "react";
import { useRevalidator } from "react-router";
import { useFocus } from "./use-focus";
import { useVisibilityChange } from "./use-visibility-change";

interface AutoRevalidationOptions {
  /**
   * Enable automatic revalidation when document regains focus
   */
  focus?: boolean;
  /**
   * Enable automatic revalidation when document becomes visible
   */
  visibilityChange?: boolean;
  /**
   * Enable automatic revalidation at a fixed interval (in milliseconds)
   * @minimum 1000
   */
  interval?: number;
}

/**
 * A hook that automatically triggers revalidation based on document focus, visibility, or a time interval.
 */
export function useAutoRevalidation({
  focus = false,
  visibilityChange = false,
  interval,
}: AutoRevalidationOptions = {}) {
  if (typeof window === "undefined") {
    throw new Error("useAutoRevalidation is a client-only hook");
  }

  const revalidator = useRevalidator();
  const isDocumentFocused = useFocus();
  const isDocumentVisible = useVisibilityChange();

  const previousFocusState = useRef(isDocumentFocused);
  const previousVisibilityState = useRef(isDocumentVisible);

  const isRevalidatorIdle = () => revalidator.state === "idle";

  // Handle focus-based automatic revalidation
  useEffect(() => {
    if (!focus) return;

    // Only revalidate when focus state changes from false to true
    if (
      isDocumentFocused &&
      !previousFocusState.current &&
      isRevalidatorIdle()
    ) {
      revalidator.revalidate();
    }
    previousFocusState.current = isDocumentFocused;
  }, [focus, isDocumentFocused, revalidator]);

  // Handle visibility-based automatic revalidation
  useEffect(() => {
    if (!visibilityChange) return;

    // Only revalidate when visibility state changes from false to true
    if (
      isDocumentVisible &&
      !previousVisibilityState.current &&
      isRevalidatorIdle()
    ) {
      revalidator.revalidate();
    }
    previousVisibilityState.current = isDocumentVisible;
  }, [visibilityChange, isDocumentVisible, revalidator]);

  // Handle interval-based automatic revalidation
  useEffect(() => {
    if (!interval || interval < 1000) return;

    const intervalId = setInterval(() => {
      if (isRevalidatorIdle()) {
        revalidator.revalidate();
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval, revalidator]);

  return {
    revalidator,
    state: {
      isDocumentFocused,
      isDocumentVisible,
    },
  };
}
