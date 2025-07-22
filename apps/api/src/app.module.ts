import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './auth/otp/otp.module';
import { UsersModule } from './auth/users/users.module';
import { TokenModule } from './auth/token/token.module';
import { SessionsModule } from './auth/sessions/sessions.module';
import { BoardsModule } from './boards/boards.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    AuthModule,
    OtpModule,
    UsersModule,
    TokenModule,
    SessionsModule,
    BoardsModule,
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
