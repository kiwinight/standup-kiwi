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
      title: string,
      options?: Partial<Omit<ToastData, "id" | "title" | "type">>
    ) => {
      dispatch({
        type: TOASTS_ACTIONS.ADD_TOAST,
        payload: {
          title,
          type: "success",
          ...options,
        },
      });
    },

    error: (
      title: string,
      options?: Partial<Omit<ToastData, "id" | "title" | "type">>
    ) => {
      dispatch({
        type: TOASTS_ACTIONS.ADD_TOAST,
        payload: {
          title,
          type: "error",
          ...options,
        },
      });
    },

    info: (
      title: string,
      options?: Partial<Omit<ToastData, "id" | "title" | "type">>
    ) => {
      dispatch({
        type: TOASTS_ACTIONS.ADD_TOAST,
        payload: {
          title,
          type: "info",
          ...options,
        },
      });
    },

    warning: (
      title: string,
      options?: Partial<Omit<ToastData, "id" | "title" | "type">>
    ) => {
      dispatch({
        type: TOASTS_ACTIONS.ADD_TOAST,
        payload: {
          title,
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
