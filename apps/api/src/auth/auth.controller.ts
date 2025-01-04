import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Get,
  Query,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/otp/send-code')
  async sendCode(@Body() body: { email: string }) {
    const url = 'https://api.stack-auth.com/api/v1/auth/otp/send-sign-in-code';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Stack-Project-Id': process.env.STACK_PROJECT_ID,
        'X-Stack-Access-Type': 'server',
        'X-Stack-Secret-Server-Key': process.env.STACK_SECRET_SERVER_KEY,
      },
      body: JSON.stringify({
        email: body.email,
        callback_url: 'http://localhost:4000/auth/otp/sign-in-with-link', // TODO: change url
      }),
    };

    try {
      const response = await fetch(url, options);
      const data: { nonce: string } = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to send code');
    }
  }

  @Get('/otp/sign-in-with-link')
  async otpSignInWithLink(@Query('code') code: string) {
    const url = 'https://api.stack-auth.com/api/v1/auth/otp/sign-in';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Stack-Project-Id': process.env.STACK_PROJECT_ID,
        'X-Stack-Access-Type': 'server',
        'X-Stack-Secret-Server-Key': process.env.STACK_SECRET_SERVER_KEY,
      },
      body: JSON.stringify({
        code,
      }),
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to sign in');
    }
  }

  @Post('/otp/sign-in-with-otp')
  async otpSignInWithOtp(@Body() body: { otp: string; nonce: string }) {
    const url = 'https://api.stack-auth.com/api/v1/auth/otp/sign-in';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Stack-Project-Id': process.env.STACK_PROJECT_ID,
        'X-Stack-Access-Type': 'server',
        'X-Stack-Secret-Server-Key': process.env.STACK_SECRET_SERVER_KEY,
      },
      body: JSON.stringify({
        code: body.otp + body.nonce, // NOTE: https://github.com/stack-auth/stack/blob/bca8202fee9ca690d482532bd15f4e6b62fde27b/packages/stack/src/components/magic-link-sign-in.tsx#L28
      }),
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to sign in');
    }
  }
}
