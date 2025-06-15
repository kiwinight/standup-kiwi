import { Button, Flex, Card, Text, Heading, Code } from "@radix-ui/themes";
import { useToast } from "../hooks/use-toast";

export function ToastDemo() {
  const { toast } = useToast();

  function showSuccessToast() {
    toast.success("File saved successfully!");
  }

  function showErrorToast() {
    toast.error("Failed to save file. Please try again.");
  }

  function showWarningToast() {
    toast.warning("This action cannot be undone.");
  }

  function showInfoToast() {
    toast.info("New version available. Update now?");
  }

  function showToastWithTitle() {
    toast.success("Changes saved", {
      description: "Changes saved successfully",
    });
  }

  function showToastWithAction() {
    toast.custom({
      title: "Session expiring",
      description: "Your session will expire in 5 minutes",
      action: {
        label: "Extend",
        onClick: () => {
          toast.success("Session extended successfully!");
        },
        altText: "Extend session",
      },
    });
  }

  function showCustomToast() {
    toast.custom({
      title: "This is a custom toast with custom duration",
      duration: 3000,
      type: "info",
    });
  }

  return (
    <Card>
      <Heading size="4" mb="4">
        Toast Demo
      </Heading>
      <Text size="2" color="gray" mb="4">
        Click the buttons below to test different types of toast notifications.
      </Text>

      <Flex direction="column" gap="4">
        <Flex direction="column" gap="2">
          <Text size="3" weight="medium">
            Basic Toast Types
          </Text>
          <Flex gap="2" wrap="wrap">
            <Button onClick={showSuccessToast} color="green">
              Success Toast
            </Button>
            <Button onClick={showErrorToast} color="red">
              Error Toast
            </Button>
            <Button onClick={showWarningToast} color="orange">
              Warning Toast
            </Button>
            <Button onClick={showInfoToast} color="blue">
              Info Toast
            </Button>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="3" weight="medium">
            Advanced Toast Features
          </Text>
          <Flex gap="2" wrap="wrap">
            <Button onClick={showToastWithTitle} variant="outline">
              Toast with Title
            </Button>
            <Button onClick={showToastWithAction} variant="outline">
              Toast with Action
            </Button>
            <Button onClick={showCustomToast} variant="outline">
              Custom Toast
            </Button>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="3" weight="medium">
            Usage Example
          </Text>
          <Text size="2" color="gray" mb="2">
            Toast system is set up with separated concerns:
          </Text>
          <Code variant="soft" size="2">
            {`// In your root layout:
<ToastsProvider>
  <YourApp />
  <ToastsRenderer />
</ToastsProvider>

// In any component:
const { toast } = useToast();
toast.success("Hello world!");`}
          </Code>
        </Flex>
      </Flex>
    </Card>
  );
}
