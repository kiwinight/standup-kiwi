import {
  Controller,
  Get,
  Req,
  UseGuards,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Get('')
  listUsers(
    @Query('teamId') teamId?: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string,
    @Query('orderBy') orderBy?: string,
    @Query('desc') desc?: boolean,
    @Query('query') query?: string,
  ) {
    try {
      return this.usersService.list({
        teamId,
        limit,
        cursor,
        orderBy,
        desc,
        query,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
