import { Module, forwardRef } from '@nestjs/common';
import { StandupsService } from './standups.service';
import { StandupsController } from './standups.controller';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';
import { BoardsModule } from '../boards.module';

@Module({
  imports: [DbModule, AuthModule, forwardRef(() => BoardsModule)],
  controllers: [StandupsController],
  providers: [StandupsService],
})
export class StandupsModule {}
