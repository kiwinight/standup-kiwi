import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UsersToBoards, usersToBoards } from '../../libs/db/schema';
import { Database, DATABASE_TOKEN } from 'src/db/db.module';
import { eq, and } from 'drizzle-orm';
import { UsersService } from 'src/auth/users/users.service';
import { User } from 'src/auth/auth-service.types';

@Injectable()
export class CollaboratorsService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly db: Database,
    private readonly usersService: UsersService,
  ) {}

  async list(boardId: number): Promise<(UsersToBoards & { user: User })[]> {
    const collaborators = await this.db
      .select()
      .from(usersToBoards)
      .where(eq(usersToBoards.boardId, boardId));

    if (collaborators.length === 0) {
      return [];
    }

    const userIds = collaborators.map((c) => c.userId);

    const users = await Promise.all(
      userIds.map((userId) => this.usersService.get(userId)),
    );

    return collaborators.map((collaborator, index) => {
      const user = users[index];
      return {
        ...collaborator,
        user,
      };
    });
  }

  async update(
    boardId: number,
    userId: string,
    role: 'admin' | 'collaborator',
  ): Promise<UsersToBoards & { user: User }> {
    const [updatedCollaborator] = await this.db
      .update(usersToBoards)
      .set({ role })
      .where(
        and(
          eq(usersToBoards.boardId, boardId),
          eq(usersToBoards.userId, userId),
        ),
      )
      .returning();

    if (!updatedCollaborator) {
      throw new NotFoundException('Collaborator not found');
    }

    return {
      ...updatedCollaborator,
      user: await this.usersService.get(userId),
    };
  }

  async delete(boardId: number, userId: string): Promise<void> {
    await this.db
      .delete(usersToBoards)
      .where(
        and(
          eq(usersToBoards.boardId, boardId),
          eq(usersToBoards.userId, userId),
        ),
      );
  }
}
