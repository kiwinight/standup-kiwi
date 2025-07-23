import { Card, Flex, Skeleton, Text } from "@radix-ui/themes";
import { TodayStandupNewSkeleton } from "./current-user-standup-card";
import type { Standup, StandupForm, Board, Collaborator, User } from "types";
import { useThemeContext } from "@radix-ui/themes";
import { useMemo } from "react";
import { DateTime } from "luxon";
import useGroupedStandups from "./use-grouped-standups";
import StandupCard from "./standup-card";
import CurrentUserStandupCard from "./current-user-standup-card";
import { ViewDataResolver } from "./view";
import { useLoaderData } from "react-router";
import type { loader } from "./board-route";

function FeedViewSkeleton({
  collaboratorsCount,
}: {
  collaboratorsCount: number;
}) {
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

function FeedViewUI({
  standups,
  standupForms,
  boardTimezone,
  collaborators,
  currentUser,
}: {
  standups: Standup[];
  standupForms: StandupForm[];
  boardTimezone: Board["timezone"];
  collaborators: Collaborator[];
  currentUser: User | null;
}) {
  const { appearance } = useThemeContext();

  const { groups } = useGroupedStandups({
    standups,
    timezone: boardTimezone,
  });

  const isEmptyBoard = standups.length === 0;

  const standupFormsMap = useMemo(
    () => new Map(standupForms.map((form) => [form.id, form])),
    [standupForms]
  );

  const usersMap = useMemo(
    () =>
      new Map(
        collaborators.map((collaborator) => [
          collaborator.userId,
          collaborator.user,
        ])
      ),
    [collaborators]
  );

  const nontodayGroups = groups.filter(([dateKey]) => dateKey !== "today");

  return (
    <>
      {groups.map(([dateKey, groupStandups]) => {
        const isToday = dateKey === "today";
        const dateLabel = isToday
          ? "Today"
          : DateTime.fromISO(dateKey, { zone: "utc" })
              .setZone(boardTimezone)
              .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

        if (isToday && currentUser) {
          groupStandups = groupStandups.filter(
            (standup) => standup.userId !== currentUser.id
          );
        }

        return (
          <Flex direction="column" gap="5" key={dateKey}>
            <Text size="3" weight="bold">
              {dateLabel}
            </Text>

            <Flex direction="column" gap="4">
              {/* NOTE: This was UI prototyping */}
              {/* {isToday &&
                groupStandups.length === 0 &&
                collaborators.length > 1 &&
                groupStandups.length === 0 && (
                  <Callout.Root
                    size="2"
                    variant="surface"
                    style={{
                      gridRow: "1",
                      gridColumn: "span 1",
                      backgroundColor: "var(--color-panel-translucent)",
                      ...(appearance === "dark"
                        ? {
                            boxShadow: "inset 0 0 0 1px var(--accent-a4)",
                          }
                        : {}),
                    }}
                  >
                    <Callout.Icon>
                      <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text>
                      Be the first to share an update for today.
                    </Callout.Text>
                  </Callout.Root>
                )} */}

              {isToday && currentUser && (
                <CurrentUserStandupCard key="current-user-standup-card" />
              )}

              {/* Show all other standups in single column */}
              {groupStandups.map((standup) => {
                const user = usersMap.get(standup.userId);

                if (!user) {
                  return null;
                }

                return (
                  <StandupCard
                    key={standup.id}
                    standup={standup}
                    standupForm={standupFormsMap.get(standup.formId)}
                    user={user}
                    boardTimezone={boardTimezone}
                  />
                );
              })}
            </Flex>
          </Flex>
        );
      })}
      {/* TODO: UI experiment */}
      {/* {isEmptyBoard && (
        <Flex direction="column" gap="5">
          <Box>
            <Text size="3" weight="bold">
              Past standups
            </Text>
          </Box>
          <Flex direction="column" gap="4">
            <Flex
              style={{
                border:
                  appearance === "dark"
                    ? "1px solid var(--accent-a4)"
                    : "1px solid var(--accent-a6)",
                backgroundColor: "var(--color-panel-translucent)",
                borderRadius: "var(--radius-3)",
              }}
              py="240px"
              gridColumn="1 / -1"
            >
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap="2"
                maxWidth="360px"
                mx="auto"
              >
                <Text className="font-semibold" size="2">
                  No past standups yet
                </Text>
                <Text size="2" align="center" color="gray">
                  Start by submitting standup updates. This board's past
                  standups will appear in this area.
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )} */}
    </>
  );
}

function FeedView() {
  const { collaboratorsCount } = useLoaderData<typeof loader>();
  return (
    <ViewDataResolver
      fallback={
        <FeedViewSkeleton collaboratorsCount={collaboratorsCount ?? 0} />
      }
    >
      {({
        currentUser,
        boardTimezone,
        standups,
        standupForms,
        collaborators,
      }) => {
        return (
          <FeedViewUI
            currentUser={currentUser}
            boardTimezone={boardTimezone}
            standups={standups}
            standupForms={standupForms}
            collaborators={collaborators}
          />
        );
      }}
    </ViewDataResolver>
  );
}

export default FeedView;
