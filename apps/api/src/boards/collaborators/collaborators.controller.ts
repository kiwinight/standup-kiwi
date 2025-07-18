import {
  Controller,
  Get,
  Patch,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  Query,
} from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { BoardAccessGuard } from '../guards/board-access.guard';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { BulkUpdateCollaboratorsDto } from './dto/bulk-update-collaborators.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Collaborator } from './collaborators.types';
import { ErrorHandler } from 'src/libs/error-handler';

@Controller('boards/:boardId/collaborators')
@UseGuards(AuthGuard, BoardAccessGuard)
export class CollaboratorsController {
  private readonly logger = new Logger(CollaboratorsController.name);

  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  // GET /boards/:boardId/collaborators
  @Get()
  async list(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Query('view') view?: string,
  ): Promise<Collaborator[] | { count: number }> {
    try {
      if (view === 'count') {
        const count = await this.collaboratorsService.count(boardId);
        return { count };
      }

      return await this.collaboratorsService.list(boardId);
    } catch (error) {
      ErrorHandler.handle(
        error,
        this.logger,
        `Failed to fetch collaborators for boardId: ${boardId}`,
        'Failed to fetch collaborators',
      );
    }
  }

  // PATCH /boards/:boardId/collaborators/:userId
  @Patch(':userId')
  async update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('userId') userId: string,
    @Body() updateCollaboratorDto: UpdateCollaboratorDto,
  ): Promise<Collaborator> {
    try {
      return await this.collaboratorsService.update(
        boardId,
        userId,
        updateCollaboratorDto.role,
      );
    } catch (error) {
      ErrorHandler.handle(
        error,
        this.logger,
        `Failed to update collaborator for boardId: ${boardId}, userId: ${userId}`,
        'Failed to update collaborator',
      );
    }
  }

  // DELETE /boards/:boardId/collaborators/:userId
  @Delete(':userId')
  @HttpCode(204)
  async delete(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('userId') userId: string,
  ): Promise<void> {
    try {
      await this.collaboratorsService.delete(boardId, userId);
    } catch (error) {
      ErrorHandler.handle(
        error,
        this.logger,
        `Failed to delete collaborator for boardId: ${boardId}, userId: ${userId}`,
        'Failed to delete collaborator',
      );
    }
  }

  // PUT /boards/:boardId/collaborators
  @Put()
  @UseGuards(AdminRoleGuard)
  async bulkUpdate(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() bulkUpdateDto: BulkUpdateCollaboratorsDto,
  ): Promise<Collaborator[]> {
    try {
      return await this.collaboratorsService.bulkUpdate(
        boardId,
        bulkUpdateDto.collaborators,
      );
    } catch (error) {
      ErrorHandler.handle(
        error,
        this.logger,
        `Failed to bulk update collaborators for boardId: ${boardId}`,
        'Failed to update collaborators',
      );
    }
  }
}
