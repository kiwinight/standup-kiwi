import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StandupFormStructuresService } from './standup-form-structures.service';

@Controller('boards/:boardId/standup-form-structures')
export class StandupFormStructuresController {
  constructor(
    private readonly standupFormStructuresService: StandupFormStructuresService,
  ) {}

  // GET /boards/:boardId/standup-form-structures/:standupFormStructureId
  @Get(':standupFormStructureId')
  async get(
    @Param('standupFormStructureId', ParseIntPipe)
    standupFormStructureId: number,
  ) {
    try {
      return await this.standupFormStructuresService.get(
        standupFormStructureId,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // GET /boards/:boardId/standup-form-structures
  @Get('')
  async list(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Query('ids') ids: string,
  ) {
    try {
      if (!ids) {
        return await this.standupFormStructuresService.list(boardId);
      }

      const standupFormStructureIds = ids
        .split(',')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

      return await this.standupFormStructuresService.list(
        boardId,
        standupFormStructureIds,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
