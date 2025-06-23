import { Inject, Injectable } from '@nestjs/common';
import {
  boards,
  InsertBoard,
  usersToBoards,
  Board,
  standupForms,
  StandupForm,
} from '../libs/db/schema';
import { and, count, eq, sql } from 'drizzle-orm';
import { Database, DATABASE_TOKEN } from 'src/db/db.module';
import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly db: Database,
  ) {}

  create({
    name,
    timezone,
  }: {
    name: InsertBoard['name'];
    timezone: InsertBoard['timezone'];
  }) {
    return this.db
      .insert(boards)
      .values({
        name,
        timezone,
      })
      .returning()
      .then((boards): Board => {
        const [board] = boards;
        return board;
      });
  }

  async setup(
    {
      name,
      timezone,
    }: {
      name: InsertBoard['name'];
      timezone: InsertBoard['timezone'];
    },
    userId: string,
  ): Promise<Board> {
    const result = await this.create({
      name,
      timezone,
    });

    await this.associateUser(result.id, userId);

    await this.createDefaultForm(result.id);

    return result;
  }

  private async associateUser(boardId: number, userId: string): Promise<void> {
    const [existingCollaborators] = await this.db
      .select({ count: count() })
      .from(usersToBoards)
      .where(eq(usersToBoards.boardId, boardId));

    const doesCollaboratorExist = existingCollaborators.count > 0;
    const role = doesCollaboratorExist ? 'collaborator' : 'admin';

    await this.db.insert(usersToBoards).values({
      userId,
      boardId,
      role,
    });
  }

  private async createDefaultForm(boardId: number): Promise<void> {
    const schema = {
      // title: "Today's Standup",
      fields: [
        {
          name: 'yesterday',
          label: 'What did you do yesterday?',
          placeholder: 'Write your reply here...',
          type: 'textarea',
          required: true,
        },
        {
          name: 'today',
          label: 'What will you do today?',
          placeholder: 'Write your reply here...',
          type: 'textarea',
          required: true,
        },
        {
          name: 'blockers',
          label: 'Do you have any blockers?',
          placeholder: 'Write your reply here...',
          description:
            'Share any challenges or obstacles that might slow down your progress',
          type: 'textarea',
          required: false,
        },
      ],
    };

    const result = await this.db
      .insert(standupForms)
      .values({
        boardId,
        schema,
      })
      .returning()
      .then((standupForms): StandupForm => standupForms[0]);

    await this.db
      .update(boards)
      .set({
        activeStandupFormId: result.id,
      })
      .where(eq(boards.id, boardId));
  }

  // list() {
  //   return `This action returns all boards`;
  // }

  async get(id: number): Promise<Board> {
    const result = await this.db.select().from(boards).where(eq(boards.id, id));

    return result[0];
  }

  async verifyUserAccess(boardId: number, userId: string): Promise<boolean> {
    const [result] = await this.db
      .select({
        count: count(),
      })
      .from(usersToBoards)
      .where(
        and(
          eq(usersToBoards.boardId, boardId),
          eq(usersToBoards.userId, userId),
        ),
      );

    return result.count > 0;
  }

  async update(
    id: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board | undefined> {
    const updatedBoards = await this.db
      .update(boards)
      .set({
        name: updateBoardDto.name,
        timezone: updateBoardDto.timezone,
        updatedAt: sql`NOW()`,
      })
      .where(eq(boards.id, id))
      .returning();

    return updatedBoards.find((board) => board.id === id);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} board`;
  // }
}
