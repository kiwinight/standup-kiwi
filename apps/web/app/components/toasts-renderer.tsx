import { Toast } from "radix-ui";
import {
  useToasts,
  useToastsDispatch,
  TOASTS_ACTIONS,
} from "../context/ToastContext";
import type { ToastData } from "../context/ToastContext";
import { useState } from "react";
import { Button, Card, Flex, Text } from "@radix-ui/themes";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

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
    <Card size="2" asChild>
      <Toast.Root
        open={open}
        onOpenChange={handleOpenChange}
        duration={toast.duration || 5000}
      >
        <Flex direction="column" gap="1">
          {toast.title && (
            <Flex asChild align="center" gap="2">
              <Toast.Title>
                {toast.type === "success" && <CheckCircledIcon />}
                {toast.type === "error" && <CrossCircledIcon />}
                {toast.type === "warning" && <ExclamationTriangleIcon />}
                {toast.type === "info" && <InfoCircledIcon />}
                <Text size="2" weight="medium">
                  {toast.title}
                </Text>
              </Toast.Title>
            </Flex>
          )}
          {toast.description && (
            <Toast.Description>
              <Text size="2">{toast.description}</Text>
            </Toast.Description>
          )}
          {toast.action && (
            <Flex justify="start" mt="1">
              <Button asChild highContrast variant="surface" size="2">
                <Toast.Action
                  altText={
                    toast.action.altText || `${toast.action.label} action`
                  }
                  onClick={toast.action.onClick}
                >
                  {toast.action.label}
                </Toast.Action>
              </Button>
            </Flex>
          )}
        </Flex>
      </Toast.Root>
    </Card>
  );
}
