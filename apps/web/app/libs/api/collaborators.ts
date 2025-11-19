import { apiClient } from './client';
import type { Collaborator } from '~/types';

export interface UpdateBoardCollaboratorsRequestBody {
  collaborators: Array<{
    userId: string;
    role: 'admin' | 'collaborator';
  }>;
}

export function listCollaborators(
  boardId: number,
  { accessToken }: { accessToken: string }
): Promise<Collaborator[]> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }

  return apiClient<Collaborator[]>(`/boards/${boardId}/collaborators`, {
    accessToken,
    method: 'GET',
  });
}

export function countCollaborators(
  boardId: number,
  { accessToken }: { accessToken: string }
): Promise<{ count: number }> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }

  return apiClient<{ count: number }>(
    `/boards/${boardId}/collaborators?view=count`,
    {
      accessToken,
      method: 'GET',
    }
  );
}

export function updateBoardCollaborators(
  boardId: number,
  body: UpdateBoardCollaboratorsRequestBody,
  { accessToken }: { accessToken: string }
): Promise<Collaborator[]> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }
  if (!body?.collaborators || !Array.isArray(body.collaborators)) {
    throw new Error("Collaborators array is required");
  }

  return apiClient<Collaborator[]>(`/boards/${boardId}/collaborators`, {
    accessToken,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function deleteBoardCollaborator(
  boardId: number,
  userId: string,
  { accessToken }: { accessToken: string }
): Promise<void> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }
  if (!userId || userId.trim().length === 0) {
    throw new Error("User ID is required");
  }

  return apiClient<void>(`/boards/${boardId}/collaborators/${userId}`, {
    accessToken,
    method: 'DELETE',
  });
}

