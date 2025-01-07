import { Injectable } from '@nestjs/common';
import { db } from '../libs/db';
import { boards, InsertBoard, usersToBoards, Board } from '../libs/db/schema';

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
    // TODO: change the schema to be an actual form structure
    const defaultStandupFormSchema = {
      jsonSchema: {},
      uiSchema: {},
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

  // get(id: number) {
  //   return `This action returns a #${id} board`;
  // }

  // update(id: number, updateBoardDto: UpdateBoardDto) {
  //   return `This action updates a #${id} board`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} board`;
  // }
}
