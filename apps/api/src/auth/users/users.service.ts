import { Injectable } from '@nestjs/common';
import { db } from 'src/libs/db';
import { boards, usersToBoards, Board } from 'src/libs/db/schema';
import { eq } from 'drizzle-orm';
import { User } from 'src/auth/auth-service.types';

@Injectable()
export class UsersService {
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
    const data: User = await response.json();
    return data;
  }

  async getBoardsByUserId(userId: string): Promise<Board[]> {
    const results = await db
      .select({
        id: boards.id,
        name: boards.name,
        formSchemas: boards.formSchemas,
        createdAt: boards.createdAt,
        updatedAt: boards.updatedAt,
      })
      .from(boards)
      .innerJoin(usersToBoards, eq(boards.id, usersToBoards.boardId))
      .where(eq(usersToBoards.userId, userId));

    return results;
  }
}
