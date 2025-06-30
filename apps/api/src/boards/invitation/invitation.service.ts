import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Database, DATABASE_TOKEN } from 'src/db/db.module';
import {
  invitations,
  boards,
  usersToBoards,
  Invitation,
} from 'src/libs/db/schema';
import { eq, and, sql, desc, isNull } from 'drizzle-orm';
import { generateSecureToken } from 'src/libs/token';
import { addDurationToNow } from 'src/libs/date';

@Injectable()
export class InvitationService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly db: Database,
  ) {}

  async create({
    boardId,
    inviterUserId,
    role,
    expiresIn,
  }: {
    boardId: number;
    inviterUserId: string;
    role: 'admin' | 'collaborator';
    expiresIn: string;
  }): Promise<Invitation> {
    const token = generateSecureToken();
    const expiresAt = addDurationToNow(expiresIn);

    const [invitation] = await this.db
      .insert(invitations)
      .values({
        boardId,
        inviterUserId,
        token,
        role,
        expiresAt,
      })
      .returning();

    if (!invitation) {
      throw new InternalServerErrorException('Failed to create invitation');
    }

    return invitation;
  }

  async ensure({
    boardId,
    inviterUserId,
  }: {
    boardId: number;
    inviterUserId: string;
  }): Promise<Invitation> {
    // Use transaction for atomic check-and-create operation
    return await this.db.transaction(async (tx) => {
      // Check if invitation exists within transaction
      const [existing] = await tx
        .select()
        .from(invitations)
        .where(
          and(
            eq(invitations.boardId, boardId),
            isNull(invitations.deactivatedAt),
            sql`${invitations.expiresAt} > NOW()`,
          ),
        )
        .orderBy(desc(invitations.createdAt));

      if (existing) {
        return existing;
      }

      // Create new invitation atomically
      const token = generateSecureToken();
      const expiresAt = addDurationToNow('7d');

      const [invitation] = await tx
        .insert(invitations)
        .values({
          boardId,
          inviterUserId,
          token,
          role: 'collaborator',
          expiresAt,
        })
        .returning();

      if (!invitation) {
        throw new InternalServerErrorException('Failed to create invitation');
      }

      return invitation;
    });
  }

  async regenerate({
    boardId,
    inviterUserId,
    role,
    expiresIn,
  }: {
    boardId: number;
    inviterUserId: string;
    role: 'admin' | 'collaborator';
    expiresIn: string;
  }): Promise<Invitation> {
    // TODO: Consider wrapping deactivate + create in a database transaction
    // to ensure atomicity (both operations succeed or both fail)
    try {
      await this.deactivate(boardId);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    return await this.create({
      boardId,
      inviterUserId,
      role,
      expiresIn,
    });
  }

  async get(boardId: number): Promise<Invitation | null> {
    const [invitation] = await this.db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.boardId, boardId),
          isNull(invitations.deactivatedAt),
          sql`${invitations.expiresAt} > NOW()`,
        ),
      )
      .orderBy(desc(invitations.createdAt));

    return invitation || null;
  }

  async deactivate(boardId: number): Promise<void> {
    await this.db
      .update(invitations)
      .set({
        deactivatedAt: sql`NOW()`,
        updatedAt: sql`NOW()`,
      })
      .where(
        and(
          eq(invitations.boardId, boardId),
          isNull(invitations.deactivatedAt),
          sql`${invitations.expiresAt} > NOW()`,
        ),
      );
  }

  async getByToken(token: string) {
    const [invitation] = await this.db
      .select({
        id: invitations.id,
        boardId: invitations.boardId,
        inviterUserId: invitations.inviterUserId,
        token: invitations.token,
        role: invitations.role,
        expiresAt: invitations.expiresAt,
        deactivatedAt: invitations.deactivatedAt,
        createdAt: invitations.createdAt,
        board: {
          name: boards.name,
        },
      })
      .from(invitations)
      .innerJoin(boards, eq(invitations.boardId, boards.id))
      .where(eq(invitations.token, token));

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    return invitation;
  }

  async accept(token: string, userId: string): Promise<void> {
    const invitation = await this.getByToken(token);

    // Validate invitation state
    if (invitation.deactivatedAt) {
      throw new BadRequestException('This invitation has been deactivated');
    }

    if (new Date(invitation.expiresAt) <= new Date()) {
      throw new BadRequestException('This invitation has expired');
    }

    const [existingCollaborator] = await this.db
      .select()
      .from(usersToBoards)
      .where(
        and(
          eq(usersToBoards.boardId, invitation.boardId),
          eq(usersToBoards.userId, userId),
        ),
      );

    if (existingCollaborator) {
      throw new BadRequestException(
        'User is already a collaborator of this board',
      );
    }

    await this.db.insert(usersToBoards).values({
      userId,
      boardId: invitation.boardId,
      role: invitation.role,
    });
  }
}
