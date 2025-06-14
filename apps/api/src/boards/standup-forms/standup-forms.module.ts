import { Module } from '@nestjs/common';
import { StandupFormsService } from './standup-forms.service';
import { StandupFormsController } from './standup-forms.controller';
import { DbModule } from 'src/db/db.module';
@Module({
  controllers: [StandupFormsController],
  providers: [StandupFormsService],
  imports: [DbModule],
})
export class StandupFormsModule {}
