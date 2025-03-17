import { Inject, Injectable } from '@nestjs/common';
import { InsertStandup, Standup, standups } from 'src/libs/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { Database, DATABASE_TOKEN } from 'src/db/db.module';

@Injectable()
export class StandupsService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly db: Database,
  ) {}

  create({
    boardId,
    userId,
    formData,
    formStructureId,
  }: {
    boardId: InsertStandup['boardId'];
    userId: InsertStandup['userId'];
    formData: InsertStandup['formData'];
    formStructureId: InsertStandup['formStructureId'];
  }): Promise<Standup> {
    return this.db
      .insert(standups)
      .values({
        boardId,
        userId,
        formData,
        formStructureId,
      })
      .returning()
      .then(([standup]) => standup);
  }

  list(boardId: number) {
    return this.db
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
    return this.db
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
