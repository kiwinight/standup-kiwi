import type {
  Board as ApiBoard,
  StandupForm as ApiStandupForm,
  Standup as ApiStandup,
  UsersToBoards,
  Invitation as ApiInvitation,
  UsersToBoardsRole,
  User as ApiUser,
  ListUser as ApiListUser,
  Team as ApiTeam,
  ClientReadOnlyMetadata as ApiClientReadOnlyMetadata,
  ViewType as ApiViewType,
} from "@api/types";

type Serialized<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

export type Board = Serialized<ApiBoard>;
export type StandupForm = Serialized<ApiStandupForm>;
export type Standup = Serialized<ApiStandup>;

export type Invitation = Serialized<ApiInvitation> & {
  currentUserStatus?: {
    isCollaborator: boolean;
    role?: "admin" | "collaborator";
  } | null;
  board?: {
    id: number;
    name: string;
  };
};

export type { UsersToBoards };
export type Role = UsersToBoardsRole;

export type User = ApiUser;
export type ListUser = ApiListUser;
export type Team = ApiTeam;
export type ClientReadOnlyMetadata = ApiClientReadOnlyMetadata;
export type ViewType = ApiViewType;

export type Appearance = "light" | "dark" | "inherit";

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

export interface Collaborator extends UsersToBoards {
  user: User;
}
