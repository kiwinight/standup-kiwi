import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { AuthModule } from '../auth.module';

@Module({
  imports: [AuthModule],
  providers: [],
  controllers: [TokenController],
})
export class TokenModule {}
