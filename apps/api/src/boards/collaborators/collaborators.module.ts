import { Module, forwardRef } from '@nestjs/common';
import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsService } from './collaborators.service';
import { DbModule } from 'src/db/db.module';
import { UsersService } from 'src/auth/users/users.service';
import { BoardsModule } from '../boards.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DbModule, forwardRef(() => BoardsModule), AuthModule],
  controllers: [CollaboratorsController],
  providers: [CollaboratorsService, UsersService],
  exports: [CollaboratorsService],
})
export class CollaboratorsModule {}
