import { useEffect, useSyncExternalStore } from "react";

const useFocusSubscribe = (callback: () => void) => {
  window.addEventListener("focus", callback);
  window.addEventListener("blur", callback);

  return () => {
    window.removeEventListener("focus", callback);
    window.removeEventListener("blur", callback);
  };
};

const getFocusSnapshot = () => {
  return document.hasFocus();
};

const getFocusServerSnapshot = () => {
  throw Error("useFocus is a client-only hook");
};

export function useFocus() {
  const hasFocus = useSyncExternalStore(
    useFocusSubscribe,
    getFocusSnapshot,
    getFocusServerSnapshot
  );

  return hasFocus;
}
