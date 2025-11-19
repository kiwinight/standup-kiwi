import { apiClient } from './client';
import type { Board, User, ClientReadOnlyMetadata } from '~/types';

export function getCurrentUser({
  accessToken,
}: {
  accessToken: string;
}): Promise<User> {
  return apiClient<User>('/auth/users/me', {
    accessToken,
    method: 'GET',
  });
}

export function listCurrentUserBoards({
  accessToken,
}: {
  accessToken: string;
}): Promise<(Board & { collaboratorsCount: number })[]> {
  return apiClient<(Board & { collaboratorsCount: number })[]>(
    '/auth/users/me/boards',
    {
      accessToken,
      method: 'GET',
    }
  );
}

export interface UpdateCurrentUserMetadataRequestBody {
  metadata: ClientReadOnlyMetadata;
}

export function updateCurrentUserMetadata(
  { metadata }: UpdateCurrentUserMetadataRequestBody,
  { accessToken }: { accessToken: string }
): Promise<User> {
  return apiClient<User>('/auth/users/me/metadata', {
    accessToken,
    method: 'PATCH',
    body: JSON.stringify(metadata),
  });
}

