import {
  Table,
  Text,
  Button,
  Card,
  Flex,
  Skeleton,
  DropdownMenu,
  AlertDialog,
  Tooltip,
} from "@radix-ui/themes";
import { Await, useLoaderData, useRouteLoaderData } from "react-router";
import type { loader } from "./board-settings-collaborators-route";
import { Suspense, useMemo, useState, useCallback, useRef } from "react";
import type { Collaborator } from "types";
import { useAwait } from "~/hooks/use-await";
import type { loader as rootLoader } from "~/root";
import { InfoCircledIcon } from "@radix-ui/react-icons";

type Props = {};

function CollaboratorsSetting({}: Props) {
  const { collaboratorsPromise } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

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
                <Tooltip
                  content={
                    <Flex direction="column" gap="1" align="start">
                      <Text size="2">
                        Collaborators can view and submit standups, and invite
                        others.
                      </Text>
                      <br />
                      <Text size="2">
                        Admins can do everything collaborators can do, plus
                        manage board settings and remove users from the board.
                      </Text>
                    </Flex>
                  }
                  side="top"
                  align="center"
                >
                  <Flex align="center" gap="1">
                    Role
                    <InfoCircledIcon />
                  </Flex>
                </Tooltip>
              </Table.ColumnHeaderCell>
              <Suspense fallback={null}>
                <Await
                  resolve={Promise.all([
                    currentUserPromise,
                    collaboratorsPromise,
                  ])}
                >
                  {([currentUser, loadedCollaborators]) => {
                    const currentUserRole = currentUser
                      ? loadedCollaborators?.find(
                          (c) => c.userId === currentUser.id
                        )?.role
                      : null;

                    return currentUserRole === "admin" ? (
                      <Table.ColumnHeaderCell width="auto"></Table.ColumnHeaderCell>
                    ) : null;
                  }}
                </Await>
              </Suspense>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Suspense fallback={<SuspenseFallback />}>
              <Await
                resolve={Promise.all([
                  currentUserPromise,
                  collaboratorsPromise,
                ])}
              >
                {([currentUser, loadedCollaborators]) => {
                  if (!loadedCollaborators) {
                    return <SuspenseFallback />;
                  }

                  // Get current user's role on this board
                  const currentUserRole = currentUser
                    ? loadedCollaborators.find(
                        (c) => c.userId === currentUser.id
                      )?.role
                    : null;

                  return loadedCollaborators.map((collaborator) => {
                    const hasRemoved = !draftCollaborators.find(
                      (c) => c.userId === collaborator.userId
                    );

                    const draftCollaborator = draftCollaborators.find(
                      (c) => c.userId === collaborator.userId
                    );

                    const role = draftCollaborator?.role || collaborator.role;

                    const isCurrentUser: boolean =
                      (currentUser && collaborator.userId === currentUser.id) ??
                      false;

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
                          {isCurrentUser && " (You)"}
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
                        {currentUserRole === "admin" && (
                          <Table.Cell className="align-middle!">
                            <DropdownMenu.Root>
                              <DropdownMenu.Trigger>
                                <Button variant="soft" highContrast>
                                  Edit
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
                                  disabled={isCurrentUser}
                                >
                                  Remove access
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu.Root>
                          </Table.Cell>
                        )}
                      </Table.Row>
                    );
                  });
                }}
              </Await>
            </Suspense>
          </Table.Body>
        </Table.Root>
        <Flex justify="end" mt="5" gap="3" align="center">
          <Suspense>
            <Await
              resolve={Promise.all([currentUserPromise, collaboratorsPromise])}
            >
              {([currentUser, loadedCollaborators]) => {
                const currentUserRole = currentUser
                  ? loadedCollaborators?.find(
                      (c) => c.userId === currentUser.id
                    )?.role
                  : null;

                if (currentUserRole === "admin") {
                  return (
                    <>
                      {hasChanged && (
                        <>
                          <Text size="2" color="gray" className="italic">
                            Pending changes
                          </Text>
                          <Button
                            variant="outline"
                            size="2"
                            onClick={() =>
                              setDraftCollaborators(collaboratorsRef.current)
                            }
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
                            permissions. These changes will take effect
                            immediately and may affect who can manage this
                            board.
                            {/* TODO: warn user when they lose admin role */}
                            {/* TODO: Warn user when they remove other collaborators */}
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
                    </>
                  );
                }

                return null;
              }}
            </Await>
          </Suspense>
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
        </Table.Row>
      ))}
    </>
  );
}

export default CollaboratorsSetting;
