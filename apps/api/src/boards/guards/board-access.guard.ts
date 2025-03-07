import { Injectable, UnauthorizedException } from '@nestjs/common';

import { CanActivate, ExecutionContext } from '@nestjs/common';

import { BoardsService } from '../boards.service';

@Injectable()
export class BoardAccessGuard implements CanActivate {
  constructor(private readonly boardsService: BoardsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.userId;
    const boardId = request.params.boardId;

    const hasAccess = await this.boardsService.verifyUserAccess(
      parseInt(boardId, 10),
      userId,
    );

    if (!hasAccess) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
