import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { AuthModule } from '../auth/auth.module';
import { StandupsModule } from './standups/standups.module';
import { StandupFormsModule } from './standup-forms/standup-forms.module';
import { DbModule } from '../db/db.module';
import { UsersService } from 'src/auth/users/users.service';
@Module({
  imports: [AuthModule, StandupsModule, StandupFormsModule, DbModule],
  controllers: [BoardsController],
  providers: [BoardsService, UsersService],
})
export class BoardsModule {}
