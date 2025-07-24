import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { AuthenticatedRequest } from './auth.guard';

/**
 * PermissiveAuthGuard allows both authenticated and anonymous access.
 * If a valid Authorization header is present, it will populate req.userId.
 * If not, the request continues without authentication.
 *
 * This is useful for endpoints that provide enhanced functionality for
 * authenticated users but should remain publicly accessible.
 */
@Injectable()
export class PermissiveAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.authService.extractBearerToken(
      request.headers.authorization,
    );

    const userId = await this.authService.verifyTokenOptional(token);

    if (userId) {
      (request as AuthenticatedRequest).userId = userId;
    }

    // Always allow the request to proceed
    return true;
  }
}
