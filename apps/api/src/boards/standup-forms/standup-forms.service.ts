import { Inject, Injectable } from '@nestjs/common';
import { standupForms, boards } from 'src/libs/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { DATABASE_TOKEN } from 'src/db/db.module';
import { Database } from 'src/db/db.module';
import { DEFAULT_STANDUP_FORM_SCHEMA } from './constants';

@Injectable()
export class StandupFormsService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly db: Database,
  ) {}

  createActive(boardId: number, schema: object) {
    return this.db.transaction(async (tx) => {
      const [standupForm] = await tx
        .insert(standupForms)
        .values({ boardId, schema })
        .returning();

      await tx
        .update(boards)
        .set({ activeStandupFormId: standupForm.id })
        .where(eq(boards.id, boardId));

      return standupForm;
    });
  }

  createDefault(boardId: number) {
    return this.createActive(boardId, DEFAULT_STANDUP_FORM_SCHEMA);
  }

  // findAll() {
  //   return `This action returns all standupForms`;
  // }

  get(id: number) {
    return this.db
      .select()
      .from(standupForms)
      .where(eq(standupForms.id, id))
      .then(([standupForm]) => standupForm);
  }

  list(boardId: number, ids?: number[]) {
    if (ids) {
      return this.db
        .select()
        .from(standupForms)
        .where(
          and(eq(standupForms.boardId, boardId), inArray(standupForms.id, ids)),
        );
    }

    return this.db
      .select()
      .from(standupForms)
      .where(eq(standupForms.boardId, boardId));
  }

  // update(id: number, updateStandupFormDto: UpdateStandupFormDto) {
  //   return `This action updates a #${id} standupForm`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} standupForm`;
  // }
}
