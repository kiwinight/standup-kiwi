import { Injectable } from '@nestjs/common';
import { db } from 'src/libs/db';
import { InsertStandup, Standup, standups } from 'src/libs/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

@Injectable()
export class StandupsService {
  create({
    boardId,
    userId,
    formData,
    formSchemaId,
  }: {
    boardId: InsertStandup['boardId'];
    userId: InsertStandup['userId'];
    formData: InsertStandup['formData'];
    formSchemaId: InsertStandup['formSchemaId'];
  }): Promise<Standup> {
    return db
      .insert(standups)
      .values({
        boardId,
        userId,
        formData,
        formSchemaId,
      })
      .returning()
      .then(([standup]) => standup);
  }

  list(boardId: number) {
    return db
      .select()
      .from(standups)
      .where(eq(standups.boardId, boardId))
      .orderBy(desc(standups.createdAt));
  }

  // get(id: number) {
  //   return `This action returns a #${id} standup`;
  // }

  update(
    id: number,
    {
      formData,
    }: {
      formData?: InsertStandup['formData'];
    },
  ) {
    return db
      .update(standups)
      .set({ formData, updatedAt: sql`NOW()` })
      .where(eq(standups.id, id))
      .returning()
      .then(([standup]) => standup);
  }

  // delete(id: number) {
  //   return `This action removes a #${id} standup`;
  // }
}
