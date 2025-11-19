import { apiClient } from "./client";
import type { Invitation } from "~/types";

export interface RegenerateInvitationRequestBody {
  role: "admin" | "collaborator";
  expiresIn: string;
}

export function ensureInvitation(
  boardId: number,
  { accessToken }: { accessToken: string }
): Promise<Invitation> {
  return apiClient<Invitation>(`/boards/${boardId}/invitation`, {
    accessToken,
    method: "PUT",
  });
}

export function regenerateInvitation(
  boardId: number,
  { role, expiresIn }: RegenerateInvitationRequestBody,
  { accessToken }: { accessToken: string }
): Promise<Invitation> {
  return apiClient<Invitation>(`/boards/${boardId}/invitation/regenerate`, {
    accessToken,
    method: "POST",
    body: JSON.stringify({ role, expiresIn }),
  });
}

export function getInvitation(
  token: string,
  { accessToken }: { accessToken?: string }
): Promise<Invitation> {
  return apiClient<Invitation>(`/invitations/${token}`, {
    method: "GET",
    ...(accessToken ? { accessToken } : {}),
  });
}

export interface AcceptInvitationResponse {
  success: boolean;
  boardId: number;
  wasAlreadyCollaborator: boolean;
  role: "admin" | "collaborator";
}

export function acceptInvitation(
  token: string,
  { accessToken }: { accessToken: string }
): Promise<AcceptInvitationResponse> {
  return apiClient<AcceptInvitationResponse>(`/invitations/${token}/accept`, {
    accessToken,
    method: "POST",
  });
}
