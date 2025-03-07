import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';

@Module({
  providers: [],
  controllers: [TokenController],
})
export class TokenModule {}
