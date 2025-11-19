import { apiClient } from "./client";
import type { Board } from "~/types";

export interface CreateBoardRequestBody {
  name: string;
  timezone: string;
}

export interface UpdateBoardRequestBody {
  name: Board["name"];
  timezone: Board["timezone"];
}

export function getBoard(
  boardId: number,
  { accessToken }: { accessToken: string }
): Promise<Board> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }

  return apiClient<Board>(`/boards/${boardId}`, {
    accessToken,
    method: "GET",
  });
}

export function createBoard(
  { name, timezone }: CreateBoardRequestBody,
  { accessToken }: { accessToken: string }
): Promise<Board> {
  if (!name || name.trim().length === 0) {
    throw new Error("Board name is required");
  }
  if (!timezone || timezone.trim().length === 0) {
    throw new Error("Timezone is required");
  }

  return apiClient<Board>("/boards", {
    accessToken,
    method: "POST",
    body: JSON.stringify({ name, timezone }),
  });
}

export function updateBoard(
  boardId: number,
  { name, timezone }: UpdateBoardRequestBody,
  { accessToken }: { accessToken: string }
): Promise<Board> {
  if (!Number.isFinite(boardId) || boardId <= 0) {
    throw new Error(`Invalid boardId: ${boardId}`);
  }
  if (!name || name.trim().length === 0) {
    throw new Error("Board name is required");
  }
  if (!timezone || timezone.trim().length === 0) {
    throw new Error("Timezone is required");
  }

  return apiClient<Board>(`/boards/${boardId}`, {
    accessToken,
    method: "PATCH",
    body: JSON.stringify({ name, timezone }),
  });
}
