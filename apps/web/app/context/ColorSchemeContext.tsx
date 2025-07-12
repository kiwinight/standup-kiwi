import { createContext, useContext, useEffect, useState } from "react";
import {
  useUserAppearanceSetting,
  type Appearance,
} from "./UserAppearanceSettingContext";

export type ColorScheme = "light" | "dark";

interface ColorSchemeContext {
  colorScheme: ColorScheme | null;
}

const defaultValue: ColorSchemeContext = {
  colorScheme: null,
};

const ColorSchemeContext = createContext<ColorSchemeContext>(defaultValue);

/**
 * This is used to cleanup the class attribute on the document root that is added to prevent flicker
 */
function useCleanupFlickerPrevention(colorScheme: ColorScheme | null) {
  useEffect(() => {
    // Ensure we're on the client side before accessing document
    if (typeof window === "undefined") return;
    
    if (colorScheme) {
      document.documentElement.removeAttribute("class");
    }
  }, [colorScheme]);
}

/**
 * This decides the correct color scheme based on the user's appearance setting
 */
function useDetermineColorScheme(
  appearance: Appearance | null,
  setColorScheme: (colorScheme: ColorScheme | null) => void
) {
  useEffect(() => {
    // Ensure we're on the client side before accessing window
    if (typeof window === "undefined") return;
    
    if (appearance === "inherit") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setColorScheme(prefersDark ? "dark" : "light");
      return;
    }

    setColorScheme(appearance);
  }, [appearance, setColorScheme]);
}

/**
 * This handles the system color scheme change
 */
function useHandleSystemColorSchemeChange(
  appearance: Appearance | null,
  setColorScheme: (colorScheme: ColorScheme | null) => void
) {
  useEffect(() => {
    // Ensure we're on the client side before accessing window
    if (typeof window === "undefined") return;
    
    if (appearance === "inherit") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      function handleSystemColorSchemeChange(event: MediaQueryListEvent) {
        setColorScheme(event.matches ? "dark" : "light");
      }

      mediaQuery.addEventListener("change", handleSystemColorSchemeChange);

      return () => {
        mediaQuery.removeEventListener("change", handleSystemColorSchemeChange);
      };
    }
  }, [appearance, setColorScheme]);
}

export const ColorSchemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { appearance } = useUserAppearanceSetting();

  const [colorScheme, setColorScheme] = useState<
    typeof defaultValue.colorScheme
  >(appearance === "inherit" ? null : appearance);

  useCleanupFlickerPrevention(colorScheme);
  useDetermineColorScheme(appearance, setColorScheme);
  useHandleSystemColorSchemeChange(appearance, setColorScheme);

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
};

export function useColorScheme() {
  const context = useContext(ColorSchemeContext);

  if (!context) {
    throw new Error("ColorSchemeContext is not available");
  }

  return context;
}

export const colorSchemeFlickerPrevention = `
(function () {
  try {
    var classList = document.documentElement.classList;

    classList.remove("dark");

    var userAppearanceSetting = localStorage.getItem("user-appearance-setting") || "inherit";

    if (userAppearanceSetting === "inherit") {
      var darkModeQuery = "(prefers-color-scheme: dark)",
        mediaQueryMatcher = window.matchMedia(darkModeQuery);

      if (mediaQueryMatcher.matches) {
        classList.add("dark");
        return;
      }
    }

    if (userAppearanceSetting === "dark") {
      classList.add("dark");
      return;
    }
  } catch (error) {
    console.error(error);
  }
})();
`;
