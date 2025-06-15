import {
  useToasts,
  useToastsDispatch,
  TOASTS_ACTIONS,
} from "../context/ToastContext";
import type { ToastData } from "../context/ToastContext";

export function useToast() {
  const toasts = useToasts();
  const dispatch = useToastsDispatch();

  const toast = {
    success: (
      description: string,
      options?: Partial<Omit<ToastData, "id" | "description" | "type">>
    ) => {
      dispatch({
        type: TOASTS_ACTIONS.ADD_TOAST,
        payload: {
          description,
          type: "success",
          ...options,
        },
      });
    },

    error: (
      description: string,
      options?: Partial<Omit<ToastData, "id" | "description" | "type">>
    ) => {
      dispatch({
        type: TOASTS_ACTIONS.ADD_TOAST,
        payload: {
          description,
          type: "error",
          duration: 7000, // Error toasts stay longer by default
          ...options,
        },
      });
    },

    info: (
      description: string,
      options?: Partial<Omit<ToastData, "id" | "description" | "type">>
    ) => {
      dispatch({
        type: TOASTS_ACTIONS.ADD_TOAST,
        payload: {
          description,
          type: "info",
          ...options,
        },
      });
    },

    warning: (
      description: string,
      options?: Partial<Omit<ToastData, "id" | "description" | "type">>
    ) => {
      dispatch({
        type: TOASTS_ACTIONS.ADD_TOAST,
        payload: {
          description,
          type: "warning",
          ...options,
        },
      });
    },

    custom: (toast: Omit<ToastData, "id">) => {
      dispatch({
        type: TOASTS_ACTIONS.ADD_TOAST,
        payload: toast,
      });
    },

    dismiss: (id: string) => {
      dispatch({
        type: TOASTS_ACTIONS.REMOVE_TOAST,
        payload: { id },
      });
    },
  };

  return {
    toast,
    toasts,
  };
}
