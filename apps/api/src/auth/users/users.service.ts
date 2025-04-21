import { Inject, Injectable } from '@nestjs/common';
import { boards, usersToBoards, Board } from 'src/libs/db/schema';
import { count, eq } from 'drizzle-orm';
import { ListUser, User } from 'src/auth/auth-service.types';
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

  async list(params?: {
    teamId?: string;
    limit?: number;
    cursor?: string;
    orderBy?: string;
    desc?: boolean;
    query?: string;
  }) {
    console.log('params', params);
    const queryParams = new URLSearchParams();

    // Add optional query parameters if they exist
    if (params?.teamId) queryParams.append('team_id', params.teamId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.cursor) queryParams.append('cursor', params.cursor);
    if (params?.orderBy) queryParams.append('order_by', params.orderBy);
    if (params?.desc !== undefined)
      queryParams.append('desc', params.desc.toString());
    if (params?.query) queryParams.append('query', params.query);

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : '';

    const response = await fetch(
      `${process.env.AUTH_SERVICE_API_URL}/users${queryString}`,
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

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data:
      | { items: ListUser[]; pagination: { next_cursor: string } }
      | { error: string; code: string } = await response.json();

    if ('error' in data) {
      throw new Error(data.error);
    }

    // Remove server_metadata from each user
    return data.items.map((user) => ({
      ...user,
      server_metadata: null,
    }));
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
        timezone: boards.timezone,
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
