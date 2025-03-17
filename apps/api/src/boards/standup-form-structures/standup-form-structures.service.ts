import { Inject, Injectable } from '@nestjs/common';
import { standupFormStructures } from 'src/libs/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { DATABASE_TOKEN } from 'src/db/db.module';
import { Database } from 'src/db/db.module';

@Injectable()
export class StandupFormStructuresService {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly db: Database,
  ) {}

  // create(createStandupFormStructureDto: CreateStandupFormStructureDto) {
  //   return 'This action adds a new standupFormStructure';
  // }

  // findAll() {
  //   return `This action returns all standupFormStructures`;
  // }

  get(id: number) {
    return this.db
      .select()
      .from(standupFormStructures)
      .where(eq(standupFormStructures.id, id))
      .then(([standupFormStructure]) => standupFormStructure);
  }

  list(boardId: number, ids?: number[]) {
    if (ids) {
      return this.db
        .select()
        .from(standupFormStructures)
        .where(
          and(
            eq(standupFormStructures.boardId, boardId),
            inArray(standupFormStructures.id, ids),
          ),
        );
    }

    return this.db
      .select()
      .from(standupFormStructures)
      .where(eq(standupFormStructures.boardId, boardId));
  }

  // update(id: number, updateStandupFormStructureDto: UpdateStandupFormStructureDto) {
  //   return `This action updates a #${id} standupFormStructure`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} standupFormStructure`;
  // }
}
