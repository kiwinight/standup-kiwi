import {
  Table,
  Text,
  Button,
  Card,
  Flex,
  Skeleton,
  Box,
  DropdownMenu,
  AlertDialog,
} from "@radix-ui/themes";
import { Await, useLoaderData } from "react-router";
import type { loader } from "./board-settings-sharing-route";
import { Suspense, useMemo, useState, useCallback, useRef } from "react";
import type { Collaborator } from "types";
import { useAwait } from "~/hooks/use-await";

type Props = {};

function CollaboratorsSetting({}: Props) {
  const { collaboratorsPromise } = useLoaderData<typeof loader>();

  const collaboratorsRef = useRef<Collaborator[]>([]);
  const [draftCollaborators, setDraftCollaborators] = useState<Collaborator[]>(
    []
  );

  useAwait(collaboratorsPromise, (data: Collaborator[]) => {
    if (collaboratorsRef.current.length === 0) {
      collaboratorsRef.current = data;
      setDraftCollaborators(data);
    }
  });

  const hasChanged = useMemo(() => {
    const hasRemovals =
      draftCollaborators.length !== collaboratorsRef.current.length;

    const hasRoleChanges = draftCollaborators.some(
      (c) =>
        c.role !==
        collaboratorsRef.current.find((collab) => collab.userId === c.userId)
          ?.role
    );

    return hasRemovals || hasRoleChanges;
  }, [draftCollaborators]);

  const changeRole = useCallback(
    (collaborator: Collaborator, newRole: "admin" | "collaborator") => {
      setDraftCollaborators((prev) => {
        if (!prev.find((c) => c.userId === collaborator.userId)) {
          const originalIndex = collaboratorsRef.current.findIndex(
            (c) => c.userId === collaborator.userId
          );

          // Insert at original position
          const newArray = [...prev];
          newArray.splice(originalIndex, 0, {
            ...collaborator,
            role: newRole,
          });
          return newArray;
        }

        return prev.map((c) => {
          if (c.userId === collaborator.userId) {
            return { ...c, role: newRole };
          }
          return c;
        });
      });
    },
    [setDraftCollaborators]
  );

  const removeCollaborator = useCallback(
    (collaborator: Collaborator) => {
      setDraftCollaborators((prev) =>
        prev.filter((c) => c.userId !== collaborator.userId)
      );
    },
    [setDraftCollaborators]
  );

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
            Collaborators
          </Text>
        </Flex>

        <Table.Root mt="5">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell width="auto">Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="auto">
                Email
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="110px">
                Role
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell width="auto"></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Suspense fallback={<SuspenseFallback />}>
              <Await resolve={collaboratorsPromise}>
                {(loadedCollaborators) => {
                  if (!loadedCollaborators) {
                    return <SuspenseFallback />;
                  }

                  return loadedCollaborators.map((collaborator) => {
                    const hasRemoved = !draftCollaborators.find(
                      (c) => c.userId === collaborator.userId
                    );

                    const draftCollaborator = draftCollaborators.find(
                      (c) => c.userId === collaborator.userId
                    );

                    const role = draftCollaborator?.role || collaborator.role;

                    const isOnlyActiveAdmin =
                      role === "admin" &&
                      draftCollaborators.filter((c) => c.role === "admin")
                        .length === 1;

                    return (
                      <Table.Row key={collaborator.userId}>
                        <Table.RowHeaderCell
                          className={`align-middle! ${
                            hasRemoved ? "line-through" : ""
                          }`}
                        >
                          {collaborator.user.display_name ||
                            collaborator.user.primary_email?.split("@")[0] ||
                            collaborator.user.primary_email}
                        </Table.RowHeaderCell>
                        <Table.Cell
                          className={`align-middle! ${
                            hasRemoved ? "line-through" : ""
                          }`}
                        >
                          {collaborator.user.primary_email}
                        </Table.Cell>
                        <Table.Cell
                          className={`capitalize align-middle! ${
                            hasRemoved ? "line-through" : ""
                          }`}
                        >
                          {role}
                        </Table.Cell>
                        <Table.Cell className="align-middle!">
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                              <Button variant="soft">
                                Actions
                                <DropdownMenu.TriggerIcon />
                              </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                              <DropdownMenu.Group>
                                <DropdownMenu.Label>
                                  Select roles
                                </DropdownMenu.Label>
                                <DropdownMenu.CheckboxItem
                                  checked={role === "admin" && !hasRemoved}
                                  onCheckedChange={() =>
                                    changeRole(collaborator, "admin")
                                  }
                                >
                                  Admin
                                </DropdownMenu.CheckboxItem>
                                <DropdownMenu.CheckboxItem
                                  disabled={
                                    hasRemoved ? false : isOnlyActiveAdmin
                                  }
                                  checked={
                                    role === "collaborator" && !hasRemoved
                                  }
                                  onCheckedChange={() =>
                                    changeRole(collaborator, "collaborator")
                                  }
                                >
                                  Collaborator
                                </DropdownMenu.CheckboxItem>
                              </DropdownMenu.Group>
                              <DropdownMenu.Separator />

                              <DropdownMenu.Item
                                onSelect={() => {
                                  removeCollaborator(collaborator);
                                }}
                                disabled={
                                  hasRemoved ? false : isOnlyActiveAdmin
                                }
                              >
                                Remove access
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </Table.Cell>
                      </Table.Row>
                    );
                  });
                }}
              </Await>
            </Suspense>
          </Table.Body>
        </Table.Root>
        <Flex justify="end" mt="5" gap="3" align="center">
          {hasChanged && (
            <>
              <Text size="2" color="gray" className="italic">
                Pending changes
              </Text>
              <Button
                variant="outline"
                size="2"
                onClick={() => setDraftCollaborators(collaboratorsRef.current)}
              >
                Cancel
              </Button>
            </>
          )}

          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button highContrast size="2" disabled={!hasChanged}>
                Save
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>Save changes?</AlertDialog.Title>
              <AlertDialog.Description size="2">
                You're about to update collaborator roles and access
                permissions. These changes will take effect immediately and may
                affect who can manage this board.
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    variant="solid"
                    highContrast
                    onClick={() => {
                      // TODO: call actions
                    }}
                  >
                    Save
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Flex>
      </Flex>
    </Card>
  );
}

function SuspenseFallback() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Table.Row key={index}>
          <Table.RowHeaderCell className="align-middle!">
            <Skeleton width="100%">H. Alex Kwon</Skeleton>
          </Table.RowHeaderCell>
          <Table.Cell className="align-middle!">
            <Skeleton width="100%">team@standupkiwi.com</Skeleton>
          </Table.Cell>
          <Table.Cell className="align-middle!">
            <Skeleton width="100%">Collaborator</Skeleton>
          </Table.Cell>
          <Table.Cell className="align-middle!">
            <Skeleton width="100%">
              <Box width="91px" height="32px">
                Actions
              </Box>
            </Skeleton>
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );
}

export default CollaboratorsSetting;
