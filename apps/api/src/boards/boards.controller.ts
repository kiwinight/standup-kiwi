import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  ParseIntPipe,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from 'src/libs/db/schema';
import { AuthenticatedRequest, AuthGuard } from 'src/auth/guards/auth.guard';
import { BoardAccessGuard } from './guards/board-access.guard';
import { UsersService } from 'src/auth/users/users.service';
import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly usersService: UsersService,
  ) {}

  // POST /boards
  @Post()
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    const userId = request.userId;

    try {
      return await this.boardsService.setup(
        {
          name: createBoardDto.name,
          timezone: createBoardDto.timezone,
        },
        userId,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // @Get()
  // list() {
  //   return this.boardsService.list();
  // }

  // GET /boards/:boardId
  @UseGuards(BoardAccessGuard)
  @Get(':boardId')
  async get(
    @Req() request: AuthenticatedRequest,
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<Board> {
    const userId = request.userId;
    try {
      // NOTE: This is to update the last accessed board in user metadata
      this.usersService.update(userId, {
        client_read_only_metadata: {
          lastAccessedBoardId: boardId,
        },
      });

      return await this.boardsService.get(boardId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(BoardAccessGuard)
  @Patch(':boardId')
  update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    try {
      return this.boardsService.update(boardId, updateBoardDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.boardsService.remove(+id);
  // }
}
