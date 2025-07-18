import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UsersToBoards, usersToBoards } from '../../libs/db/schema';
import { Database, DATABASE_TOKEN } from '../../db/db.module';
import { eq, and, inArray, count } from 'drizzle-orm';
import { UsersService } from '../../auth/users/users.service';
import { User } from '../../auth/auth-service.types';
import { CollaboratorUpdateItem } from './dto/bulk-update-collaborators.dto';

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

  async count(boardId: number): Promise<number> {
    const [result] = await this.db
      .select({ count: count() })
      .from(usersToBoards)
      .where(eq(usersToBoards.boardId, boardId));

    return result.count;
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

  async bulkUpdate(
    boardId: number,
    collaborators: CollaboratorUpdateItem[],
  ): Promise<(UsersToBoards & { user: User })[]> {
    return await this.db.transaction(async (tx) => {
      // 1. Get current collaborators
      const currentCollaborators = await tx
        .select()
        .from(usersToBoards)
        .where(eq(usersToBoards.boardId, boardId));

      // 2. Create maps for efficient comparison
      const currentMap = new Map(
        currentCollaborators.map((c) => [c.userId, c.role]),
      );
      const newMap = new Map(collaborators.map((c) => [c.userId, c.role]));

      // 3. Determine operations needed
      const toInsert = collaborators.filter((c) => !currentMap.has(c.userId));
      const toUpdate = collaborators.filter(
        (c) => currentMap.has(c.userId) && currentMap.get(c.userId) !== c.role,
      );
      const toDelete = currentCollaborators.filter(
        (c) => !newMap.has(c.userId),
      );

      // 4. Perform only necessary operations

      // Delete removed collaborators
      if (toDelete.length > 0) {
        await tx.delete(usersToBoards).where(
          and(
            eq(usersToBoards.boardId, boardId),
            inArray(
              usersToBoards.userId,
              toDelete.map((c) => c.userId),
            ),
          ),
        );
      }

      // Insert new collaborators
      if (toInsert.length > 0) {
        await tx.insert(usersToBoards).values(
          toInsert.map((c) => ({
            boardId,
            userId: c.userId,
            role: c.role,
          })),
        );
      }

      // Update existing collaborators with role changes
      for (const collab of toUpdate) {
        await tx
          .update(usersToBoards)
          .set({ role: collab.role })
          .where(
            and(
              eq(usersToBoards.boardId, boardId),
              eq(usersToBoards.userId, collab.userId),
            ),
          );
      }

      // 5. Fetch and return the updated collaborators with user data
      const updatedCollaborators = await tx
        .select()
        .from(usersToBoards)
        .where(eq(usersToBoards.boardId, boardId));

      // Get user data for each collaborator
      const users = await Promise.all(
        updatedCollaborators.map((collab) =>
          this.usersService.get(collab.userId),
        ),
      );

      return updatedCollaborators.map((collaborator, index) => ({
        ...collaborator,
        user: users[index],
      }));
    });
  }
}
