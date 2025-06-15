/**
 * Generates a UUID v4 string
 *
 * Provides secure UUID generation with fallbacks for environments
 * where crypto.randomUUID is not available (e.g., insecure HTTP contexts)
 *
 * @returns A UUID v4 string (e.g., "123e4567-e89b-12d3-a456-426614174000")
 */
export function createRandomUUID(): string {
  // Try crypto.randomUUID first (modern browsers, secure contexts)
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  // Fallback using crypto.getRandomValues (better browser support)
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const hex = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");

    // Insert hyphens and set version (4) and variant bits
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      "4" + hex.slice(13, 16), // Version 4
      ((parseInt(hex.slice(16, 17), 16) & 0x3) | 0x8).toString(16) +
        hex.slice(17, 20), // Variant
      hex.slice(20, 32),
    ].join("-");
  }

  // Final fallback using Math.random (works everywhere)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
