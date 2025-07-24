import { UseGuards } from '@nestjs/common';
import { PermissiveAuthGuard } from '../guards/permissive-auth.guard';

/**
 * Decorator that applies PermissiveAuthGuard.
 * Allows both authenticated and anonymous access, but enhances
 * the request with user data when authentication is available.
 */
export const PermissiveAuth = () => UseGuards(PermissiveAuthGuard);
