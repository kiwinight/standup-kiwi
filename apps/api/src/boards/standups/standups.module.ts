import { Module } from '@nestjs/common';
import { StandupsService } from './standups.service';
import { StandupsController } from './standups.controller';
import { BoardsService } from '../boards.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [StandupsController],
  providers: [StandupsService, BoardsService],
})
export class StandupsModule {}
