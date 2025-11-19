import { apiClient } from "./client";
import type { Standup } from "~/types";

export interface CreateStandupRequestBody {
  formData: Standup["formData"];
  formId: number;
}

export interface UpdateStandupRequestBody {
  formData: Standup["formData"];
}

export function listStandups(
  boardId: number,
  { accessToken }: { accessToken: string }
): Promise<Standup[]> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }

  return apiClient<Standup[]>(`/boards/${boardId}/standups`, {
    accessToken,
    method: "GET",
  });
}

export function createStandup(
  boardId: number,
  { formData, formId }: CreateStandupRequestBody,
  { accessToken }: { accessToken: string }
): Promise<Standup> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }
  if (!Number.isFinite(formId) || formId <= 0) {
    throw new Error(`Invalid formId: ${formId}`);
  }
  if (!formData || typeof formData !== "object") {
    throw new Error("Form data is required");
  }

  return apiClient<Standup>(`/boards/${boardId}/standups`, {
    accessToken,
    method: "POST",
    body: JSON.stringify({ formData, formId }),
  });
}

export function updateStandup(
  boardId: number,
  standupId: number,
  { formData }: UpdateStandupRequestBody,
  { accessToken }: { accessToken: string }
): Promise<Standup> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }
  if (!Number.isFinite(standupId) || standupId <= 0) {
    throw new Error(`Invalid standupId: ${standupId}`);
  }
  if (!formData || typeof formData !== "object") {
    throw new Error("Form data is required");
  }

  return apiClient<Standup>(`/boards/${boardId}/standups/${standupId}`, {
    accessToken,
    method: "PATCH",
    body: JSON.stringify({ formData }),
  });
}
