import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Get,
  Query,
} from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('auth/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/send-code')
  async sendCode(@Body() body: { email: string }) {
    try {
      return await this.otpService.sendCode(body.email);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @Post('/check-if-user-exists')
  async checkIfUserExists(@Body() body: { email: string }) {
    try {
      return await this.otpService.checkIfUserExists(body.email);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  @Get('/sign-in-with-magic-link')
  async otpSignInWithMagicLink(@Query('code') code: string) {
    try {
      return await this.otpService.signIn(code);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to sign in');
    }
  }

  @Post('/sign-in-with-otp')
  async otpSignInWithOtp(@Body() body: { otp: string; nonce: string }) {
    try {
      return await this.otpService.signIn(body.otp + body.nonce);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to sign in');
    }
  }
}
