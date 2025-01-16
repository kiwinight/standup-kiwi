import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { AuthModule } from '../auth/auth.module';
import { StandupsModule } from './standups/standups.module';

@Module({
  imports: [AuthModule, StandupsModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
