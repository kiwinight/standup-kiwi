import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from 'src/libs/db/schema';
import { AuthenticatedRequest, AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    const userId = request.userId;

    return this.boardsService.createWithUserAssociation(
      {
        name: createBoardDto.name,
      },
      userId,
    );
  }

  // @Get()
  // list() {
  //   return this.boardsService.list();
  // }

  // @Get(':id')
  // get(@Param('id') id: string) {
  //   return this.boardsService.get(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
  //   return this.boardsService.update(+id, updateBoardDto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.boardsService.remove(+id);
  // }
}
