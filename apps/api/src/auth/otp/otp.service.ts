import { Injectable } from '@nestjs/common';
import { OtpSignInResponse } from '../auth-service.types';
import { UsersService } from '../users/users.service';

@Injectable()
export class OtpService {
  constructor(private readonly usersService: UsersService) {}

  async sendCode(email: string): Promise<{ nonce: string }> {
    const response = await fetch(
      process.env.AUTH_SERVICE_API_URL + '/auth/otp/send-sign-in-code',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Stack-Project-Id': process.env.AUTH_SERVICE_PROJECT_ID!,
          'X-Stack-Access-Type': 'server',
          'X-Stack-Secret-Server-Key':
            process.env.AUTH_SERVICE_SECRET_SERVER_KEY!,
        },
        body: JSON.stringify({
          email,
          callback_url:
            process.env.API_URL + '/auth/otp/sign-in-with-magic-link',
        }),
      },
    );
    const data:
      | { nonce: string }
      | {
          error: string;
          details: { message?: string };
          code: string;
        } = await response.json();

    if ('error' in data) {
      throw new Error(data.error);
    }

    return data;
  }

  async checkIfUserExists(email: string): Promise<boolean> {
    const users = await this.usersService.list({ query: email });

    return users.some((user) => user.primary_email === email);
  }

  async signIn(code: string): Promise<OtpSignInResponse> {
    const response = await fetch(
      process.env.AUTH_SERVICE_API_URL + '/auth/otp/sign-in',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Stack-Project-Id': process.env.AUTH_SERVICE_PROJECT_ID!,
          'X-Stack-Access-Type': 'server',
          'X-Stack-Secret-Server-Key':
            process.env.AUTH_SERVICE_SECRET_SERVER_KEY!,
        },
        body: JSON.stringify({
          code,
        }),
      },
    );
    const data:
      | OtpSignInResponse
      | {
          error: string;
          details: { message?: string };
          code: string;
        } = await response.json();

    if ('error' in data) {
      throw new Error(data.error);
    }

    return data;
  }
}
