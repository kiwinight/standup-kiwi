import { Toast } from "radix-ui";
import {
  useToasts,
  useToastsDispatch,
  TOASTS_ACTIONS,
} from "../context/ToastContext";
import type { ToastData } from "../context/ToastContext";
import { useState } from "react";

/**
 * ToastsRenderer - Renders all toasts from the ToastsContext
 *
 * This component must be used within a ToastsProvider.
 * It handles the UI rendering of toasts while keeping the context provider clean.
 *
 * Usage:
 * ```tsx
 * <ToastsProvider>
 *   <YourApp />
 *   <ToastsRenderer />
 * </ToastsProvider>
 * ```
 */
export function ToastsRenderer() {
  const toasts = useToasts();
  const dispatch = useToastsDispatch();

  return (
    <Toast.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() =>
            dispatch({
              type: TOASTS_ACTIONS.REMOVE_TOAST,
              payload: { id: toast.id },
            })
          }
        />
      ))}
      <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-full m-0 list-none z-50 outline-none" />
    </Toast.Provider>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastData;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);

  function handleOpenChange(open: boolean) {
    setOpen(open);
    if (!open) {
      onRemove();
    }
  }

  const getBorderColor = (type: ToastData["type"]) => {
    switch (type) {
      case "success":
        return "border-l-green-500";
      case "error":
        return "border-l-red-500";
      case "warning":
        return "border-l-yellow-500";
      case "info":
        return "border-l-blue-500";
      default:
        return "border-l-blue-500";
    }
  };

  return (
    <Toast.Root
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border-l-4 ${getBorderColor(
        toast.type
      )} relative`}
      open={open}
      onOpenChange={handleOpenChange}
      duration={toast.duration || 5000}
      type={toast.type === "error" ? "foreground" : "background"}
    >
      {toast.title && (
        <Toast.Title className="font-medium text-gray-900 dark:text-white text-sm mb-1">
          {toast.title}
        </Toast.Title>
      )}
      <Toast.Description className="text-gray-600 dark:text-gray-300 text-sm">
        {toast.description}
      </Toast.Description>
      {toast.action && (
        <Toast.Action
          className="mt-3 px-3 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          altText={toast.action.altText || `${toast.action.label} action`}
          onClick={toast.action.onClick}
        >
          {toast.action.label}
        </Toast.Action>
      )}
      <Toast.Close
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        aria-label="Close"
      >
        ×
      </Toast.Close>
    </Toast.Root>
  );
}
