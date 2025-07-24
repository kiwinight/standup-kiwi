import {
  Controller,
  Post,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth/token')
export class TokenController {
  @UseGuards(AuthGuard)
  @Post('verify')
  async verifyToken() {
    try {
      return {
        valid: true,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
