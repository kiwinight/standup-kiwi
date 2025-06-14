import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StandupFormsService } from './standup-forms.service';

@Controller('boards/:boardId/standup-forms')
export class StandupFormsController {
  constructor(private readonly standupFormsService: StandupFormsService) {}

  // GET /boards/:boardId/standup-forms/:standupFormId
  @Get(':standupFormId')
  async get(
    @Param('standupFormId', ParseIntPipe)
    standupFormId: number,
  ) {
    try {
      return await this.standupFormsService.get(standupFormId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // GET /boards/:boardId/standup-forms
  @Get('')
  async list(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Query('ids') ids: string,
  ) {
    try {
      if (!ids) {
        return await this.standupFormsService.list(boardId);
      }

      const standupFormIds = ids
        .split(',')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

      return await this.standupFormsService.list(boardId, standupFormIds);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
