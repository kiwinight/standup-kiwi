/**
 * Adds a duration to the current time to get a future date
 * @param duration - Duration string in format like "1h", "24h", "7d", "30d"
 * @returns Future Date object
 * @throws Error if format is invalid
 */
export function addDurationToNow(duration: string): Date {
  const now = new Date();
  const match = duration.match(/^(\d+)([hdwm])$/);

  if (!match) {
    throw new Error(
      'Invalid duration format. Use format like "1h", "24h", "7d", "30d"',
    );
  }

  const [, amount, unit] = match;
  const value = parseInt(amount, 10);

  switch (unit) {
    case 'h':
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case 'd':
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    case 'w':
      return new Date(now.getTime() + value * 7 * 24 * 60 * 60 * 1000);
    case 'm':
      return new Date(now.getTime() + value * 30 * 24 * 60 * 60 * 1000);
    default:
      throw new Error('Invalid time unit. Use h, d, w, or m');
  }
}
