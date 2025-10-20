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
import type { Invitation } from "~/types";

function InvitationLinkTextFieldSkeleton() {
  return (
    <Skeleton className="flex-1">
      <TextField.Root className="flex-1" />
    </Skeleton>
  );
}

function CopyButtonSkeleton() {
  return (
    <Button variant="soft" highContrast disabled>
      Copy
    </Button>
  );
}

function SettingsButtonSkeleton() {
  return (
    <Button variant="soft" highContrast disabled>
      Settings
    </Button>
  );
}

function ExpirationTextSkeleton() {
  return (
    <Skeleton className="">
      <Text size="1" color="gray" mt="2">
        Expires in 30 day
      </Text>
    </Skeleton>
  );
}

function InvitationDialogContentSkeleton() {
  return null;
}

function InvitationLinkTextField({
  invitation,
}: {
  invitation: Invitation | null;
}) {
  const { baseUrl } = useLoaderData<typeof loader>();
  const regenerateInvitationFetcher =
    useFetcher<RegenerateInvitationActionType>({
      key: "regenerate-invitation",
    });

  return regenerateInvitationFetcher.state !== "idle" ? (
    <InvitationLinkTextFieldSkeleton />
  ) : (
    <TextField.Root
      className="flex-1"
      value={`${baseUrl}/invitations/${invitation?.token}`}
      readOnly
    >
      <TextField.Slot>
        <Link2Icon />
      </TextField.Slot>
    </TextField.Root>
  );
}

function CopyButton({ invitation }: { invitation: Invitation | null }) {
  const { baseUrl } = useLoaderData<typeof loader>();
  const { toast } = useToast();
  const regenerateInvitationFetcher =
    useFetcher<RegenerateInvitationActionType>({
      key: "regenerate-invitation",
    });

  return (
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
  );
}

function SettingsButton() {
  const regenerateInvitationFetcher =
    useFetcher<RegenerateInvitationActionType>({
      key: "regenerate-invitation",
    });

  return (
    <Dialog.Trigger>
      <Button
        variant="soft"
        highContrast
        disabled={regenerateInvitationFetcher.state !== "idle"}
      >
        Settings
      </Button>
    </Dialog.Trigger>
  );
}

function ExpirationText({
  invitation,
  timezone,
}: {
  invitation: Invitation | null;
  timezone: string | undefined;
}) {
  const regenerateInvitationFetcher =
    useFetcher<RegenerateInvitationActionType>({
      key: "regenerate-invitation",
    });

  return regenerateInvitationFetcher.state !== "idle" ? (
    <ExpirationTextSkeleton />
  ) : (
    <Text size="1" color="gray" mt="2">
      Expires in{" "}
      {invitation?.expiresAt && timezone
        ? formatDaysFromNow(
            calculateDaysFromNow(invitation.expiresAt, timezone)
          )
        : "Unknown"}
    </Text>
  );
}

type Props = {};

interface InvitationDialogContentProps {
  invitation: Invitation | null;
  timezone: string | undefined;
  boardId: number;
  onClose: () => void;
}

function InvitationDataLoader({
  children,
  fallback,
}: {
  children: (data: { invitation: Invitation | null }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { ensureInvitationPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={ensureInvitationPromise}>
        {(invitation) => {
          return children({ invitation });
        }}
      </Await>
    </Suspense>
  );
}

function InvitationLinkTextFieldDataLoader({
  children,
  fallback,
}: {
  children: (data: { invitation: Invitation | null }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  return (
    <InvitationDataLoader fallback={fallback}>
      {({ invitation }) => children({ invitation })}
    </InvitationDataLoader>
  );
}

function CopyButtonDataLoader({
  children,
  fallback,
}: {
  children: (data: { invitation: Invitation | null }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  return (
    <InvitationDataLoader fallback={fallback}>
      {({ invitation }) => children({ invitation })}
    </InvitationDataLoader>
  );
}

function SettingsButtonDataLoader({
  children,
  fallback,
}: {
  children: (data: { invitation: Invitation | null }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  return (
    <InvitationDataLoader fallback={fallback}>
      {({ invitation }) => children({ invitation })}
    </InvitationDataLoader>
  );
}

function ExpirationTextDataLoader({
  children,
  fallback,
}: {
  children: (data: {
    invitation: Invitation | null;
    timezone: string | undefined;
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { boardPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={boardPromise}>
        {(board) => {
          const timezone = board?.timezone;
          return (
            <InvitationDataLoader fallback={fallback}>
              {({ invitation }) => children({ invitation, timezone })}
            </InvitationDataLoader>
          );
        }}
      </Await>
    </Suspense>
  );
}

function InvitationDialogContentDataLoader({
  children,
  fallback,
}: {
  children: (data: {
    invitation: Invitation | null;
    timezone: string | undefined;
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { boardPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={boardPromise}>
        {(board) => {
          const timezone = board?.timezone;
          return (
            <InvitationDataLoader fallback={fallback}>
              {({ invitation }) => children({ invitation, timezone })}
            </InvitationDataLoader>
          );
        }}
      </Await>
    </Suspense>
  );
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
          Generate new link
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
  const boardId = parseInt(useParams().boardId!, 10);
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
            Invite collaborators
          </Text>
        </Flex>

        {/* TODO: I don't think this is necessary anymore. Consider removing it. */}
        {/* <Text size="3" weight="bold" mt="5">
          Invitation Link
        </Text> */}

        <>
          <Text size="2" color="gray" mt="2">
            Share this link with people you want to invite to collaborate on
            your board.
          </Text>

          <Flex gap="3" mt="2">
            <InvitationLinkTextFieldDataLoader
              fallback={<InvitationLinkTextFieldSkeleton />}
            >
              {({ invitation }) => (
                <InvitationLinkTextField invitation={invitation} />
              )}
            </InvitationLinkTextFieldDataLoader>

            <CopyButtonDataLoader fallback={<CopyButtonSkeleton />}>
              {({ invitation }) => <CopyButton invitation={invitation} />}
            </CopyButtonDataLoader>

            <Dialog.Root
              open={isInvitationLinkSettingsOpen}
              onOpenChange={setIsInvitationLinkSettingsOpen}
            >
              <SettingsButtonDataLoader fallback={<SettingsButtonSkeleton />}>
                {() => <SettingsButton />}
              </SettingsButtonDataLoader>
              <Dialog.Content
                size={{
                  initial: "3",
                  sm: "4",
                }}
              >
                <InvitationDialogContentDataLoader
                  fallback={<InvitationDialogContentSkeleton />}
                >
                  {({ invitation, timezone }) => (
                    <InvitationDialogContent
                      invitation={invitation}
                      timezone={timezone}
                      boardId={boardId}
                      onClose={() => setIsInvitationLinkSettingsOpen(false)}
                    />
                  )}
                </InvitationDialogContentDataLoader>
              </Dialog.Content>
            </Dialog.Root>
          </Flex>

          <Flex>
            <ExpirationTextDataLoader fallback={<ExpirationTextSkeleton />}>
              {({ invitation, timezone }) => (
                <ExpirationText invitation={invitation} timezone={timezone} />
              )}
            </ExpirationTextDataLoader>
          </Flex>
        </>
      </Flex>
    </Card>
  );
}

export default InviteCollaboratorsSetting;
