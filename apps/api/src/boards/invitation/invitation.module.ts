import { Module, forwardRef } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import {
  InvitationController,
  PublicInvitationsController,
} from './invitation.controller';
import { DbModule } from 'src/db/db.module';
import { BoardsModule } from '../boards.module';

@Module({
  imports: [DbModule, forwardRef(() => BoardsModule)],
  controllers: [InvitationController, PublicInvitationsController],
  providers: [InvitationService],
  exports: [InvitationService],
})
export class InvitationModule {}
