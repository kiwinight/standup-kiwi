import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StandupFormSchemasService } from './standup-form-schemas.service';

@Controller('boards/:boardId/standup-form-schemas')
export class StandupFormSchemasController {
  constructor(
    private readonly standupFormSchemasService: StandupFormSchemasService,
  ) {}

  // GET /boards/:boardId/standup-form-schemas/:standupFormSchemaId
  @Get(':standupFormSchemaId')
  async get(
    @Param('standupFormSchemaId', ParseIntPipe) standupFormSchemaId: number,
  ) {
    try {
      return await this.standupFormSchemasService.get(standupFormSchemaId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // GET /boards/:boardId/standup-form-schemas
  @Get('')
  async list(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Query('ids') ids: string,
  ) {
    try {
      if (!ids) {
        return await this.standupFormSchemasService.list(boardId);
      }

      const standupFormSchemaIds = ids
        .split(',')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

      return await this.standupFormSchemasService.list(
        boardId,
        standupFormSchemaIds,
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
