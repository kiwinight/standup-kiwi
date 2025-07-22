import { useFetcher, useRouteLoaderData, useLoaderData } from "react-router";
import type { UpdateCurrentUserMetadataRequestBody } from "~/routes/update-current-user-metadata-route/update-current-user-metadata-route";
import type { loader } from "~/root";
import type { loader as boardLoader } from "~/routes/board-route/board-route";

export type GridWidth = "medium" | "wide" | "full";
export type CardSize = "small" | "medium" | "large";

interface BoardGridViewSettingsReturn {
  width: GridWidth;
  cardSize: CardSize;
  updateWidth: (width: GridWidth) => void;
  updateCardSize: (cardSize: CardSize) => void;
  isSharedBoard: boolean;
}

function getDefaultGridSettings(collaboratorsCount: number | null): {
  width: GridWidth;
  cardSize: CardSize;
} {
  const isSharedBoard = collaboratorsCount && collaboratorsCount > 1;
  return {
    width: "medium",
    cardSize: isSharedBoard ? "medium" : "medium",
  };
}

export function useBoardGridViewSettings(
  boardId: number
): BoardGridViewSettingsReturn {
  const rootData = useRouteLoaderData<typeof loader>("root");
  const { collaboratorsCount } = useLoaderData<typeof boardLoader>();
  const fetcher = useFetcher({ key: "update-current-user-metadata" });

  const isSharedBoard = Boolean(collaboratorsCount && collaboratorsCount > 1);
  const defaultSettings = getDefaultGridSettings(collaboratorsCount);

  // Start with server data
  let width: GridWidth =
    rootData?.currentUser?.client_read_only_metadata?.settings?.boards?.[
      boardId.toString()
    ]?.view?.grid?.width || defaultSettings.width;

  let cardSize: CardSize =
    rootData?.currentUser?.client_read_only_metadata?.settings?.boards?.[
      boardId.toString()
    ]?.view?.grid?.cardSize || defaultSettings.cardSize;

  // Apply optimistic updates if fetcher has pending data
  if (fetcher.json) {
    const metadata = (
      fetcher.json as unknown as UpdateCurrentUserMetadataRequestBody
    )?.metadata;

    const optimisticGrid =
      metadata?.settings?.boards?.[boardId.toString()]?.view?.grid;
    if (optimisticGrid?.width) {
      width = optimisticGrid.width as GridWidth;
    }
    if (optimisticGrid?.cardSize) {
      cardSize = optimisticGrid.cardSize as CardSize;
    }
  }

  const updateGridSettings = (
    newSettings: Partial<{ width: GridWidth; cardSize: CardSize }>
  ) => {
    // Only update for shared boards
    if (!isSharedBoard) return;

    fetcher.submit(
      {
        metadata: {
          settings: {
            boards: {
              [boardId.toString()]: {
                view: {
                  grid: {
                    width: newSettings.width ?? width,
                    cardSize: newSettings.cardSize ?? cardSize,
                  },
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

  const updateWidth = (newWidth: GridWidth) => {
    updateGridSettings({ width: newWidth });
  };

  const updateCardSize = (newCardSize: CardSize) => {
    updateGridSettings({ cardSize: newCardSize });
  };

  return {
    width,
    cardSize,
    updateWidth,
    updateCardSize,
    isSharedBoard,
  };
}
