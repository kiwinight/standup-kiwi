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

  // Ensure modifiers match exactly. If not in spec, they must be false.
  if (event.ctrlKey !== (spec.ctrlKey ?? false)) {
    return false;
  }
  if (event.metaKey !== (spec.metaKey ?? false)) {
    return false;
  }
  if (event.shiftKey !== (spec.shiftKey ?? false)) {
    return false;
  }
  if (event.altKey !== (spec.altKey ?? false)) {
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
