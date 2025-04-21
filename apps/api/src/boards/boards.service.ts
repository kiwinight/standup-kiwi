import { Inject, Injectable } from '@nestjs/common';
import {
  boards,
  InsertBoard,
  usersToBoards,
  Board,
  standupFormStructures,
  StandupFormStructure,
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

    await this.createDefaultFormStructure(result.id);

    return result;
  }

  private async associateUser(boardId: number, userId: string): Promise<void> {
    await this.db.insert(usersToBoards).values({
      userId,
      boardId,
    });
  }

  private async createDefaultFormStructure(boardId: number): Promise<void> {
    const schema = {
      title: "Today's Standup",
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
      .insert(standupFormStructures)
      .values({
        boardId,
        schema,
      })
      .returning()
      .then(
        (standupFormStructures): StandupFormStructure =>
          standupFormStructures[0],
      );

    await this.db
      .update(boards)
      .set({
        activeStandupFormStructureId: result.id,
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

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const result = await this.db
      .update(boards)
      .set({ name: updateBoardDto.name, updatedAt: sql`NOW()` })
      .where(eq(boards.id, id))
      .returning();

    return result[0];
  }

  // remove(id: number) {
  //   return `This action removes a #${id} board`;
  // }
}
