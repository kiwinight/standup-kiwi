import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
  Get,
  NotFoundException,
  BadRequestException,
  Put,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard, AuthenticatedRequest } from '../../auth/guards/auth.guard';
import { BoardAccessGuard } from '../guards/board-access.guard';
import { AdminRoleGuard } from '../guards/admin-role.guard';
import { InvitationsService } from './invitations.service';
import {
  CreateInvitationDto,
  UpdateInvitationExpirationDto,
} from './dto/create-invitation.dto';

@Controller('boards/:boardId/invitations')
@UseGuards(AuthGuard, BoardAccessGuard, AdminRoleGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  // POST /boards/:boardId/invitations
  @Post()
  async createOrReplace(
    @Req() req: AuthenticatedRequest,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createInvitationDto: CreateInvitationDto,
  ) {
    try {
      const invitation = await this.invitationsService.createOrReplace({
        boardId,
        inviterUserId: req.userId,
        ...createInvitationDto,
      });

      return {
        id: invitation.id,
        token: invitation.token,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create or replace invitation',
      );
    }
  }

  // GET /boards/:boardId/invitations/:invitationId
  @Get(':invitationId')
  async get(
    @Param('invitationId', ParseIntPipe) invitationId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    try {
      const invitation = await this.invitationsService.get(
        invitationId,
        boardId,
      );
      return invitation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  // GET /boards/:boardId/invitations/active
  @Get('active')
  async getActive(@Param('boardId', ParseIntPipe) boardId: number) {
    try {
      const invitations = await this.invitationsService.list(boardId, {
        activeOnly: true,
        includeExpired: false,
      });

      if (invitations.length === 0) {
        return;
      }

      const invitation = invitations[0];

      return {
        id: invitation.id,
        token: invitation.token,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt,
        updatedAt: invitation.updatedAt,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  // DELETE /boards/:boardId/invitations/active
  @Delete('active')
  async revoke(@Param('boardId', ParseIntPipe) boardId: number) {
    try {
      await this.invitationsService.revokeActives(boardId);
      return { success: true };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  // PUT /boards/:boardId/invitations/:invitationId/expiration
  @Put(':invitationId/expiration')
  async updateExpiration(
    @Param('invitationId', ParseIntPipe) invitationId: number,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateExpirationDto: UpdateInvitationExpirationDto,
  ) {
    try {
      const updatedInvitation = await this.invitationsService.updateExpiration(
        invitationId,
        boardId,
        updateExpirationDto.expiresIn,
      );

      if (!updatedInvitation) {
        throw new NotFoundException('No active invitation found');
      }

      return {
        id: updatedInvitation.id,
        token: updatedInvitation.token,
        role: updatedInvitation.role,
        expiresAt: updatedInvitation.expiresAt,
        createdAt: updatedInvitation.createdAt,
        updatedAt: updatedInvitation.updatedAt,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}

// NOTE: Public endpoints for invitation handling
@Controller('invitations')
export class PublicInvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  // GET /invitations/:token
  @Get(':token')
  async get(@Param('token') token: string) {
    try {
      const invitation = await this.invitationsService.getByToken(token);
      return invitation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  // POST /invitations/:token/accept
  @Post(':token/accept')
  @UseGuards(AuthGuard)
  async accept(
    @Param('token') token: string,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      await this.invitationsService.accept(token, req.userId);

      const invitation = await this.invitationsService.getByToken(token);

      return {
        success: true,
        boardId: invitation.boardId,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException();
    }
  }
}
