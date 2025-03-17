// TODO: Resolve monorepo type import issue and remove this

/**
 * Schemas
 */
export type Board = {
  id: number;
  name: string;
  activeStandupFormStructureId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type StandupFormStructure = {
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

export interface User {
  id: string;
  primary_email_verified: boolean;
  primary_email_auth_enabled: boolean;
  signed_up_at_millis: number;
  last_active_at_millis: number;
  primary_email: string;
  display_name: string | null;
  selected_team: Team | null;
  selected_team_id: string;
  profile_image_url: string;
  client_metadata: Record<string, any>;
  client_read_only_metadata: Record<string, any>;
  server_metadata: Record<string, any>;
  has_password: boolean;
}

export interface Standup {
  id: number;
  boardId: number;
  userId: string;
  formStructureId: number;
  formData: unknown;
  createdAt: string;
  updatedAt: string;
}

/**
 * API
 */

interface ApiErrorResponse {
  message: string;
  statusCode: number;
  error?: string;
}

export function isApiErrorResponse(
  response: unknown
): response is ApiErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "message" in response &&
    "statusCode" in response
  );
}

export type ApiResponse<T> = T | ApiErrorResponse;
