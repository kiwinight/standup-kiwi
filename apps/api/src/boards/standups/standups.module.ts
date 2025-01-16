import { Module } from '@nestjs/common';
import { StandupsService } from './standups.service';
import { StandupsController } from './standups.controller';
import { BoardsService } from '../boards.service';

@Module({
  imports: [],
  controllers: [StandupsController],
  providers: [StandupsService, BoardsService],
})
export class StandupsModule {}
