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
import { eq, and, sql } from 'drizzle-orm';
import { generateSecureToken } from 'src/libs/token';
import { addDurationToNow } from 'src/libs/date';

@Injectable()
export class InvitationsService {
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
    expiresIn?: string;
  }): Promise<Invitation> {
    const token = generateSecureToken();
    const expiresAt = addDurationToNow(expiresIn || '7d');

    const [invitation] = await this.db
      .insert(invitations)
      .values({
        boardId,
        inviterUserId,
        token,
        role,
        status: 'pending',
        expiresAt,
      })
      .returning();

    if (!invitation) {
      throw new InternalServerErrorException('Failed to create invitation');
    }

    return invitation;
  }

  async createOrReplace({
    boardId,
    inviterUserId,
    role,
    expiresIn,
  }: {
    boardId: number;
    inviterUserId: string;
    role: 'admin' | 'collaborator';
    expiresIn?: string;
  }): Promise<Invitation> {
    await this.revokeActives(boardId);

    const invitation = await this.create({
      boardId,
      inviterUserId,
      role,
      expiresIn,
    });

    return invitation;
  }

  async get(id: number, boardId: number): Promise<Invitation> {
    const [invitation] = await this.db
      .select()
      .from(invitations)
      .where(and(eq(invitations.id, id), eq(invitations.boardId, boardId)));

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    return invitation;
  }

  async list(
    boardId: number,
    options?:
      | {
          activeOnly: true;
          includeExpired?: boolean;
        }
      | {
          activeOnly?: false;
          status?: 'pending' | 'used' | 'revoked';
          includeExpired?: boolean;
        },
  ): Promise<Invitation[]> {
    const conditions = [eq(invitations.boardId, boardId)];

    if (options?.activeOnly) {
      conditions.push(eq(invitations.status, 'pending'));
      if (!options.includeExpired) {
        conditions.push(sql`${invitations.expiresAt} > NOW()`);
      }
    } else {
      if (options?.status) {
        conditions.push(eq(invitations.status, options.status));
      }

      if (!options?.includeExpired) {
        conditions.push(sql`${invitations.expiresAt} > NOW()`);
      }
    }

    return this.db
      .select()
      .from(invitations)
      .where(and(...conditions));
  }

  async update(
    id: number,
    boardId: number,
    updates: {
      expiresAt?: Date;
      role?: 'admin' | 'collaborator';
      status?: 'pending' | 'used' | 'revoked';
    },
  ): Promise<Invitation | undefined> {
    const [updatedInvitation] = await this.db
      .update(invitations)
      .set({
        ...updates,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(invitations.id, id), eq(invitations.boardId, boardId)))
      .returning();

    return updatedInvitation;
  }

  async updateExpiration(
    id: number,
    boardId: number,
    expiresIn: string,
  ): Promise<Invitation | undefined> {
    const newExpiresAt = addDurationToNow(expiresIn);
    return await this.update(id, boardId, {
      expiresAt: newExpiresAt,
    });
  }

  async getByToken(token: string) {
    const [invitation] = await this.db
      .select({
        id: invitations.id,
        boardId: invitations.boardId,
        inviterUserId: invitations.inviterUserId,
        token: invitations.token,
        role: invitations.role,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
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

    // Check if user is already a collaborator
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

    // Add user to board
    await this.db.insert(usersToBoards).values({
      userId,
      boardId: invitation.boardId,
      role: invitation.role,
    });

    // Mark invitation as used (making it invalid for future use)
    await this.db
      .update(invitations)
      .set({
        status: 'used',
      })
      .where(eq(invitations.id, invitation.id));
  }

  async revokeActives(boardId: number): Promise<void> {
    await this.db
      .update(invitations)
      .set({
        status: 'revoked',
      })
      .where(
        and(
          eq(invitations.boardId, boardId),
          eq(invitations.status, 'pending'),
        ),
      );
  }
}
