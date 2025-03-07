import { Module } from '@nestjs/common';
import { OtpModule } from './otp/otp.module';
import { UsersModule } from './users/users.module';
import { TokenModule } from './token/token.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  controllers: [],
  imports: [OtpModule, UsersModule, TokenModule, SessionsModule],
})
export class AuthModule {}
