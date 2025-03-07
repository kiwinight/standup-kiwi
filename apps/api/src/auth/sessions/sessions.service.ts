import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionsService {
  async refresh(
    sessionId: string,
  ): Promise<{ access_token: string } | { code: string; error: string }> {
    return await fetch(
      process.env.AUTH_SERVICE_API_URL + '/auth/sessions/current/refresh',
      {
        method: 'POST',
        headers: {
          'X-Stack-Access-Type': 'server',
          'X-Stack-Project-Id': process.env.AUTH_SERVICE_PROJECT_ID!,
          'X-Stack-Secret-Server-Key':
            process.env.AUTH_SERVICE_SECRET_SERVER_KEY!,
          'X-Stack-Refresh-Token': sessionId,
        },
      },
    ).then(
      (response) =>
        response.json() as Promise<
          | { access_token: string }
          | {
              code: string;
              error: string;
            }
        >,
    );
  }
}
