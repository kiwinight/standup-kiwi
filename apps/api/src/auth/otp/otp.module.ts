import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { UsersService } from '../users/users.service';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [OtpController],
  providers: [OtpService, UsersService],
  exports: [],
  imports: [DbModule],
})
export class OtpModule {}
