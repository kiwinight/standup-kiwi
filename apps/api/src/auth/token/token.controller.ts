import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth/token')
export class TokenController {
  @UseGuards(AuthGuard)
  @Post('verify')
  async verifyToken() {
    return {
      valid: true,
    };
  }
}
