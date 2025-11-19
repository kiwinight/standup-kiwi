import { apiClient } from './client';
import type { StandupForm, Standup } from '~/types';

export interface CreateStandupFormRequestBody {
  schema: StandupForm['schema'];
}

export function getStandupForm(
  { standupFormId, boardId }: { standupFormId: number; boardId: number },
  { accessToken }: { accessToken: string }
): Promise<StandupForm> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }
  if (!Number.isFinite(standupFormId) || standupFormId <= 0) {
    throw new Error(`Invalid standupFormId: ${standupFormId}`);
  }

  return apiClient<StandupForm>(
    `/boards/${boardId}/standup-forms/${standupFormId}`,
    {
      accessToken,
      method: 'GET',
    }
  );
}

export function listStandupForms(
  boardId: number,
  ids: number[],
  { accessToken }: { accessToken: string }
): Promise<StandupForm[]> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }
  if (!Array.isArray(ids)) {
    throw new Error("IDs must be an array");
  }

  return apiClient<StandupForm[]>(
    `/boards/${boardId}/standup-forms?ids=${ids.join(',')}`,
    {
      accessToken,
      method: 'GET',
    }
  );
}

/**
 * Fetches standup forms for a collection of standups.
 * Automatically extracts unique form IDs from the standups.
 *
 * @param boardId - The ID of the board
 * @param standups - Array of standups to get forms for
 * @param options - Options including access token
 * @returns Promise resolving to the unique standup forms
 */
export function listStandupFormsForStandups(
  boardId: number,
  standups: Standup[],
  { accessToken }: { accessToken: string }
): Promise<StandupForm[]> {
  if (!Array.isArray(standups)) {
    throw new Error("Standups must be an array");
  }

  const ids = [...new Set(standups.map((standup) => standup.formId))];
  return listStandupForms(boardId, ids, { accessToken });
}

export function createStandupForm(
  boardId: number,
  { schema }: CreateStandupFormRequestBody,
  { accessToken }: { accessToken: string }
): Promise<StandupForm> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }
  if (!schema || typeof schema !== 'object') {
    throw new Error("Schema is required");
  }

  return apiClient<StandupForm>(`/boards/${boardId}/standup-forms`, {
    accessToken,
    method: 'POST',
    body: JSON.stringify({ schema }),
  });
}

