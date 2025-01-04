import {
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
} from '@nestjs/common';

@Controller('auth/users')
export class UsersController {
  @Get('/me')
  async getMe(@Headers('authorization') authorization: string) {
    const token = authorization.split('Bearer ')[1];

    try {
      const response = await fetch(
        'https://api.stack-auth.com/api/v1/users/me',
        {
          method: 'GET',
          headers: {
            'X-Stack-Access-Token': token,
            'x-stack-access-type': 'server',
            'X-Stack-Project-Id': process.env.STACK_PROJECT_ID,
            'X-Stack-Secret-Server-Key': process.env.STACK_SECRET_SERVER_KEY,
          },
        },
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to get user');
    }
  }
}
