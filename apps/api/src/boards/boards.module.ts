import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { AuthModule } from '../auth/auth.module';
import { StandupsModule } from './standups/standups.module';
import { StandupFormStructuresModule } from './standup-form-structures/standup-form-structures.module';
import { DbModule } from '../db/db.module';

@Module({
  imports: [AuthModule, StandupsModule, StandupFormStructuresModule, DbModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
