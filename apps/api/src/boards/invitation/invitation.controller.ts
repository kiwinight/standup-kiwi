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
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard, AuthenticatedRequest } from '../../auth/guards/auth.guard';
import { PermissiveAuth } from '../../auth/decorators/permissive-auth.decorator';
import { BoardAccessGuard } from '../guards/board-access.guard';
import { InvitationService } from './invitation.service';
import { RegenerateInvitationDto } from './dto/regenerate-invitation.dto';

// Singleton invitation resource controller
@Controller('boards/:boardId/invitation')
@UseGuards(AuthGuard, BoardAccessGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  // PUT /boards/:boardId/invitation - Ensure invitation exists
  @Put()
  async ensure(
    @Req() req: AuthenticatedRequest,
    @Param('boardId', ParseIntPipe) boardId: number,
  ) {
    try {
      const invitation = await this.invitationService.ensure({
        boardId,
        inviterUserId: req.userId,
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
      throw new InternalServerErrorException('Failed to ensure invitation');
    }
  }

  // POST /boards/:boardId/invitation/regenerate - Generate new invitation (deactivate existing)
  @Post('regenerate')
  async regenerate(
    @Req() req: AuthenticatedRequest,
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() regenerateInvitationDto: RegenerateInvitationDto,
  ) {
    try {
      const invitation = await this.invitationService.regenerate({
        boardId,
        inviterUserId: req.userId,
        ...regenerateInvitationDto,
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
      throw new InternalServerErrorException('Failed to regenerate invitation');
    }
  }
}

// NOTE: Public endpoints for invitation handling
@Controller('invitations')
export class PublicInvitationsController {
  constructor(private readonly invitationService: InvitationService) {}

  // GET /invitations/:token
  @Get(':token')
  @PermissiveAuth()
  async get(@Param('token') token: string, @Req() req: AuthenticatedRequest) {
    try {
      const invitation = await this.invitationService.getByToken(
        token,
        req.userId,
      );
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
      const result = await this.invitationService.accept(token, req.userId);

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException();
    }
  }
}
