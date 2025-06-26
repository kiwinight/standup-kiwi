import { User } from 'src/auth/auth-service.types';
import { UsersToBoards } from 'src/libs/db/schema';

export type Collaborator = UsersToBoards & {
  user: User;
};
