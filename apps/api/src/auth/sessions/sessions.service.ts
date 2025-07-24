import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionsService {
  private isNetworkError(error: any): boolean {
    const networkErrorCodes = [
      'ENOTFOUND', // DNS lookup failed
      'ECONNREFUSED', // Connection refused
      'ETIMEDOUT', // Connection timeout
      'ECONNRESET', // Connection reset by peer
      'EHOSTUNREACH', // Host unreachable
      'ENETUNREACH', // Network unreachable
      'ECONNABORTED', // Connection aborted
      'EPIPE', // Broken pipe
      'EAI_AGAIN', // DNS lookup timeout
    ];

    const errorCode = error.code || error.cause?.code;
    return (
      networkErrorCodes.includes(errorCode) ||
      error.message?.includes('fetch failed') ||
      (error.name === 'TypeError' && error.message?.includes('Failed to fetch'))
    );
  }

  async refresh(
    sessionId: string,
  ): Promise<{ access_token: string } | { code: string; error: string }> {
    try {
      const response = await fetch(
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
      );

      return await response.json();
    } catch (error: any) {
      if (this.isNetworkError(error)) {
        // Return consistent error format for network issues
        return {
          code: 'NETWORK_ERROR',
          error:
            'Network connectivity issue - unable to reach authentication service',
        };
      }

      // For other errors, treat as auth failure
      return {
        code: 'UNKNOWN_ERROR',
        error: error.message || 'Failed to refresh token',
      };
    }
  }
}
