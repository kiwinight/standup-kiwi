import { Await, useLoaderData, useRouteLoaderData } from "react-router";
import type { loader } from "./board-route";
import { Suspense, useMemo } from "react";
import {
  Box,
  Card,
  Flex,
  Grid as RadixGrid,
  Skeleton,
  Text,
  Tooltip,
  useThemeContext,
} from "@radix-ui/themes";
import { DateTime } from "luxon";
import type { Board, Standup, StandupForm, Collaborator, User } from "types";
import { DynamicFormSkeleton, validateDynamicFormSchema } from "./dynamic-form";
import { parseMarkdownToHtml } from "~/libs/markdown";
import { type DynamicFormValues } from "./dynamic-form";
import CurrentUserStandupCard, {
  ContentSkeleton,
  TodayStandupNewSkeleton,
} from "./current-user-standup-card";
import type { loader as rootLoader } from "~/root";
import {
  useGridViewSettings,
  type CardSize,
} from "~/context/GridViewSettingsContext";
import { useViewSettings } from "~/context/ViewSettingsContext";

// Helper function to map card sizes to pixel values
function getCardWidth(cardSize: CardSize): string {
  switch (cardSize) {
    case "small":
      return "296px";
    case "medium":
      return "384px";
    case "large":
      return "520px";
    default:
      return "384px";
  }
}

function FeedSkeleton({ collaboratorsCount }: { collaboratorsCount: number }) {
  const card = (
    <Card
      variant="surface"
      size={{
        initial: "3",
        sm: "4",
      }}
    >
      <Flex direction="column" gap="5" align="start">
        <Text size="4" weight="bold">
          <Skeleton>username</Skeleton>
        </Text>
        <Flex direction="column" gap="2">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              <Skeleton>What did you do yesterday?</Skeleton>
            </Text>
            <Text size="2" className="max-h-[40px] overflow-hidden">
              <Skeleton width="100%">
                {Array.from({ length: 100 }).map((_, index) => "A ")}
              </Skeleton>
            </Text>
          </Flex>
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              <Skeleton>What will you do today?</Skeleton>
            </Text>
            <Text size="2" className="max-h-[40px] overflow-hidden">
              <Skeleton width="100%">
                {Array.from({ length: 100 }).map((_, index) => "A ")}
              </Skeleton>
            </Text>
          </Flex>
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              <Skeleton>Do you have any blockers?</Skeleton>
            </Text>
            <Text size="2" className="max-h-[40px] overflow-hidden">
              <Skeleton width="100%">
                {Array.from({ length: 100 }).map((_, index) => "A ")}
              </Skeleton>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );

  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Flex key={index} direction="column" gap="5">
          <Text size="3" weight="bold">
            {index === 0 ? "Today" : <Skeleton>Thu, Jun 19, 2025</Skeleton>}
          </Text>

          <Flex direction="column" gap="4">
            {/* Today section gets the new standup form */}
            {index === 0 && <TodayStandupNewSkeleton />}

            {/* All sections get standup cards in single column */}
            {Array.from({
              length: index === 0 ? collaboratorsCount - 1 : collaboratorsCount,
            }).map((_, cardIndex) => (
              <div key={cardIndex}>{card}</div>
            ))}
          </Flex>
        </Flex>
      ))}
    </>
  );
}

function GridSkeleton({ collaboratorsCount }: { collaboratorsCount: number }) {
  const isSharedBoard = collaboratorsCount > 1;

  const card = (
    <Card
      variant="surface"
      size={{
        initial: "3",
        sm: "4",
      }}
      style={{ alignSelf: "start" }}
    >
      <Flex direction="column" gap="5" align="start">
        <Text size="4" weight="bold">
          <Skeleton>username</Skeleton>
        </Text>
        <Flex direction="column" gap="2">
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              <Skeleton>What did you do yesterday?</Skeleton>
            </Text>
            <Text size="2" className="max-h-[40px] overflow-hidden">
              <Skeleton width="100%">
                {Array.from({ length: 100 }).map((_, index) => "A ")}
              </Skeleton>
            </Text>
          </Flex>
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              <Skeleton>What will you do today?</Skeleton>
            </Text>
            <Text size="2" className="max-h-[40px] overflow-hidden">
              <Skeleton width="100%">
                {Array.from({ length: 100 }).map((_, index) => "A ")}
              </Skeleton>
            </Text>
          </Flex>
          <Flex direction="column" gap="2">
            <Text size="2" weight="medium">
              <Skeleton>Do you have any blockers?</Skeleton>
            </Text>
            <Text size="2" className="max-h-[40px] overflow-hidden">
              <Skeleton width="100%">
                {Array.from({ length: 100 }).map((_, index) => "A ")}
              </Skeleton>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );

  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Flex key={index} direction="column" gap="5">
          <Text size="3" weight="bold">
            {index === 0 ? "Today" : <Skeleton>Thu, Jun 19, 2025</Skeleton>}
          </Text>
          <RadixGrid
            columns={{
              initial: "1",
              sm: `repeat(auto-fill, minmax(${
                isSharedBoard ? getCardWidth("medium") : "100%"
              }, 1fr))`,
            }}
            gap="5"
          >
            {index === 0 && <TodayStandupNewSkeleton />}
            {index !== 0 && (
              <>
                {/* TODO: if it's shared board, put multiple cards */}
                {isSharedBoard ? (
                  <>
                    {card}
                    {card}
                    {card}
                  </>
                ) : (
                  <>{card}</>
                )}
              </>
            )}
          </RadixGrid>
        </Flex>
      ))}
    </>
  );
}

function Feed({
  currentUserTodayStandupCard,
  standups,
  standupForms,
  boardTimezone,
  collaborators,
  currentUser,
}: {
  currentUserTodayStandupCard: React.ReactNode;
  standups: Standup[];
  standupForms: StandupForm[];
  boardTimezone: Board["timezone"];
  collaborators: Collaborator[];
  currentUser: User | null;
}) {
  const { appearance } = useThemeContext();

  const today = DateTime.now().setZone(boardTimezone).startOf("day");

  // Group all standups by date
  const groupedStandups = standups.reduce<Map<string, Standup[]>>(
    (grouped, standup) => {
      const standupDate = DateTime.fromISO(standup.createdAt, { zone: "utc" })
        .setZone(boardTimezone)
        .startOf("day");

      const key = standupDate.equals(today) ? "today" : standupDate.toISODate();

      if (!key) {
        return grouped;
      }

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key)?.push(standup);

      return grouped;
    },
    new Map<string, Standup[]>()
  );

  // Always ensure "today" group exists when there's a current user
  if (currentUser && !groupedStandups.has("today")) {
    groupedStandups.set("today", []);
  }

  // Sort groups with today first, then by date descending
  const sortedGroups = Array.from(groupedStandups.entries()).sort((a, b) => {
    if (a[0] === "today") return -1;
    if (b[0] === "today") return 1;

    return DateTime.fromISO(b[0], { zone: "utc" })
      .setZone(boardTimezone)
      .diff(DateTime.fromISO(a[0], { zone: "utc" }).setZone(boardTimezone))
      .toMillis();
  });

  if (sortedGroups.length === 0) {
    return (
      <Flex direction="column" gap="5">
        <Box>
          <Text size="3" weight="bold">
            Standups
          </Text>
        </Box>
        <Card
          size={{
            initial: "3",
            sm: "4",
          }}
        >
          <Flex
            direction="column"
            justify="center"
            align="center"
            gap="2"
            py="128px"
            maxWidth="360px"
            mx="auto"
          >
            <Text weight="medium" size="2">
              No standups yet
            </Text>
            <Text size="2" align="center">
              Start by submitting your first standup update.
            </Text>
          </Flex>
        </Card>
      </Flex>
    );
  }

  return (
    <>
      {sortedGroups.map(([dateKey, standups]) => {
        const isToday = dateKey === "today";
        const dateLabel = isToday
          ? "Today"
          : DateTime.fromISO(dateKey, { zone: "utc" })
              .setZone(boardTimezone)
              .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

        let otherStandups = standups;

        if (isToday && currentUser) {
          otherStandups = standups.filter(
            (standup) => standup.userId !== currentUser.id
          );
        }

        return (
          <Flex direction="column" gap="5" key={dateKey}>
            <Text size="3" weight="bold">
              {dateLabel}
            </Text>

            <Flex direction="column" gap="4">
              {/* For today, show the TodayStandupNew component first */}
              {isToday && currentUser && currentUserTodayStandupCard}

              {/* Show all other standups in single column */}
              {otherStandups.map((standup) => {
                const form = standupForms.find(
                  (form) => form.id === standup.formId
                );

                const schema = validateDynamicFormSchema(form?.schema);

                if (!schema) {
                  return null;
                }

                const user = collaborators.find(
                  (collaborator) => collaborator.userId === standup.userId
                )?.user;

                if (!user) {
                  return null;
                }

                return (
                  <Card
                    key={standup.id}
                    variant="surface"
                    size={{
                      initial: "3",
                      sm: "4",
                    }}
                  >
                    <Flex direction="column" gap="5" align="start">
                      <Tooltip
                        content={
                          <Flex direction="column" gap="1">
                            <Text size="2">{user.primary_email}</Text>
                            <Text size="2">
                              Last saved at{" "}
                              {DateTime.fromISO(standup.createdAt, {
                                zone: "utc",
                              })
                                .setZone(boardTimezone)
                                .toLocaleString(DateTime.DATETIME_MED)}{" "}
                              ({boardTimezone})
                            </Text>
                          </Flex>
                        }
                      >
                        <Text size="4" weight="bold">
                          {user.primary_email.split("@")[0]}
                        </Text>
                      </Tooltip>
                      {schema.fields.map((field) => {
                        const value = (
                          standup.formData as Standup["formData"] as DynamicFormValues
                        )[field.name];

                        if (!value) {
                          return null;
                        }

                        const html = parseMarkdownToHtml(value);

                        return (
                          <Flex key={field.name} direction="column" gap="2">
                            <Text size="2" weight="medium">
                              {field.label}
                            </Text>
                            <Box
                              className={`prose prose-sm ${
                                appearance === "dark" ? "dark:prose-invert" : ""
                              }`}
                              dangerouslySetInnerHTML={{ __html: html }}
                            />
                          </Flex>
                        );
                      })}
                    </Flex>
                  </Card>
                );
              })}
            </Flex>
          </Flex>
        );
      })}
    </>
  );
}

function Grid({
  currentUserTodayStandupCard,
  standups,
  standupForms,
  boardTimezone,
  collaborators,
  currentUser,
}: {
  currentUserTodayStandupCard: React.ReactNode;
  standups: Standup[];
  standupForms: StandupForm[];
  boardTimezone: Board["timezone"];
  collaborators: Collaborator[];
  currentUser: User | null;
}) {
  const { appearance } = useThemeContext();
  const { viewSettings: gridSettings } = useGridViewSettings();

  const today = DateTime.now().setZone(boardTimezone).startOf("day");

  // Group all standups by date
  const groupedStandups = standups.reduce<Map<string, Standup[]>>(
    (grouped, standup) => {
      const standupDate = DateTime.fromISO(standup.createdAt, { zone: "utc" })
        .setZone(boardTimezone)
        .startOf("day");

      const key = standupDate.equals(today) ? "today" : standupDate.toISODate();

      if (!key) {
        return grouped;
      }

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key)?.push(standup);

      return grouped;
    },
    new Map<string, Standup[]>()
  );

  // Always ensure "today" group exists when there's a current user
  if (currentUser && !groupedStandups.has("today")) {
    groupedStandups.set("today", []);
  }

  // Sort groups with today first, then by date descending
  const sortedGroups = Array.from(groupedStandups.entries()).sort((a, b) => {
    if (a[0] === "today") return -1;
    if (b[0] === "today") return 1;

    return DateTime.fromISO(b[0], { zone: "utc" })
      .setZone(boardTimezone)
      .diff(DateTime.fromISO(a[0], { zone: "utc" }).setZone(boardTimezone))
      .toMillis();
  });

  if (sortedGroups.length === 0) {
    return (
      <Flex direction="column" gap="5">
        <Box>
          <Text size="3" weight="bold">
            Standups
          </Text>
        </Box>
        <Card
          size={{
            initial: "3",
            sm: "4",
          }}
        >
          <Flex
            direction="column"
            justify="center"
            align="center"
            gap="2"
            py="128px"
            maxWidth="360px"
            mx="auto"
          >
            <Text weight="medium" size="2">
              No standups yet
            </Text>
            <Text size="2" align="center">
              Start by submitting your first standup update.
            </Text>
          </Flex>
        </Card>
      </Flex>
    );
  }

  return (
    <>
      {sortedGroups.map(([dateKey, standups]) => {
        const isToday = dateKey === "today";
        const dateLabel = isToday
          ? "Today"
          : DateTime.fromISO(dateKey, { zone: "utc" })
              .setZone(boardTimezone)
              .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

        let otherStandups = standups;

        if (isToday && currentUser) {
          otherStandups = standups.filter(
            (standup) => standup.userId !== currentUser.id
          );
        }

        return (
          <Flex direction="column" gap="5" key={dateKey}>
            <Text size="3" weight="bold">
              {dateLabel}
            </Text>

            <RadixGrid
              columns={{
                initial: "1",
                sm: `repeat(auto-fill, minmax(${getCardWidth(
                  gridSettings.cardSize
                )}, 1fr))`,
              }}
              gap="4"
            >
              {/* For today, show the TodayStandupNew component first */}
              {isToday && currentUser && currentUserTodayStandupCard}

              {/* Show all other standups */}
              {otherStandups.map((standup) => {
                const form = standupForms.find(
                  (form) => form.id === standup.formId
                );

                const schema = validateDynamicFormSchema(form?.schema);

                if (!schema) {
                  return null;
                }

                const user = collaborators.find(
                  (collaborator) => collaborator.userId === standup.userId
                )?.user;

                if (!user) {
                  return null;
                }

                return (
                  <Card
                    key={standup.id}
                    variant="surface"
                    size={{
                      initial: "3",
                      sm: "4",
                    }}
                    style={{ alignSelf: "start" }}
                  >
                    <Flex direction="column" gap="5" align="start">
                      <Tooltip
                        content={
                          <Flex direction="column" gap="1">
                            <Text size="2">{user.primary_email}</Text>
                            <Text size="2">
                              Last saved at{" "}
                              {DateTime.fromISO(standup.createdAt, {
                                zone: "utc",
                              })
                                .setZone(boardTimezone)
                                .toLocaleString(DateTime.DATETIME_MED)}{" "}
                              ({boardTimezone})
                            </Text>
                          </Flex>
                        }
                      >
                        <Text size="4" weight="bold">
                          {user.primary_email.split("@")[0]}
                        </Text>
                      </Tooltip>
                      {schema.fields.map((field) => {
                        const value = (
                          standup.formData as Standup["formData"] as DynamicFormValues
                        )[field.name];

                        if (!value) {
                          return null;
                        }

                        const html = parseMarkdownToHtml(value);

                        return (
                          <Flex key={field.name} direction="column" gap="2">
                            <Text size="2" weight="medium">
                              {field.label}
                            </Text>
                            <Box
                              className={`prose prose-sm ${
                                appearance === "dark" ? "dark:prose-invert" : ""
                              }`}
                              dangerouslySetInnerHTML={{ __html: html }}
                            />
                          </Flex>
                        );
                      })}
                    </Flex>
                  </Card>
                );
              })}
            </RadixGrid>
          </Flex>
        );
      })}
    </>
  );
}

function Resolver({
  children,
}: {
  children: (data: {
    currentUser: User | null;
    boardTimezone: Board["timezone"];
    standups: Standup[];
    standupForms: StandupForm[];
    collaborators: Collaborator[];
  }) => React.ReactNode;
}) {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const { collaboratorsCount } = useLoaderData<typeof loader>();
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);
  const {
    standupsPromise,
    standupFormsPromise,
    collaboratorsPromise,
    boardTimezonePromise,
  } = useLoaderData<typeof loader>();

  // TODO: Work on the fallback ui after saving the view settings on the server side
  const fallbackUI = useMemo(() => {
    if (collaboratorsCount === 0) {
      return <FeedSkeleton collaboratorsCount={collaboratorsCount ?? 0} />;
    }

    return <GridSkeleton collaboratorsCount={collaboratorsCount ?? 0} />;
  }, [collaboratorsCount]);

  return (
    <Suspense fallback={fallbackUI}>
      <Await
        resolve={useMemo(() => {
          return Promise.all([
            currentUserPromise,
            boardTimezonePromise,
            standupsPromise,
            standupFormsPromise,
            collaboratorsPromise,
          ]);
        }, [
          currentUserPromise,
          boardTimezonePromise,
          standupsPromise,
          standupFormsPromise,
          collaboratorsPromise,
        ])}
      >
        {([
          currentUser,
          boardTimezone,
          standups,
          standupForms,
          collaborators,
        ]) => {
          if (
            !currentUser ||
            !boardTimezone ||
            !standups ||
            !standupForms ||
            !collaborators
          ) {
            return fallbackUI;
          }

          return children({
            currentUser,
            boardTimezone,
            standups,
            standupForms,
            collaborators,
          });
        }}
      </Await>
    </Suspense>
  );
}

function Switcher({
  feed,
  grid,
}: {
  feed: React.ReactNode;
  grid: React.ReactNode;
}) {
  const { viewSettings } = useViewSettings();

  switch (viewSettings.viewType) {
    case "feed":
      return feed;
    case "grid":
      return grid;
  }
}

function View() {
  const currentUserTodayStandupCard = useMemo(
    () => <CurrentUserStandupCard />,
    []
  );

  return (
    <Resolver>
      {({
        currentUser,
        boardTimezone,
        standups,
        standupForms,
        collaborators,
      }) => {
        // TODO: Optimize rendering of currentUserTodayStandupCard. When view changes, it should not re-render.
        return (
          <Switcher
            feed={
              <Feed
                currentUser={currentUser}
                boardTimezone={boardTimezone}
                standups={standups}
                standupForms={standupForms}
                collaborators={collaborators}
                currentUserTodayStandupCard={currentUserTodayStandupCard}
              />
            }
            grid={
              <Grid
                currentUser={currentUser}
                boardTimezone={boardTimezone}
                standups={standups}
                standupForms={standupForms}
                collaborators={collaborators}
                currentUserTodayStandupCard={currentUserTodayStandupCard}
              />
            }
          />
        );
      }}
    </Resolver>
  );
}

export default View;
