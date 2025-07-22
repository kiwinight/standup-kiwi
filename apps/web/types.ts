// TODO: Resolve monorepo type import issue and remove this

export type Appearance = "light" | "dark" | "inherit";

/**
 * Schemas
 */
export type Board = {
  id: number;
  name: string;
  timezone: string;
  activeStandupFormId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type StandupForm = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  boardId: number;
  schema: unknown;
};

interface Team {
  created_at_millis: number;
  id: string;
  display_name: string;
  server_metadata: Record<string, any>;
  profile_image_url: string;
  client_metadata: Record<string, any>;
  client_read_only_metadata: Record<string, any>;
}

export interface ClientReadOnlyMetadata {
  lastAccessedBoardId?: number;
  settings?: {
    appearance?: Appearance;
  };
}

export interface User {
  id: string;
  requires_totp_mfa: boolean;
  auth_with_email: boolean;
  oauth_providers: string[];
  is_anonymous: boolean;
  primary_email_verified: boolean;
  primary_email_auth_enabled: boolean;
  signed_up_at_millis: number;
  last_active_at_millis: number;
  primary_email: string;
  display_name: string | null;
  selected_team: Team | null;
  selected_team_id: string | null;
  profile_image_url: string | null;
  client_metadata: Record<string, any> | null;
  passkey_auth_enabled: boolean;
  otp_auth_enabled: boolean;
  client_read_only_metadata: ClientReadOnlyMetadata | null;
  server_metadata: null; // NOTE: This value should be always null from the client side
  has_password: boolean;
}

export interface ListUser extends User {
  is_anonymous: boolean;
}

export interface Standup {
  id: number;
  boardId: number;
  userId: string;
  formId: number;
  formData: unknown;
  createdAt: string;
  updatedAt: string;
}

export type UsersToBoards = {
  boardId: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  role: "admin" | "collaborator";
};

export interface Collaborator extends UsersToBoards {
  user: User;
}

export type Invitation = {
  id: number;
  boardId: number;
  inviterUserId: string;
  token: string;
  role: "admin" | "collaborator";
  expiresAt: string;
  deactivatedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * API
 */

export interface ErrorData {
  message: string;
  statusCode: number;
  error?: string;
}

export function createErrorData(
  message: string,
  statusCode: number,
  error?: string
): ErrorData {
  return {
    message,
    statusCode,
    ...(error ? { error } : {}),
  };
}

export function isErrorData(data: unknown): data is ErrorData {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    "statusCode" in data
  );
}

export type ApiData<T> = T | ErrorData;
