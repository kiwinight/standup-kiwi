import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from '../auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DbModule, AuthModule],
})
export class UsersModule {}
