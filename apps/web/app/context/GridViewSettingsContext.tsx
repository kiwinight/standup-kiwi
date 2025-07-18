import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "grid-view-settings";

export type GridWidth = "medium" | "wide" | "full";
export type CardSize = "small" | "medium" | "large";

export interface GridViewSettings {
  width: GridWidth;
  cardSize: CardSize;
}

interface GridViewSettingsContext {
  viewSettings: GridViewSettings;
  updateViewSettings: (settings: Partial<GridViewSettings>) => void;
}

// Helper function to determine default settings for grid view
function getDefaultGridViewSettings(
  collaboratorCount?: number | null
): GridViewSettings {
  // Grid view is only for shared boards, so we can assume collaboratorCount > 1
  // Default to wide width and medium cards for optimal grid layout
  return {
    width: "wide",
    cardSize: "medium",
  };
}

const GridViewSettingsContext = createContext<GridViewSettingsContext | null>(
  null
);

export const GridViewSettingsProvider: React.FC<{
  children: React.ReactNode;
  boardId: number;
  collaboratorsCount: number | null;
}> = ({ children, boardId, collaboratorsCount }) => {
  const [viewSettings, setViewSettings] = useState<GridViewSettings>(
    getDefaultGridViewSettings(collaboratorsCount)
  );

  useEffect(() => {
    if (!collaboratorsCount) {
      return;
    }

    const isSharedBoard = collaboratorsCount && collaboratorsCount > 1;
    if (!isSharedBoard) {
      setViewSettings(getDefaultGridViewSettings(collaboratorsCount));
      return;
    }

    const savedSettingsJson = localStorage.getItem(STORAGE_KEY);

    if (!savedSettingsJson) {
      setViewSettings(getDefaultGridViewSettings(collaboratorsCount));
      return;
    }

    const allBoardSettings = JSON.parse(savedSettingsJson) as Record<
      string,
      GridViewSettings
    >;

    const boardSettings = allBoardSettings[boardId.toString()];

    if (!boardSettings) {
      setViewSettings(getDefaultGridViewSettings(collaboratorsCount));
      return;
    }

    // Migrate old invalid values
    const migratedSettings = {
      ...boardSettings,
      // Convert old "narrow" width to "medium"
      width:
        boardSettings.width === ("narrow" as any)
          ? "medium"
          : boardSettings.width,
      // Convert old "auto" cardSize to "medium"
      cardSize:
        boardSettings.cardSize === ("auto" as any)
          ? "medium"
          : boardSettings.cardSize,
    } as GridViewSettings;

    setViewSettings(migratedSettings);
  }, [boardId, collaboratorsCount]);

  function updateViewSettings(settings: Partial<GridViewSettings>) {
    setViewSettings((currentSettings) => {
      const newSettings = {
        ...currentSettings,
        ...settings,
      } as GridViewSettings;

      if (typeof window === "undefined") {
        return newSettings;
      }

      let allBoardSettings: Record<string, GridViewSettings> = {};

      try {
        const savedSettingsJson = localStorage.getItem(STORAGE_KEY);
        if (savedSettingsJson) {
          allBoardSettings = JSON.parse(savedSettingsJson);
        }
      } catch {
        allBoardSettings = {};
      }

      allBoardSettings[boardId.toString()] = newSettings;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(allBoardSettings));

      return newSettings;
    });
  }

  return (
    <GridViewSettingsContext.Provider
      value={{
        viewSettings,
        updateViewSettings,
      }}
    >
      {children}
    </GridViewSettingsContext.Provider>
  );
};

export function useGridViewSettings() {
  const context = useContext(GridViewSettingsContext);

  if (!context) {
    throw new Error("GridViewSettingsContext is not available");
  }

  return context;
}
