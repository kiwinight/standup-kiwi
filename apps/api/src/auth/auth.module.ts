import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersController } from './users/users.controller';

@Module({
  controllers: [AuthController, UsersController],
  providers: [],
  imports: [],
})
export class AuthModule {}
