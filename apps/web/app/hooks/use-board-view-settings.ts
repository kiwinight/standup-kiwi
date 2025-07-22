import { useFetcher, useRouteLoaderData, useLoaderData } from "react-router";
import type { UpdateCurrentUserMetadataRequestBody } from "~/routes/update-current-user-metadata-route/update-current-user-metadata-route";
import type { loader } from "~/root";
import type { loader as boardLoader } from "~/routes/board-route/board-route";
import type { ViewType } from "types";

interface BoardViewSettingsReturn {
  viewType: ViewType;
  updateViewType: (viewType: ViewType) => void;
  isPersonalBoard: boolean;
  allowedViewTypes: ViewType[];
}

function getDefaultViewType(isPersonalBoard: boolean): ViewType {
  return isPersonalBoard ? "feed" : "grid";
}

function getAllowedViewTypes(isPersonalBoard: boolean): ViewType[] {
  return isPersonalBoard ? ["feed"] : ["feed", "grid"];
}

export function useBoardViewSettings(boardId: number): BoardViewSettingsReturn {
  const rootData = useRouteLoaderData<typeof loader>("root");
  const { collaboratorsCount } = useLoaderData<typeof boardLoader>();
  const fetcher = useFetcher({ key: "update-current-user-metadata" });

  const isPersonalBoard = !collaboratorsCount || collaboratorsCount <= 1;
  const allowedViewTypes = getAllowedViewTypes(isPersonalBoard);

  // Start with server data
  let viewType: ViewType =
    rootData?.currentUser?.client_read_only_metadata?.settings?.boards?.[
      boardId.toString()
    ]?.view?.viewType || getDefaultViewType(isPersonalBoard);

  // Apply optimistic update if fetcher has pending data
  if (fetcher.json) {
    const metadata = (
      fetcher.json as unknown as UpdateCurrentUserMetadataRequestBody
    )?.metadata;

    const optimisticViewType =
      metadata?.settings?.boards?.[boardId.toString()]?.view?.viewType;
    if (optimisticViewType) {
      viewType = optimisticViewType;
    }
  }

  // Force feed view for personal boards
  if (isPersonalBoard) {
    viewType = "feed";
  }

  const updateViewType = (newViewType: ViewType) => {
    // Don't update personal boards
    if (isPersonalBoard) return;

    // Validate view type is allowed
    if (!allowedViewTypes.includes(newViewType)) return;

    fetcher.submit(
      {
        metadata: {
          settings: {
            boards: {
              [boardId.toString()]: {
                view: {
                  viewType: newViewType,
                },
              },
            },
          },
        },
      },
      {
        encType: "application/json",
        method: "POST",
        action: "/update-current-user-metadata",
      }
    );
  };

  return {
    viewType,
    updateViewType,
    isPersonalBoard,
    allowedViewTypes,
  };
}
