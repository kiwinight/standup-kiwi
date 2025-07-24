import {
  Controller,
  Param,
  Post,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('auth/sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post(':sessionId/refresh')
  async refresh(@Param('sessionId') sessionId: string) {
    const response = await this.sessionsService.refresh(sessionId);

    if ('code' in response) {
      // Check if it's a network error vs auth failure
      if (response.code === 'NETWORK_ERROR') {
        // Return 503 Service Unavailable for network issues
        throw new ServiceUnavailableException(response.error);
      }

      // Return 401 Unauthorized for other auth failures
      throw new UnauthorizedException(response.error);
    }

    return response;
  }
}
