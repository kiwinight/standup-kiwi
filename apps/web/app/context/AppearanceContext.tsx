import React, { createContext, useContext, useState, useEffect } from "react";

type Appearance = "inherit" | "light" | "dark";

interface AppearanceContextType {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
}

const AppearanceContext = createContext<AppearanceContextType | undefined>(
  undefined
);

export const AppearanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appearance, setAppearance] = useState<Appearance>(() => {
    if (typeof window !== "undefined") {
      // Get the appearance from local storage or default to 'system'
      return (localStorage.getItem("appearance") as Appearance) || "inherit";
    }
    return "inherit"; // Default to 'inherit' if localStorage is not available
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Save the appearance to local storage whenever it changes
      localStorage.setItem("appearance", appearance);
    }
  }, [appearance]);

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance }}>
      <div>{children}</div>
    </AppearanceContext.Provider>
  );
};

export const useAppearance = (): AppearanceContextType => {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return context;
};
