import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "board-view-settings";

export type ViewType = "feed" | "grid";

export interface ViewSettings {
  viewType: ViewType;
}

interface ViewSettingsContext {
  viewSettings: ViewSettings;
  updateViewSettings: (settings: Partial<ViewSettings>) => void;
  isPersonalBoard: boolean;
  allowedViewTypes: ViewType[];
}

// Helper function to determine default settings based on board type
function getDefaultViewSettings(isPersonalBoard: boolean): ViewSettings {
  return {
    viewType: isPersonalBoard ? "feed" : "grid",
  };
}

// Helper function to get allowed view types based on board type
function getAllowedViewTypes(isPersonalBoard: boolean): ViewType[] {
  return isPersonalBoard ? ["feed"] : ["feed", "grid"];
}

const ViewSettingsContext = createContext<ViewSettingsContext | null>(null);

export const ViewSettingsProvider: React.FC<{
  children: React.ReactNode;
  boardId: number;
  collaboratorsCount: number | null;
}> = ({ children, boardId, collaboratorsCount }) => {
  const isPersonalBoard = !collaboratorsCount || collaboratorsCount <= 1;
  const allowedViewTypes = getAllowedViewTypes(isPersonalBoard);

  const [viewSettings, setViewSettings] = useState<ViewSettings>(
    getDefaultViewSettings(isPersonalBoard)
  );

  useEffect(() => {
    // For personal boards, always use feed view
    if (isPersonalBoard) {
      setViewSettings({ viewType: "feed" });
      return;
    }

    // For shared boards, try to load from localStorage
    const savedSettingsJson = localStorage.getItem(STORAGE_KEY);

    if (!savedSettingsJson) {
      setViewSettings(getDefaultViewSettings(isPersonalBoard));
      return;
    }

    try {
      const allBoardSettings = JSON.parse(savedSettingsJson) as Record<
        string,
        ViewSettings
      >;

      const boardSettings = allBoardSettings[boardId.toString()];

      if (!boardSettings) {
        setViewSettings(getDefaultViewSettings(isPersonalBoard));
        return;
      }

      // Validate that the saved view type is allowed for this board
      if (allowedViewTypes.includes(boardSettings.viewType)) {
        setViewSettings(boardSettings);
      } else {
        setViewSettings(getDefaultViewSettings(isPersonalBoard));
      }
    } catch {
      setViewSettings(getDefaultViewSettings(isPersonalBoard));
    }
  }, [boardId, isPersonalBoard]);

  function updateViewSettings(settings: Partial<ViewSettings>) {
    setViewSettings((currentSettings) => {
      const newSettings = {
        ...currentSettings,
        ...settings,
      } as ViewSettings;

      // Don't persist personal board settings (they're always feed)
      if (isPersonalBoard) {
        return { viewType: "feed" };
      }

      // Validate the new view type
      if (!allowedViewTypes.includes(newSettings.viewType)) {
        return currentSettings;
      }

      if (typeof window === "undefined") {
        return newSettings;
      }

      // Save to localStorage for shared boards
      let allBoardSettings: Record<string, ViewSettings> = {};

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
    <ViewSettingsContext.Provider
      value={{
        viewSettings,
        updateViewSettings,
        isPersonalBoard,
        allowedViewTypes,
      }}
    >
      {children}
    </ViewSettingsContext.Provider>
  );
};

export function useViewSettings() {
  const context = useContext(ViewSettingsContext);

  if (!context) {
    throw new Error("useViewSettings must be used within ViewSettingsProvider");
  }

  return context;
}
