import { Module, forwardRef } from '@nestjs/common';
import { StandupFormsService } from './standup-forms.service';
import { StandupFormsController } from './standup-forms.controller';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';
import { BoardsModule } from '../boards.module';
@Module({
  controllers: [StandupFormsController],
  providers: [StandupFormsService],
  imports: [DbModule, AuthModule, forwardRef(() => BoardsModule)],
  exports: [StandupFormsService],
})
export class StandupFormsModule {}
