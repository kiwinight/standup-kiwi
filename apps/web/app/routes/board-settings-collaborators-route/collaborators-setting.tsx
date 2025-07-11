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
  useThemeContext,
} from "@radix-ui/themes";
import {
  Await,
  useLoaderData,
  useRouteLoaderData,
  useFetcher,
  useParams,
} from "react-router";
import type { loader } from "./board-settings-collaborators-route";
import {
  Suspense,
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import type { Collaborator, User } from "types";
import type { loader as rootLoader } from "~/root";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useToast } from "~/hooks/use-toast";
import type { ActionType as UpdateBoardCollaboratorsActionType } from "../update-board-collaborators/update-board-collaborators";

type Props = {};

function CollaboratorsTableSuspense() {
  const { collaboratorsPromise } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Await resolve={collaboratorsPromise}>
        {(collaborators) => {
          if (!collaborators) {
            return <SuspenseFallback />;
          }

          return (
            <Await resolve={currentUserPromise}>
              {(currentUser) => {
                if (!currentUser) {
                  return <SuspenseFallback />;
                }

                return (
                  <CollaboratorsTable
                    collaborators={collaborators}
                    currentUser={currentUser}
                  />
                );
              }}
            </Await>
          );
        }}
      </Await>
    </Suspense>
  );
}

function CollaboratorsTable({
  collaborators,
  currentUser,
}: {
  collaborators: Collaborator[];
  currentUser: User | null;
}) {
  const { boardId } = useParams();
  const { toast } = useToast();
  const updateCollaboratorsFetcher =
    useFetcher<UpdateBoardCollaboratorsActionType>();

  const collaboratorsRef = useRef<Collaborator[]>([]);
  const [draftCollaborators, setDraftCollaborators] = useState<Collaborator[]>(
    []
  );

  const { appearance } = useThemeContext();

  // Move state initialization into useEffect
  useEffect(() => {
    if (collaboratorsRef.current.length === 0) {
      collaboratorsRef.current = collaborators;
      setDraftCollaborators(collaborators);
    }
  }, [collaborators]);

  // Handle fetcher response and toast notifications
  useEffect(() => {
    if (updateCollaboratorsFetcher.data) {
      const error = updateCollaboratorsFetcher.data.error;
      if (error) {
        toast.error(error);
        console.error(error);
      } else {
        toast.success("Collaborator settings updated");
        // Update the collaborators ref and reset draft state on success
        if (updateCollaboratorsFetcher.data.collaborators) {
          collaboratorsRef.current =
            updateCollaboratorsFetcher.data.collaborators;
          setDraftCollaborators(updateCollaboratorsFetcher.data.collaborators);
        }
      }
    }
  }, [updateCollaboratorsFetcher.data]);

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

  const isSubmitting = updateCollaboratorsFetcher.state !== "idle";

  // Determine warnings based on changes
  const warnings = useMemo(() => {
    const warningMessages: string[] = [];

    // Check if current user is losing admin access
    if (currentUser) {
      const currentUserInOriginal = collaboratorsRef.current.find(
        (c) => c.userId === currentUser.id
      );
      const currentUserInDraft = draftCollaborators.find(
        (c) => c.userId === currentUser.id
      );

      if (
        currentUserInOriginal?.role === "admin" &&
        currentUserInDraft?.role === "collaborator"
      ) {
        warningMessages.push(
          "You will lose admin privileges and won't be able to manage board settings or collaborators."
        );
      }
    }

    // Check for removed collaborators
    const removedCollaborators = collaboratorsRef.current.filter(
      (original) =>
        !draftCollaborators.find((draft) => draft.userId === original.userId)
    );

    if (removedCollaborators.length > 0) {
      const names = removedCollaborators.map(
        (c) =>
          c.user.display_name ||
          c.user.primary_email?.split("@")[0] ||
          c.user.primary_email
      );
      if (removedCollaborators.length === 1) {
        warningMessages.push(`${names[0]} will lose access to this board.`);
      } else {
        warningMessages.push(
          `${names.length} collaborators will lose access to this board.`
        );
      }
    }

    // Check for role changes (excluding current user losing admin, which we already covered)
    const roleChanges = draftCollaborators.filter((draft) => {
      const original = collaboratorsRef.current.find(
        (c) => c.userId === draft.userId
      );
      return (
        original &&
        original.role !== draft.role &&
        draft.userId !== currentUser?.id
      );
    });

    if (roleChanges.length > 0) {
      const roleChangeNames = roleChanges.map((c) => {
        const original = collaboratorsRef.current.find(
          (orig) => orig.userId === c.userId
        );
        const name =
          c.user.display_name ||
          c.user.primary_email?.split("@")[0] ||
          c.user.primary_email;
        return `${name} (${original?.role} → ${c.role})`;
      });

      if (roleChanges.length === 1) {
        warningMessages.push(`${roleChangeNames[0]} role will be updated.`);
      } else {
        warningMessages.push(
          `${roleChanges.length} collaborators will have their roles updated.`
        );
      }
    }

    return warningMessages;
  }, [draftCollaborators, currentUser]);

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
        {currentUser &&
          collaborators.find((c: Collaborator) => c.userId === currentUser.id)
            ?.role === "admin" && (
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
                  <Button
                    highContrast
                    size="2"
                    loading={isSubmitting}
                    disabled={!hasChanged || isSubmitting}
                  >
                    Save
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth="450px">
                  <AlertDialog.Title>Save changes?</AlertDialog.Title>
                  <AlertDialog.Description size="2">
                    <Text>Are you sure you want to save these changes?</Text>
                    <br />
                    <br />
                    {warnings.length > 0 && (
                      <div
                        className={`prose prose-sm ${
                          appearance === "dark" ? "prose-invert" : ""
                        }`}
                      >
                        <ul style={{ marginTop: "0", paddingLeft: "16px" }}>
                          {warnings.map((warning, index) => (
                            <li key={index} style={{ marginBottom: "4px" }}>
                              <Text size="2">{warning}</Text>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <br />
                  </AlertDialog.Description>

                  <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action
                      onClick={() => {
                        if (!boardId) return;

                        updateCollaboratorsFetcher.submit(
                          {
                            collaborators: draftCollaborators.map((c) => ({
                              userId: c.userId,
                              role: c.role,
                            })),
                          },
                          {
                            encType: "application/json",
                            method: "POST",
                            action: `/boards/${boardId}/collaborators/update`,
                          }
                        );
                      }}
                    >
                      <Button
                        variant="solid"
                        highContrast
                        loading={isSubmitting}
                      >
                        Save
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </>
          )}
      </Flex>
    </>
  );
}

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

        <CollaboratorsTableSuspense />
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
