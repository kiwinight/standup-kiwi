import { Link2Icon } from "@radix-ui/react-icons";
import {
  Button,
  Card,
  Dialog,
  Flex,
  Skeleton,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Suspense, useEffect, useState } from "react";
import { useLoaderData, Await, useFetcher, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { DateTime } from "luxon";
import type { loader } from "./board-settings-collaborators-route";
import type { ActionType as RegenerateInvitationActionType } from "../regenerate-board-invitation/regenerate-board-invitation";
import { useToast } from "~/hooks/use-toast";

// TODO: Refactoring suggestions
// TODO 1: Extract Multiple Components
//   - InvitationLinkField: Handle the text field with copy functionality
//   - InvitationActions: Manage Copy/Settings buttons separately
//   - InvitationExpiration: Display expiration text
//   - InvitationSettingsDialog: The entire dialog could be its own component

// TODO 2: Create Custom Hooks
//   - useInvitationActions: Handle regeneration logic, toast notifications, and fetcher state
//   - useClipboard: Extract the copy-to-clipboard functionality
//   - useInvitationUrl: Generate and manage the invitation URL
//   - useDateCalculation: Extract shared date calculation logic

// TODO 5: Extract Form Logic
//   - Custom hook for form state (useInvitationForm)
//   - Separate validation logic
//   - Extract form submission handler

// TODO 6: Create Reusable Loading Components
//   - InvitationFieldSkeleton
//   - InvitationButtonSkeleton
//   - InvitationTextSkeleton

// TODO 7: Reduce Inline Functions
//   - Extract handleCopy, handleFocus, handleSettingsOpen to custom hooks
//   - Move dialog submission logic to the dialog component

// TODO 8: Simplify State Management
//   - Dialog open/close state should be in the dialog component
//   - Fetcher state handling should be in a custom hook
//   - Toast notifications should be abstracted

// TODO 9: Better Error Boundaries
//   - Clipboard operations error handling
//   - Data loading failures error handling
//   - Form submission errors error handling

// TODO 10: Type Safety Improvements
//   - Replace 'any' types with proper interfaces
//   - Create shared types for invitation data
//   - Use React Router 7's typed route patterns

// TODO 11: Improve Toast Messages
//   - Toast copy texts are not user-friendly (especially error messages)
//   - Create user-friendly error message mapping
//   - Make success messages more concise and actionable

type Props = {};

interface InvitationDialogContentProps {
  invitation: any;
  timezone: string | undefined;
  boardId: string | undefined;
  onClose: () => void;
}

function InvitationDialogContent({
  invitation,
  timezone,
  boardId,
  onClose,
}: InvitationDialogContentProps) {
  const regenerateInvitationFetcher =
    useFetcher<RegenerateInvitationActionType>({
      key: "regenerate-invitation",
    });
  const currentExpirationDays =
    invitation?.expiresAt && timezone
      ? getDaysFromNowAsNumber(invitation.expiresAt, timezone)
      : 7;

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    watch,
    reset,
  } = useForm<{ expirationDays: number }>({
    defaultValues: {
      expirationDays: currentExpirationDays,
    },
    mode: "onChange",
  });

  const watchedExpirationDays = watch("expirationDays");

  return (
    <>
      <Dialog.Title size="4">Invitation Link Settings</Dialog.Title>
      <Dialog.Description size="2">
        Edit the link settings for the invitation.
      </Dialog.Description>

      <Flex direction="column" gap="3" mt="5">
        <Text size="2" weight="bold">
          Expires in
        </Text>

        <Controller
          name="expirationDays"
          control={control}
          rules={{
            required: "Expiration days is required",
            min: {
              value: 1,
              message: "Minimum 1 day required",
            },
            max: {
              value: 365,
              message: "Maximum 365 days allowed",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextField.Root
              type="number"
              min="1"
              max="365"
              value={value.toString()}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Enter days"
            >
              <TextField.Slot side="right">
                <Text size="2" color="gray">
                  days
                </Text>
              </TextField.Slot>
            </TextField.Root>
          )}
        />
        {errors.expirationDays && (
          <Text size="1" color="red">
            {errors.expirationDays.message}
          </Text>
        )}
      </Flex>
      <Flex justify="end" mt="5" gap="3" align="center">
        <Dialog.Close>
          <Button variant="soft" highContrast>
            Close
          </Button>
        </Dialog.Close>
        <Button
          variant="soft"
          highContrast
          disabled={!isValid || watchedExpirationDays === currentExpirationDays}
          onClick={handleSubmit((data) => {
            onClose();
            regenerateInvitationFetcher.submit(
              {
                role: "collaborator",
                expiresIn: `${data.expirationDays}d`,
              },
              {
                method: "POST",
                action: `/boards/${boardId}/invitation/regenerate`,
                encType: "application/json",
              }
            );
          })}
        >
          Generate New Link
        </Button>
      </Flex>
    </>
  );
}

function calculateDaysFromNow(dateString: string, timezone: string): number {
  const today = DateTime.now().setZone(timezone).startOf("day");
  const expirationDate = DateTime.fromISO(dateString, { zone: "utc" })
    .setZone(timezone)
    .startOf("day");

  return Math.ceil(expirationDate.diff(today, "days").days);
}

function formatDaysFromNow(days: number): string {
  if (days <= 0) return "Expired";
  if (days === 1) return "1 day";
  return `${days} days`;
}

function getDaysFromNowAsNumber(dateString: string, timezone: string): number {
  const days = calculateDaysFromNow(dateString, timezone);
  return Math.max(days, 1); // Ensure minimum 1 day for form
}

function getDaysFromNowForForm(dateString: string, timezone: string): number {
  const days = calculateDaysFromNow(dateString, timezone);
  return Math.max(days, 1); // Ensure minimum 1 day for form
}

function InviteCollaboratorsSetting({}: Props) {
  const { ensureInvitationPromise, boardPromise, baseUrl } =
    useLoaderData<typeof loader>();
  const { boardId } = useParams();
  const { toast } = useToast();

  const regenerateInvitationFetcher =
    useFetcher<RegenerateInvitationActionType>({
      key: "regenerate-invitation",
    });

  useEffect(() => {
    if (regenerateInvitationFetcher.data) {
      const { error } = regenerateInvitationFetcher.data;
      if (error) {
        toast.error(error);
        console.error(error);
      } else {
        toast.success("New invitation link generated successfully");
      }
    }
  }, [regenerateInvitationFetcher.data]);

  const [isInvitationLinkSettingsOpen, setIsInvitationLinkSettingsOpen] =
    useState(false);

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

        <>
          <Text size="2" color="gray" mt="2">
            Share this link with people you want to invite to collaborate on
            your board.
          </Text>

          <Flex gap="3" mt="2">
            <Suspense
              fallback={
                <Skeleton className="flex-1">
                  <TextField.Root className="flex-1" />
                </Skeleton>
              }
            >
              <Await resolve={ensureInvitationPromise}>
                {(invitation) => {
                  return regenerateInvitationFetcher.state !== "idle" ? (
                    <Skeleton className="flex-1">
                      <TextField.Root className="flex-1" />
                    </Skeleton>
                  ) : (
                    <TextField.Root
                      className="flex-1"
                      value={`${baseUrl}/invitations/${invitation?.token}`}
                      readOnly
                      // onChange={() => null}
                    >
                      <TextField.Slot>
                        <Link2Icon />
                      </TextField.Slot>
                    </TextField.Root>
                  );
                }}
              </Await>
            </Suspense>

            <Suspense
              fallback={
                <Button variant="soft" highContrast disabled>
                  Copy
                </Button>
              }
            >
              <Await resolve={ensureInvitationPromise}>
                {(invitation) => (
                  <Button
                    variant="soft"
                    highContrast
                    disabled={regenerateInvitationFetcher.state !== "idle"}
                    onClick={async () => {
                      try {
                        const url = `${baseUrl}/invitations/${invitation?.token}`;
                        await navigator.clipboard.writeText(url);
                        toast.success("Invitation link copied to clipboard");
                      } catch (err) {
                        console.error("Failed to copy to clipboard:", err);
                        toast.error("Failed to copy invitation link");
                      }
                    }}
                  >
                    Copy
                  </Button>
                )}
              </Await>
            </Suspense>

            <Dialog.Root
              open={isInvitationLinkSettingsOpen}
              onOpenChange={setIsInvitationLinkSettingsOpen}
            >
              <Suspense
                fallback={
                  <Button variant="soft" highContrast disabled>
                    Settings
                  </Button>
                }
              >
                <Await resolve={ensureInvitationPromise}>
                  {() => (
                    <Dialog.Trigger>
                      <Button
                        variant="soft"
                        highContrast
                        disabled={regenerateInvitationFetcher.state !== "idle"}
                      >
                        Settings
                      </Button>
                    </Dialog.Trigger>
                  )}
                </Await>
              </Suspense>
              <Dialog.Content
                size={{
                  initial: "3",
                  sm: "4",
                }}
              >
                <Await resolve={boardPromise}>
                  {(board) => {
                    const timezone = board?.timezone;
                    return (
                      <Await resolve={ensureInvitationPromise}>
                        {(invitation) => (
                          <InvitationDialogContent
                            invitation={invitation}
                            timezone={timezone}
                            boardId={boardId}
                            onClose={() =>
                              setIsInvitationLinkSettingsOpen(false)
                            }
                          />
                        )}
                      </Await>
                    );
                  }}
                </Await>
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
          <Flex>
            <Suspense
              fallback={
                <Skeleton className="">
                  <Text size="1" color="gray" mt="2">
                    Expires in 30 day
                  </Text>
                </Skeleton>
              }
            >
              <Await resolve={boardPromise}>
                {(board) => {
                  const timezone = board?.timezone; // e.g. "America/New_York"
                  return (
                    <Await resolve={ensureInvitationPromise}>
                      {(invitation) => {
                        return regenerateInvitationFetcher.state !== "idle" ? (
                          <Skeleton className="">
                            <Text size="1" color="gray" mt="2">
                              Expires in 30 days
                            </Text>
                          </Skeleton>
                        ) : (
                          <Text size="1" color="gray" mt="2">
                            Expires in{" "}
                            {invitation?.expiresAt && timezone
                              ? formatDaysFromNow(
                                  calculateDaysFromNow(
                                    invitation.expiresAt,
                                    timezone
                                  )
                                )
                              : "Unknown"}
                          </Text>
                        );
                      }}
                    </Await>
                  );
                }}
              </Await>
            </Suspense>
          </Flex>
        </>
      </Flex>
    </Card>
  );
}

export default InviteCollaboratorsSetting;
