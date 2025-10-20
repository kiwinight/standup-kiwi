import {
  Button,
  Card,
  Flex,
  Select,
  Text,
  Skeleton,
  Callout,
} from "@radix-ui/themes";
import React, { useEffect, useMemo, Suspense } from "react";
import {
  useFetcher,
  useLoaderData,
  Await,
  useRouteLoaderData,
} from "react-router";
import type { loader } from "./board-settings-route";
import type { loader as rootLoader } from "~/root";
import { type ActionType as UpdateBoardActionType } from "../update-board-route/update-board-route";
import { useForm } from "react-hook-form";
import { useToast } from "~/hooks/use-toast";
import type { Board, Collaborator, User } from "types";
import { InfoCircledIcon } from "@radix-ui/react-icons";

function getTimezoneOptions() {
  // Get all timezone identifiers
  const timezoneIds = Intl.supportedValuesOf("timeZone");

  // Current date to show current offset
  const now = new Date();

  // Group timezones by offset
  const groups: Record<
    string,
    { value: string; label: string; offset: string }[]
  > = {};

  timezoneIds.forEach((id) => {
    // Get the city name from the ID
    const cityName = id.split("/").pop()?.replace(/_/g, " ");

    // Create timezone-specific formatter to get the correct UTC offset
    const tzFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: id,
      timeZoneName: "shortOffset",
    });

    // Get the UTC offset from formatter
    const rawOffset =
      tzFormatter
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value || "";

    // Convert GMT+X to UTC+X format and handle the case where it shows "UTCGMT"
    let utcOffset = rawOffset.replace(/GMT([+-]\d+)/, "UTC$1");

    // Clean up any cases of "UTCGMT" that appear
    utcOffset = utcOffset.replace("UTCGMT", "UTC+00");

    // If the rawOffset is just "GMT" without a number, treat it as UTC+00
    if (rawOffset === "GMT") {
      utcOffset = "UTC+00";
    }

    // Format the offset for sorting (e.g., "UTC+9" -> "+09")
    let formattedOffset = utcOffset.replace(
      /UTC([+-])(\d+)/,
      (_, sign, hours) => {
        // Pad with leading zero if needed
        return `${sign}${hours.padStart(2, "0")}`;
      }
    );

    // For UTC+00, make sure we have the right format
    if (utcOffset === "UTC+00" || utcOffset === "UTC-00") {
      formattedOffset = "+00";
    }

    // The key for grouping - we'll use the full UTC+X format
    const groupKey = `UTC${formattedOffset}`;

    // Create a user-friendly label with the required format
    const label = `${cityName}`;

    // Use formatted offset as the group key
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push({
      value: id,
      label: label,
      offset: formattedOffset, // Store the formatted offset for display
    });
  });

  // Sort the groups by UTC offset
  const sortedGroups: Record<
    string,
    { value: string; label: string; offset: string }[]
  > = {};

  Object.keys(groups)
    .sort((a, b) => {
      // Extract numeric offset values for sorting
      const offsetA = a.replace(/UTC([+-])(\d+)/, "$1$2");
      const offsetB = b.replace(/UTC([+-])(\d+)/, "$1$2");

      return parseInt(offsetA, 10) - parseInt(offsetB, 10);
    })
    .forEach((key) => {
      sortedGroups[key] = groups[key].sort((a, b) =>
        a.label.localeCompare(b.label)
      );
    });

  return sortedGroups;
}

type Props = {};

function TimezoneFormDataResolver({
  children,
  fallback,
}: {
  children: (data: {
    board: Board | null;
    collaborators: Collaborator[] | null;
    currentUser: User | null;
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { boardPromise, collaboratorsPromise } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  return (
    <Suspense fallback={fallback}>
      <Await resolve={boardPromise}>
        {(board) => (
          <Await resolve={collaboratorsPromise}>
            {(collaborators) => (
              <Await resolve={currentUserPromise}>
                {(currentUser) =>
                  children({ board, collaborators, currentUser })
                }
              </Await>
            )}
          </Await>
        )}
      </Await>
    </Suspense>
  );
}

function TimezoneForm({
  board,
  collaborators,
  currentUser,
}: {
  board: Board;
  collaborators: Collaborator[] | null;
  currentUser: User | null;
}) {
  const updateBoardTimezoneFetcher = useFetcher<UpdateBoardActionType>();
  const { toast } = useToast();

  const isCurrentUserAdmin = useMemo(() => {
    if (!currentUser || !collaborators) return false;
    const userCollaborator = collaborators.find(
      (c) => c.userId === currentUser.id
    );
    return userCollaborator?.role === "admin";
  }, [currentUser, collaborators]);

  const timezoneOptions = useMemo(() => getTimezoneOptions(), []);

  const {
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<{ timezone: string }>({
    defaultValues: { timezone: board.timezone },
  });

  useEffect(() => {
    if (
      updateBoardTimezoneFetcher.state === "idle" &&
      updateBoardTimezoneFetcher.data
    ) {
      const error = updateBoardTimezoneFetcher.data.error;
      if (error) {
        toast.error(error);
        console.error(error);
      } else {
        toast.success("Board timezone has been saved");
      }
    }
  }, [updateBoardTimezoneFetcher.state, updateBoardTimezoneFetcher.data]);

  const handleTimezoneFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    handleSubmit((data) => {
      updateBoardTimezoneFetcher.submit(
        {
          timezone: data.timezone,
        },
        {
          encType: "application/json",
          method: "POST",
          action: `/boards/${board.id}/update`,
        }
      );
    })(event);
  };

  return (
    <form
      method="post"
      onSubmit={handleTimezoneFormSubmit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          if (event.metaKey || event.ctrlKey) {
            event.currentTarget.requestSubmit();
            return;
          }
          if (document.activeElement?.getAttribute("type") === "submit") {
            return;
          }
          event.preventDefault();
        }
      }}
    >
      <Flex direction="column" gap="5">
        <Text size="4" weight="bold">
          Timezone
        </Text>

        {!isCurrentUserAdmin && (
          <Callout.Root size="1" variant="soft" className="py-2!">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
              You will need admin privileges to update this setting.
            </Callout.Text>
          </Callout.Root>
        )}

        <Flex direction="column" gap="5">
          <Flex key="timezone" direction="column" gap="2">
            <Text size="2" weight="medium">
              Standup timezone
            </Text>

            <Select.Root
              defaultValue={board.timezone}
              onValueChange={(value) => {
                setValue("timezone", value);
              }}
              disabled={!isCurrentUserAdmin}
            >
              <Select.Trigger
                suppressHydrationWarning
                className={
                  !isCurrentUserAdmin
                    ? "cursor-not-allowed! [&_button]:cursor-not-allowed!"
                    : ""
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    (event.metaKey || event.ctrlKey)
                  ) {
                    event.preventDefault();
                    return;
                  }
                }}
              />
              <Select.Content>
                {Object.entries(timezoneOptions).map(
                  ([offsetGroup, timezoneList]) => (
                    <React.Fragment key={offsetGroup}>
                      <Select.Group>
                        <Select.Label>{offsetGroup}</Select.Label>
                        {timezoneList.map((tz) => (
                          <Select.Item key={tz.value} value={tz.value}>
                            (UTC{tz.offset}) {tz.label}
                          </Select.Item>
                        ))}
                      </Select.Group>
                      <Select.Separator />
                    </React.Fragment>
                  )
                )}
              </Select.Content>
            </Select.Root>
            <Text color="gray" size="2">
              This timezone determines the date assigned to all standups on this
              board. Standups are recorded based on the selected timezone.
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex justify="end" mt="5" gap="2">
        <Button
          highContrast
          size="2"
          type="submit"
          disabled={!isCurrentUserAdmin || board.timezone === watch("timezone")}
          loading={updateBoardTimezoneFetcher.state !== "idle"}
        >
          Save
        </Button>
      </Flex>
    </form>
  );
}

function TimezoneFormSkeleton() {
  return (
    <form>
      <Flex direction="column">
        <Text size="4" weight="bold">
          Timezone
        </Text>
        <Flex direction="column" mt="5" gap="5">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              Standup timezone
            </Text>

            <Skeleton height="32px" />

            <Text color="gray" size="2">
              This timezone determines the date assigned to all standups on this
              board. Standups are recorded based on the selected timezone.
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex justify="end" mt="5" gap="2">
        <Button highContrast size="2" disabled>
          Save
        </Button>
      </Flex>
    </form>
  );
}

function TimezoneSetting({}: Props) {
  return (
    <Card
      size={{
        initial: "2",
        sm: "4",
      }}
    >
      <TimezoneFormDataResolver fallback={<TimezoneFormSkeleton />}>
        {({ board, collaborators, currentUser }) => {
          if (!board) {
            return <TimezoneFormSkeleton />;
          }
          return (
            <TimezoneForm
              board={board}
              collaborators={collaborators}
              currentUser={currentUser}
            />
          );
        }}
      </TimezoneFormDataResolver>
    </Card>
  );
}

export default TimezoneSetting;
