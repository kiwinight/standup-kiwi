import { Inject, Injectable } from '@nestjs/common';
import { boards, usersToBoards, Board } from 'src/libs/db/schema';
import { count, eq } from 'drizzle-orm';
import { User } from 'src/auth/auth-service.types';
import { Database, DATABASE_TOKEN } from 'src/db/db.module';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly db: Database,
  ) {}

  async get(userId: string) {
    const response = await fetch(
      process.env.AUTH_SERVICE_API_URL + '/users/' + userId,
      {
        method: 'GET',
        headers: {
          'X-Stack-Access-Type': 'server',
          'X-Stack-Project-Id': process.env.AUTH_SERVICE_PROJECT_ID!,
          'X-Stack-Secret-Server-Key':
            process.env.AUTH_SERVICE_SECRET_SERVER_KEY!,
        },
      },
    );
    const user: User = await response.json(); // TODO: handle error case

    // NOTE: This is to avoid the server_metadata property from being included in the response
    user.server_metadata = null;

    return user;
  }

  async update(userId: string, user: Partial<User>) {
    const response = await fetch(
      process.env.AUTH_SERVICE_API_URL + '/users/' + userId,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Stack-Access-Type': 'server',
          'X-Stack-Project-Id': process.env.AUTH_SERVICE_PROJECT_ID!,
          'X-Stack-Secret-Server-Key':
            process.env.AUTH_SERVICE_SECRET_SERVER_KEY!,
        },
        body: JSON.stringify(user),
      },
    );

    const updatedUser: User = await response.json(); // TODO: handle error case

    return updatedUser;
  }

  async getBoardsOfUser(
    userId: string,
  ): Promise<(Board & { usersCount: number })[]> {
    return await this.db
      .select({
        id: boards.id,
        name: boards.name,
        activeStandupFormStructureId: boards.activeStandupFormStructureId,
        createdAt: boards.createdAt,
        updatedAt: boards.updatedAt,
        usersCount: count(usersToBoards.userId),
      })
      .from(boards)
      .innerJoin(usersToBoards, eq(boards.id, usersToBoards.boardId))
      .where(eq(usersToBoards.userId, userId))
      .groupBy(boards.id);
  }
}
