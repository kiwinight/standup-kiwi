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
    const data: User = await response.json(); // TODO: handle error case
    return data;
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
