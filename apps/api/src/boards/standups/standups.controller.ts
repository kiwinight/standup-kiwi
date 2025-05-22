import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  InternalServerErrorException,
  ParseIntPipe,
} from '@nestjs/common';
import { StandupsService } from './standups.service';
import { CreateStandupDto } from './dto/create-standup.dto';
import { AuthenticatedRequest } from 'src/auth/guards/auth.guard';
import { UpdateStandupDto } from './dto/update-standup.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BoardAccessGuard } from '../guards/board-access.guard';

@Controller('boards/:boardId/standups')
@UseGuards(AuthGuard, BoardAccessGuard)
export class StandupsController {
  constructor(private readonly standupsService: StandupsService) {}

  // POST /boards/:boardId/standups
  @Post()
  async create(
    @Req() request: AuthenticatedRequest,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createStandupDto: CreateStandupDto,
  ) {
    const userId = request.userId;

    try {
      return await this.standupsService.create({
        boardId,
        userId,
        formData: createStandupDto.formData,
        formStructureId: createStandupDto.formStructureId,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // GET /boards/:boardId/standups
  @Get()
  async list(@Param('boardId', ParseIntPipe) boardId: number) {
    try {
      return await this.standupsService.list(boardId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // PATCH /boards/:boardId/standups/:standupId
  @Patch(':standupId')
  async update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('standupId', ParseIntPipe) standupId: number,
    @Body() updateStandupDto: UpdateStandupDto,
  ) {
    try {
      const updatedStandup = await this.standupsService.update(
        standupId,
        boardId,
        {
          formData: updateStandupDto.formData,
        },
      );

      if (!updatedStandup) {
        throw new Error();
      }

      return updatedStandup;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  // @Delete(':id')
  // delete(
  //   @Param('boardId', ParseIntPipe) boardId: number,
  //   @Param('id', ParseIntPipe) id: number,
  // ) {
  //   return this.standupsService.delete(id);
  // }
}
