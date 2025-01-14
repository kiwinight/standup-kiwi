import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Get(':id')
  async get(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    const userId = request.userId;

    // TODO: I think this logic can be registered as a guard
    const hasAccess = await this.boardsService.verifyUserAccess(
      parseInt(id, 10),
      userId,
    );

    if (!hasAccess) {
      throw new UnauthorizedException(
        'You are not authorized to access this board',
      );
    }

    return this.boardsService.get(parseInt(id, 10));
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
