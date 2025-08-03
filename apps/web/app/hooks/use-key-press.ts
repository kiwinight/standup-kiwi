import { useEffect, useRef } from "react";

// Credit: Based on https://github.com/uidotdev/usehooks/blob/experimental/index.js
// Enhanced for keyboard shortcuts with key combinations and input field detection

interface UseKeyPressOptions {
  event?: "keydown" | "keyup";
  target?: Window | Document | HTMLElement;
  eventOptions?: boolean | AddEventListenerOptions;
}

// Helper function to parse key combinations like "Meta+Enter" or "Control+Enter"
function parseKeySpec(keySpec: string): {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
} {
  const parts = keySpec.split("+");
  const result: any = {};

  for (const part of parts) {
    const normalizedPart = part.toLowerCase();

    switch (normalizedPart) {
      case "ctrl":
      case "control":
        result.ctrlKey = true;
        break;
      case "meta":
      case "cmd":
      case "command":
        result.metaKey = true;
        break;
      case "shift":
        result.shiftKey = true;
        break;
      case "alt":
      case "option":
        result.altKey = true;
        break;
      default:
        result.key = part; // Keep original case for the actual key
    }
  }

  return result;
}

// Helper function to check if event matches the key specification
function matchesKeySpec(event: KeyboardEvent, keySpec: string): boolean {
  const spec = parseKeySpec(keySpec);

  // Check the main key
  if (spec.key && event.key !== spec.key) {
    return false;
  }

  // Check modifier keys (only if specified in the spec)
  if (spec.ctrlKey !== undefined && event.ctrlKey !== spec.ctrlKey) {
    return false;
  }

  if (spec.metaKey !== undefined && event.metaKey !== spec.metaKey) {
    return false;
  }

  if (spec.shiftKey !== undefined && event.shiftKey !== spec.shiftKey) {
    return false;
  }

  if (spec.altKey !== undefined && event.altKey !== spec.altKey) {
    return false;
  }

  return true;
}

export function useKeyPress(
  key: string | string[],
  callback: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {}
) {
  const {
    event = "keydown",
    target = typeof window !== "undefined" ? window : null,
    eventOptions,
  } = options;

  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!target) return;

    const handler = (event: KeyboardEvent) => {
      const keys = Array.isArray(key) ? key : [key];

      // Check if any of the specified keys match
      for (const keySpec of keys) {
        if (matchesKeySpec(event, keySpec)) {
          callbackRef.current(event);
          break;
        }
      }
    };

    const targetElement = target as any;
    targetElement.addEventListener(event, handler, eventOptions);

    return () => {
      targetElement.removeEventListener(event, handler, eventOptions);
    };
  }, [key, target, event, eventOptions]);
}
