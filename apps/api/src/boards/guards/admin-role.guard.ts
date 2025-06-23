import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Database, DATABASE_TOKEN } from 'src/db/db.module';
import { usersToBoards } from 'src/libs/db/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(
    @Inject(DATABASE_TOKEN)
    private readonly db: Database,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const boardId = request.params?.boardId;

    if (!userId) {
      throw new ForbiddenException('User authentication required');
    }

    if (!boardId || isNaN(parseInt(boardId, 10))) {
      throw new ForbiddenException('Valid board ID required');
    }

    const parsedBoardId = parseInt(boardId, 10);

    const [userBoard] = await this.db
      .select({
        role: usersToBoards.role,
      })
      .from(usersToBoards)
      .where(
        and(
          eq(usersToBoards.boardId, parsedBoardId),
          eq(usersToBoards.userId, userId),
        ),
      );

    if (!userBoard) {
      throw new ForbiddenException('User is not a collaborator of this board');
    }

    if (userBoard.role !== 'admin') {
      throw new ForbiddenException('Admin role required');
    }

    return true;
  }
}
