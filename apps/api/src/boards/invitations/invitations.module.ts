import { Module, forwardRef } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import {
  InvitationsController,
  PublicInvitationsController,
} from './invitations.controller';
import { DbModule } from 'src/db/db.module';
import { BoardsModule } from '../boards.module';

@Module({
  imports: [DbModule, forwardRef(() => BoardsModule)],
  controllers: [InvitationsController, PublicInvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
