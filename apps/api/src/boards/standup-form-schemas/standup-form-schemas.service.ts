import { Injectable } from '@nestjs/common';
import { db } from 'src/libs/db';
import { standupFormSchemas } from 'src/libs/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

@Injectable()
export class StandupFormSchemasService {
  // create(createStandupFormSchemaDto: CreateStandupFormSchemaDto) {
  //   return 'This action adds a new standupFormSchema';
  // }

  // findAll() {
  //   return `This action returns all standupFormSchemas`;
  // }

  get(id: number) {
    return db
      .select()
      .from(standupFormSchemas)
      .where(eq(standupFormSchemas.id, id))
      .then(([standupFormSchema]) => standupFormSchema);
  }

  list(boardId: number, ids?: number[]) {
    if (ids) {
      return db
        .select()
        .from(standupFormSchemas)
        .where(
          and(
            eq(standupFormSchemas.boardId, boardId),
            inArray(standupFormSchemas.id, ids),
          ),
        );
    }

    return db
      .select()
      .from(standupFormSchemas)
      .where(eq(standupFormSchemas.boardId, boardId));
  }

  // update(id: number, updateStandupFormSchemaDto: UpdateStandupFormSchemaDto) {
  //   return `This action updates a #${id} standupFormSchema`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} standupFormSchema`;
  // }
}
