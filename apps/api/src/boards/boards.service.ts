import { Injectable } from '@nestjs/common';
import { db } from '../libs/db';
import {
  boards,
  InsertBoard,
  usersToBoards,
  Board,
  standupFormSchemas,
  StandupFormSchema,
} from '../libs/db/schema';
import { and, count, eq } from 'drizzle-orm';

@Injectable()
export class BoardsService {
  create({ name }: { name: InsertBoard['name'] }) {
    return db
      .insert(boards)
      .values({
        name,
        formSchemas: {} as InsertBoard['formSchemas'],
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
    }: {
      name: InsertBoard['name'];
    },
    userId: string,
  ): Promise<Board> {
    const result = await this.create({
      name,
    });

    await this.associateUser(result.id, userId);

    await this.createDefaultFormSchema(result.id);

    return result;
  }

  private async associateUser(boardId: number, userId: string): Promise<void> {
    await db.insert(usersToBoards).values({
      userId,
      boardId,
    });
  }

  private async createDefaultFormSchema(boardId: number): Promise<void> {
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

    const result = await db
      .insert(standupFormSchemas)
      .values({
        boardId,
        schema,
      })
      .returning()
      .then((standupFormSchemas): StandupFormSchema => standupFormSchemas[0]);

    await db
      .update(boards)
      .set({
        activeStandupFormSchemaId: result.id,
      })
      .where(eq(boards.id, boardId));
  }

  // list() {
  //   return `This action returns all boards`;
  // }

  async get(id: number): Promise<Board> {
    const result = await db.select().from(boards).where(eq(boards.id, id));

    return result[0];
  }

  async verifyUserAccess(boardId: number, userId: string): Promise<boolean> {
    const [result] = await db
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

  // update(id: number, updateBoardDto: UpdateBoardDto) {
  //   return `This action updates a #${id} board`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} board`;
  // }
}
