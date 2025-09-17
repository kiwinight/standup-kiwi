import {
  Controller,
  Get,
  Post,
  Body,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StandupFormsService } from './standup-forms.service';
import { CreateStandupFormDto } from './dto/create-standup-form.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BoardAccessGuard } from '../guards/board-access.guard';

@Controller('boards/:boardId/standup-forms')
@UseGuards(AuthGuard, BoardAccessGuard)
export class StandupFormsController {
  constructor(private readonly standupFormsService: StandupFormsService) {}

  // POST /boards/:boardId/standup-forms
  @Post()
  async create(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createStandupFormDto: CreateStandupFormDto,
  ) {
    try {
      return await this.standupFormsService.createActive(
        boardId,
        createStandupFormDto.schema,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

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
