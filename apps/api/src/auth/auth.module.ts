import { Module } from '@nestjs/common';
import { OtpModule } from './otp/otp.module';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [],
  imports: [OtpModule, UsersModule],
})
export class AuthModule {}
