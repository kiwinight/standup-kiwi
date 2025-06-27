import { Link2Icon } from "@radix-ui/react-icons";
import {
  Button,
  Card,
  Dialog,
  DropdownMenu,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";

type Props = {};

function InviteCollaboratorsSetting({}: Props) {
  const invitation = {
    id: 1,
    boardId: 1,
    inviterUserId: "123",
    token: "123",
    role: "collaborator",
    status: "pending",
    expiresAt: "2025-06-27T10:00:00.000Z",
    createdAt: "2025-06-27T10:00:00.000Z",
    updatedAt: "2025-06-27T10:00:00.000Z",
  };

  // const invitation = undefined;

  return (
    <Card
      size={{
        initial: "3",
        sm: "4",
      }}
    >
      <Flex direction="column">
        <Flex justify="between" align="center">
          <Text size="4" weight="bold">
            Invite Collaborators
          </Text>
        </Flex>

        <Text size="3" weight="bold" mt="5">
          Invitation Link
        </Text>

        {invitation ? (
          <>
            <Text size="2" color="gray" mt="2">
              Share this link with people you want to invite to collaborate on
              your board.
            </Text>

            <Flex gap="3" mt="2">
              <TextField.Root
                className="flex-1"
                value={`https://app.standupkiwi.com/invitations/${invitation.token}`}
              >
                <TextField.Slot>
                  <Link2Icon />
                </TextField.Slot>
              </TextField.Root>
              <Button variant="soft" highContrast>
                Copy
              </Button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="soft" highContrast>
                    Actions
                    <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item>Refresh</DropdownMenu.Item>
                  <DropdownMenu.Item>Deactivate</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button variant="soft" highContrast>
                    Settings
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content
                  size={{
                    initial: "3",
                    sm: "4",
                  }}
                >
                  <Dialog.Title size="4">Invitation Link Settings</Dialog.Title>
                  <Dialog.Description size="2">
                    Edit the link settings for the invitation.
                  </Dialog.Description>

                  <Flex direction="column" gap="3" mt="5">
                    <Text size="2" weight="bold">
                      Expires in
                    </Text>

                    <Select.Root defaultValue="1">
                      <Select.Trigger />

                      <Select.Content>
                        <Select.Item value="1">1 day</Select.Item>
                        <Select.Item value="3">3 days</Select.Item>
                        <Select.Item value="7">7 days</Select.Item>
                        <Select.Item value="14">14 days</Select.Item>
                        <Select.Item value="30">30 days</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                  <Flex justify="end" mt="5" gap="3" align="center">
                    <Button variant="soft" highContrast>
                      Close
                    </Button>
                    <Button variant="soft" highContrast>
                      Save
                    </Button>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Flex>
            <Text size="1" color="gray" mt="2">
              Expires in 1 day
            </Text>
          </>
        ) : (
          <>
            <Text size="2" color="gray" mt="2">
              Create a shareable link to invite new collaborators to your board.
            </Text>
            <Flex gap="3" mt="2">
              <Button highContrast>Create Invitation Link</Button>
            </Flex>
          </>
        )}
      </Flex>
    </Card>
  );
}

export default InviteCollaboratorsSetting;
