import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jose from 'jose';

export interface AuthenticatedRequest extends Request {
  userId: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const jwks = jose.createRemoteJWKSet(
      new URL(process.env.AUTH_SERVICE_JWKS_URL!),
    );

    try {
      const { payload } = await jose.jwtVerify<{
        sub: string;
        iss: string;
        iat: number;
        aud: string;
        exp: number;
      }>(token, jwks);
      (request as AuthenticatedRequest).userId = payload.sub;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token]: [string, string] =
      request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
