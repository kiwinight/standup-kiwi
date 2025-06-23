import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CanActivate, ExecutionContext } from '@nestjs/common';

import { BoardsService } from '../boards.service';

@Injectable()
export class BoardAccessGuard implements CanActivate {
  constructor(private readonly boardsService: BoardsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const boardId = request.params?.boardId;

    if (!userId) {
      throw new UnauthorizedException('User authentication required');
    }

    if (!boardId || isNaN(parseInt(boardId, 10))) {
      throw new UnauthorizedException('Valid board ID required');
    }

    const parsedBoardId = parseInt(boardId, 10);

    const hasAccess = await this.boardsService.verifyUserAccess(
      parsedBoardId,
      userId,
    );

    if (!hasAccess) {
      throw new UnauthorizedException('Access denied to this board');
    }

    return true;
  }
}
