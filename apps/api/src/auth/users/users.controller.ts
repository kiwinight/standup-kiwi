import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedRequest, AuthGuard } from '../guards/auth.guard';
import { Board } from '../../libs/db/schema';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() request: AuthenticatedRequest) {
    const userId = request.userId;
    return this.usersService.get(userId);
  }

  @UseGuards(AuthGuard)
  @Get('me/boards')
  getMyBoards(@Req() request: AuthenticatedRequest): Promise<Board[]> {
    const userId = request.userId;
    // TODO: handle error case
    return this.usersService.getBoardsOfUser(userId);
  }
}
