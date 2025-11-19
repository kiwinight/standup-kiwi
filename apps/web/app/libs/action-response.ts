export type ActionResponse<T = void> =
  | { ok: true; data: T }
  | { ok: true }
  | { ok: false; error: string };
