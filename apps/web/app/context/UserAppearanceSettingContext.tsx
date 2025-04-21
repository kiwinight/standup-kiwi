import { createContext, useContext, useEffect, useState } from "react";

type ColorScheme = "light" | "dark";
export type Appearance = ColorScheme | "inherit";

interface UserAppearanceSettingContext {
  appearance: Appearance | null;
  setAppearance: (appearance: Appearance) => void;
}

const defaultValue: UserAppearanceSettingContext = {
  appearance: null,
  setAppearance: () => {},
};

function useLoadAppearanceSetting(
  setAppearance: (appearance: Appearance) => void
) {
  useEffect(() => {
    const userAppearanceSetting =
      localStorage.getItem("user-appearance-setting") || "inherit";

    if (userAppearanceSetting === "inherit") {
      setAppearance("inherit");
      return;
    }
    if (userAppearanceSetting === "light") {
      setAppearance("light");
      return;
    }

    if (userAppearanceSetting === "dark") {
      setAppearance("dark");
      return;
    }
  }, []);
}

const UserAppearanceSettingContext =
  createContext<UserAppearanceSettingContext>(defaultValue);

export const UserAppearanceSettingProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [appearance, setAppearance] = useState<typeof defaultValue.appearance>(
    defaultValue.appearance
  );

  useLoadAppearanceSetting(setAppearance);

  function handleAppearanceChange(value: Appearance) {
    setAppearance(value);
    localStorage.setItem("user-appearance-setting", value);
  }

  return (
    <UserAppearanceSettingContext.Provider
      value={{
        appearance,
        setAppearance: handleAppearanceChange,
      }}
    >
      {children}
    </UserAppearanceSettingContext.Provider>
  );
};

export function useUserAppearanceSetting() {
  const context = useContext(UserAppearanceSettingContext);

  if (!context) {
    throw new Error(
      "useUserAppearanceSetting must be used within AppearanceProvider"
    );
  }

  return context;
}
