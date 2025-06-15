import * as React from "react";
import { createRandomUUID } from "~/libs/id";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
    altText?: string;
  };
}

export const TOASTS_ACTIONS = {
  ADD_TOAST: "ADD_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ToastAction =
  | { type: typeof TOASTS_ACTIONS.ADD_TOAST; payload: Omit<ToastData, "id"> }
  | { type: typeof TOASTS_ACTIONS.REMOVE_TOAST; payload: { id: string } };

const ToastsContext = React.createContext<ToastData[] | null>(null);
const ToastsDispatchContext =
  React.createContext<React.Dispatch<ToastAction> | null>(null);

function toastsReducer(toasts: ToastData[], action: ToastAction): ToastData[] {
  switch (action.type) {
    case TOASTS_ACTIONS.ADD_TOAST: {
      const id = createRandomUUID();
      return [...toasts, { ...action.payload, id }];
    }
    case TOASTS_ACTIONS.REMOVE_TOAST: {
      return toasts.filter((toast) => toast.id !== action.payload.id);
    }
    default: {
      throw new Error("Unknown action: " + (action as any).type);
    }
  }
}

// Pure data provider - only handles state management
export function ToastsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = React.useReducer(toastsReducer, []);

  return (
    <ToastsContext.Provider value={toasts}>
      <ToastsDispatchContext.Provider value={dispatch}>
        {children}
      </ToastsDispatchContext.Provider>
    </ToastsContext.Provider>
  );
}

// Custom hooks to access the contexts
export function useToasts() {
  const context = React.useContext(ToastsContext);
  if (context === null) {
    throw new Error("useToasts must be used within a ToastsProvider");
  }
  return context;
}

export function useToastsDispatch() {
  const context = React.useContext(ToastsDispatchContext);
  if (context === null) {
    throw new Error("useToastsDispatch must be used within a ToastsProvider");
  }
  return context;
}
