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

/**
 * Service for managing board invitations.
 *
 * DESIGN NOTE: Invitations in this system are designed to be REUSABLE.
 * - Each board can have one active invitation at a time
 * - Multiple users can use the same invitation token to join a board
 * - Invitations remain active until manually deactivated or expired
 * - This is intentional behavior to simplify invitation management
 */
@Injectable()
export class InvitationService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly db: Database,
  ) {}

  /**
   * Creates a new invitation for a board.
   * Note: Invitations are designed to be reusable until manually deactivated or expired.
   * Multiple users can use the same invitation token to join a board.
   */
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

  /**
   * Ensures an active invitation exists for a board.
   * Returns existing active invitation or creates a new one.
   * Design note: Invitations are reusable - one active invitation per board
   * that can be used by multiple users until manually deactivated or expired.
   */
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
    // Use transaction to ensure atomic deactivate-and-create operation
    return await this.db.transaction(async (tx) => {
      // Deactivate existing invitations
      await tx
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

      // Create new invitation atomically
      const token = generateSecureToken();
      const expiresAt = addDurationToNow(expiresIn);

      const [invitation] = await tx
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

  /**
   * Accepts an invitation and adds the user as a collaborator to the board.
   *
   * IMPORTANT: This method intentionally does NOT deactivate the invitation after use.
   * Invitations are designed to be reusable - multiple users can use the same
   * invitation token to join a board until it expires or is manually deactivated.
   * This is the intended behavior, not a security vulnerability.
   */
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
