import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { PermissiveAuthGuard } from './guards/permissive-auth.guard';

@Module({
  controllers: [],
  imports: [],
  providers: [AuthService, AuthGuard, PermissiveAuthGuard],
  exports: [AuthService, AuthGuard, PermissiveAuthGuard],
})
export class AuthModule {}
