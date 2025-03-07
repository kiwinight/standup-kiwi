import { Controller, Param, Post, UnauthorizedException } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('auth/sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post(':sessionId/refresh')
  async refresh(@Param('sessionId') sessionId: string) {
    const response = await this.sessionsService.refresh(sessionId);
    if ('code' in response) {
      throw new UnauthorizedException(response.error);
    }
    return response;
  }
}
