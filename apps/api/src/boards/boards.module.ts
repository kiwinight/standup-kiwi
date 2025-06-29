import { Module, forwardRef } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { AuthModule } from '../auth/auth.module';
import { StandupsModule } from './standups/standups.module';
import { StandupFormsModule } from './standup-forms/standup-forms.module';
import { InvitationModule } from './invitation/invitation.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { DbModule } from '../db/db.module';
import { UsersService } from 'src/auth/users/users.service';

@Module({
  imports: [
    AuthModule,
    StandupsModule,
    StandupFormsModule,
    forwardRef(() => InvitationModule),
    forwardRef(() => CollaboratorsModule),
    DbModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService, UsersService],
  exports: [BoardsService], // Export BoardsService for use in other modules
})
export class BoardsModule {}
