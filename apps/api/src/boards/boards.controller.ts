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
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from 'src/libs/db/schema';
import { AuthenticatedRequest, AuthGuard } from 'src/auth/guards/auth.guard';
import { BoardAccessGuard } from './guards/board-access.guard';

@Controller('boards')
@UseGuards(AuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

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
  async get(@Param('boardId', ParseIntPipe) boardId: number): Promise<Board> {
    try {
      return await this.boardsService.get(boardId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
  //   return this.boardsService.update(+id, updateBoardDto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.boardsService.remove(+id);
  // }
}
