import { Inject, Injectable } from '@nestjs/common';
import { standupFormSchemas } from 'src/libs/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { DATABASE_TOKEN } from 'src/db/db.module';
import { Database } from 'src/db/db.module';

@Injectable()
export class StandupFormSchemasService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly db: Database,
  ) {}

  // create(createStandupFormSchemaDto: CreateStandupFormSchemaDto) {
  //   return 'This action adds a new standupFormSchema';
  // }

  // findAll() {
  //   return `This action returns all standupFormSchemas`;
  // }

  get(id: number) {
    return this.db
      .select()
      .from(standupFormSchemas)
      .where(eq(standupFormSchemas.id, id))
      .then(([standupFormSchema]) => standupFormSchema);
  }

  list(boardId: number, ids?: number[]) {
    if (ids) {
      return this.db
        .select()
        .from(standupFormSchemas)
        .where(
          and(
            eq(standupFormSchemas.boardId, boardId),
            inArray(standupFormSchemas.id, ids),
          ),
        );
    }

    return this.db
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
