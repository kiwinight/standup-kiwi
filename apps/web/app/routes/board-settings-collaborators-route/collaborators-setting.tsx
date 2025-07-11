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
import type { Collaborator, User } from "types";
import type { loader as rootLoader } from "~/root";
import { InfoCircledIcon } from "@radix-ui/react-icons";

type Props = {};

function Renderer({
  collaborators,
  currentUser,
}: {
  collaborators: Collaborator[];
  currentUser: User | null;
}) {
  const collaboratorsRef = useRef<Collaborator[]>([]);
  const [draftCollaborators, setDraftCollaborators] = useState<Collaborator[]>(
    []
  );

  // Initialize state when collaborators data is available
  if (collaboratorsRef.current.length === 0) {
    collaboratorsRef.current = collaborators;
    setDraftCollaborators(collaborators);
  }

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
    <>
      <Table.Root mt="5">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell width="auto">Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell width="auto">Email</Table.ColumnHeaderCell>
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
                      Admins can do everything collaborators can do, plus manage
                      board settings and remove users from the board.
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
            {currentUser &&
              collaborators.find(
                (c: Collaborator) => c.userId === currentUser.id
              )?.role === "admin" && (
                <Table.ColumnHeaderCell width="auto"></Table.ColumnHeaderCell>
              )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {collaborators.map((collaborator: Collaborator) => {
            const hasRemoved = !draftCollaborators.find(
              (c) => c.userId === collaborator.userId
            );

            const draftCollaborator = draftCollaborators.find(
              (c) => c.userId === collaborator.userId
            );

            const role = draftCollaborator?.role || collaborator.role;

            const isCurrentUser: boolean =
              (currentUser && collaborator.userId === currentUser.id) ?? false;

            // Check if this is the only active admin
            const isOnlyActiveAdmin =
              role === "admin" &&
              draftCollaborators.filter((c) => c.role === "admin").length === 1;

            // Get current user's role on this board
            const currentUserRole = currentUser
              ? collaborators.find(
                  (c: Collaborator) => c.userId === currentUser.id
                )?.role
              : null;

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
                          <DropdownMenu.Label>Select roles</DropdownMenu.Label>
                          <DropdownMenu.CheckboxItem
                            checked={role === "admin" && !hasRemoved}
                            onCheckedChange={() =>
                              changeRole(collaborator, "admin")
                            }
                          >
                            Admin
                          </DropdownMenu.CheckboxItem>
                          <DropdownMenu.CheckboxItem
                            checked={role === "collaborator" && !hasRemoved}
                            onCheckedChange={() =>
                              changeRole(collaborator, "collaborator")
                            }
                            disabled={isOnlyActiveAdmin}
                          >
                            Collaborator
                          </DropdownMenu.CheckboxItem>
                        </DropdownMenu.Group>
                        <DropdownMenu.Separator />

                        <DropdownMenu.Item
                          onSelect={() => {
                            removeCollaborator(collaborator);
                          }}
                          disabled={isCurrentUser || isOnlyActiveAdmin}
                        >
                          Remove access
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                )}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
      <Flex justify="end" mt="5" gap="3" align="center">
        {(() => {
          const currentUserRole = currentUser
            ? collaborators.find(
                (c: Collaborator) => c.userId === currentUser.id
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
                      permissions. These changes will take effect immediately
                      and may affect who can manage this board.
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
        })()}
      </Flex>
    </>
  );
}

function Resolver() {
  const { collaboratorsPromise } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  return (
    <Await resolve={Promise.all([collaboratorsPromise, currentUserPromise])}>
      {([collaborators, currentUser]) => {
        if (!collaborators) {
          return <SuspenseFallback />;
        }

        return (
          <Renderer collaborators={collaborators} currentUser={currentUser} />
        );
      }}
    </Await>
  );
}

// Main component that wraps everything in Suspense
function CollaboratorsSetting({}: Props) {
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

        <Suspense fallback={<SuspenseFallback />}>
          <Resolver />
        </Suspense>
      </Flex>
    </Card>
  );
}

function SuspenseFallback() {
  return (
    <Table.Root mt="5">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell width="auto">Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="auto">Email</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="110px">Role</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell width="auto"></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
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
                <Button variant="soft" highContrast>
                  Edit
                </Button>
              </Skeleton>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export default CollaboratorsSetting;
