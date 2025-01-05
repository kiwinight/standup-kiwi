import { Injectable } from '@nestjs/common';
import { User } from '../auth-service.types';

@Injectable()
export class UsersService {
  async getCurrentUser(accessToken: string): Promise<User> {
    const response = await fetch(
      process.env.AUTH_SERVICE_API_URL + '/users/me',
      {
        method: 'GET',
        headers: {
          'X-Stack-Access-Token': accessToken,
          'X-Stack-Access-Type': 'server',
          'X-Stack-Project-Id': process.env.AUTH_SERVICE_PROJECT_ID,
          'X-Stack-Secret-Server-Key':
            process.env.AUTH_SERVICE_SECRET_SERVER_KEY,
        },
      },
    );
    const data: User = await response.json();
    return data;
  }
}
