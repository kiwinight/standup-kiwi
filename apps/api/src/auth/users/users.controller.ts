import {
  Controller,
  createParamDecorator,
  ExecutionContext,
  Get,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';

export const AuthorizationToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const authorization: string | undefined = request.headers['authorization'];

    if (!authorization) {
      return null;
    }

    const token = authorization.split('Bearer ')[1];

    if (!token) {
      return null;
    }

    return token;
  },
);

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  async getMe(@AuthorizationToken() token: string | null) {
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const data = await this.usersService.getCurrentUser(token);
      return data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to get user');
    }
  }
}
