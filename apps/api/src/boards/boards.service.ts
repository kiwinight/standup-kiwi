import { Injectable } from '@nestjs/common';
import { db } from '../libs/db';
import { boards, InsertBoard, usersToBoards, Board } from '../libs/db/schema';
import { and, count, eq } from 'drizzle-orm';

@Injectable()
export class BoardsService {
  async create({
    name,
    formSchemas,
  }: {
    name: InsertBoard['name'];
    formSchemas: InsertBoard['formSchemas'];
  }): Promise<Board> {
    return await db
      .insert(boards)
      .values({
        name,
        formSchemas,
      })
      .returning()
      .then(([board]) => board);
  }

  async createWithUserAssociation(
    {
      name,
    }: {
      name: InsertBoard['name'];
    },
    userId: string,
  ): Promise<Board> {
    const defaultStandupFormSchema = {
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

    const result = await this.create({
      name,
      formSchemas: defaultStandupFormSchema,
    });

    await this.associateUser(result.id, userId);

    return result;
  }

  private async associateUser(boardId: number, userId: string): Promise<void> {
    await db.insert(usersToBoards).values({
      userId,
      boardId,
    });
  }

  // list() {
  //   return `This action returns all boards`;
  // }

  async get(id: number) {
    const [result] = await db.select().from(boards).where(eq(boards.id, id));
    return result;
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
