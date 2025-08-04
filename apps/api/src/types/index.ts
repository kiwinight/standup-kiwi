// Database types from Drizzle schema
export type {
  Board,
  InsertBoard,
  StandupForm,
  InsertStandupForm,
  Standup,
  InsertStandup,
  UsersToBoards,
  InsertUsersToBoards,
  Invitation,
  InsertInvitation,
  UsersToBoardsRole,
} from '../libs/db/schema';

// Auth service types
export type {
  User,
  ListUser,
  Team,
  ClientReadOnlyMetadata,
  ViewType,
  OtpSignInResponse,
} from '../auth/auth-service.types';

// Add other domain types here as the project grows
// export type { SomeType } from '../other/module';
