import {
  Controller,
  Get,
  Req,
  UseGuards,
  Query,
  InternalServerErrorException,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticatedRequest, AuthGuard } from '../guards/auth.guard';
import { Board } from '../../libs/db/schema';
import { UpdateMyMetadataDto } from './dto/update-my-metadata.dto';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() request: AuthenticatedRequest) {
    try {
      const userId = request.userId;
      return await this.usersService.get(userId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Get('me/boards')
  async getMyBoards(@Req() request: AuthenticatedRequest): Promise<Board[]> {
    try {
      const userId = request.userId;
      return await this.usersService.getBoardsOfUser(userId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Patch('me/metadata')
  async updateMyMetadata(
    @Req() request: AuthenticatedRequest,
    @Body() metadata: UpdateMyMetadataDto,
  ) {
    const userId = request.userId;
    try {
      return await this.usersService.updateClientReadOnlyMetadata(
        userId,
        metadata,
      );
    } catch (error) {
      console.error('Error updating client metadata:', error);
      throw new InternalServerErrorException('Failed to update user metadata');
    }
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
