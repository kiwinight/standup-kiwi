import { Toast } from "radix-ui";
import {
  useToasts,
  useToastsDispatch,
  TOASTS_ACTIONS,
} from "../context/ToastContext";
import type { ToastData } from "../context/ToastContext";
import { useEffect, useState } from "react";
import { Button, Card, Flex, Text } from "@radix-ui/themes";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import styles from "./toasts-renderer.module.css";

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
    <Toast.Provider swipeDirection="right" duration={3000}>
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
      <Toast.Viewport className={styles["toast-viewport"]} />
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

  useEffect(() => {
    if (!open) {
      const timeoutId = setTimeout(() => {
        onRemove();
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [open, onRemove]);

  function handleOpenChange(open: boolean) {
    setOpen(open);
  }

  return (
    <Toast.Root
      className={styles["toast-root"]}
      open={open}
      onOpenChange={handleOpenChange}
      duration={toast.duration}
    >
      <Card size="2">
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
      </Card>
    </Toast.Root>
  );
}
