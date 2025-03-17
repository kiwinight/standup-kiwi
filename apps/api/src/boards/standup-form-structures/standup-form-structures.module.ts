import { Module } from '@nestjs/common';
import { StandupFormStructuresService } from './standup-form-structures.service';
import { StandupFormStructuresController } from './standup-form-structures.controller';
import { DbModule } from 'src/db/db.module';
@Module({
  controllers: [StandupFormStructuresController],
  providers: [StandupFormStructuresService],
  imports: [DbModule],
})
export class StandupFormStructuresModule {}
