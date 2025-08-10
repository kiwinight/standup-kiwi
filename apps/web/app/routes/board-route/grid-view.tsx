import { useLoaderData, useParams } from "react-router";
import { useMemo } from "react";
import {
  Card,
  Flex,
  Grid as RadixGrid,
  Skeleton,
  Text,
  useThemeContext,
} from "@radix-ui/themes";
import { DateTime } from "luxon";
import type { Board, Standup, StandupForm, Collaborator, User } from "types";
import CurrentUserStandupCard, {
  TodayStandupNewSkeleton,
} from "./current-user-standup-card";
import {
  useBoardGridViewSettings,
  type CardSize,
} from "~/hooks/use-board-grid-view-settings";
import StandupCard from "./standup-card";
import useGroupedStandups from "./use-grouped-standups";
import { ViewDataResolver } from "./view";
import type { loader } from "./board-route";

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

function GridViewSkeleton({
  collaboratorsCount,
}: {
  collaboratorsCount: number;
}) {
  const { boardId } = useParams();
  const { cardSize } = useBoardGridViewSettings(parseInt(boardId!, 10));
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
                isSharedBoard ? getCardWidth(cardSize) : "100%"
              }, 1fr))`,
            }}
            gap="4"
          >
            {index === 0 && <TodayStandupNewSkeleton />}
            {index !== 0 && (
              <>
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

function GridViewUI({
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
  const { boardId } = useParams();
  const { cardSize } = useBoardGridViewSettings(parseInt(boardId!, 10));

  const isEmptyBoard = standups.length === 0;

  const { groups } = useGroupedStandups({
    standups,
    timezone: boardTimezone,
  });

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

  const todayGroupStandups =
    groups.find(([dateKey]) => dateKey === "today")?.[1] ?? [];
  const nontodayGroups = groups.filter(([dateKey]) => dateKey !== "today");

  const showNoPastStandupsPlaceholder =
    todayGroupStandups.length === 0 && nontodayGroups.length === 0;

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

        const showCalloutForNoStandupsToday =
          isToday &&
          isEmptyBoard &&
          collaborators.length > 1 &&
          groupStandups.length === 0;

        return (
          <Flex direction="column" gap="5" key={dateKey}>
            <Flex align="center" gap="2">
              <Text size="3" weight="bold">
                {dateLabel}
              </Text>
              {/* TODO: Display submitted users for today */}
              {/* {isToday && (
                <Flex align="center" gap="">
                  {groupStandups.map((standup) => {
                    const user = collaborators.find(
                      (collaborator) => collaborator.userId === standup.userId
                    )?.user;

                    if (!user) {
                      return null;
                    }

                    return (
                      <Tooltip content={user.primary_email}>
                        <Avatar
                          radius="full"
                          fallback={user?.primary_email.split("@")[0]}
                          size="1"
                        />
                      </Tooltip>
                    );
                  })}
                </Flex>
              )} */}
            </Flex>

            <RadixGrid
              columns={{
                initial: "1",
                sm: `repeat(auto-fill, minmax(${getCardWidth(cardSize)}, 1fr))`,
              }}
              gap="4"
            >
              {/* NOTE: This was UI prototyping */}
              {/* {showCalloutForNoStandupsToday && (
                <>
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
                  <Box style={{ gridColumn: "2 / -1" }}></Box>
                </>
              )} */}

              {isToday && currentUser && <CurrentUserStandupCard />}

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
                    style={{ alignSelf: "start" }}
                  />
                );
              })}
            </RadixGrid>
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
          <RadixGrid
            columns={{
              initial: "1",
              sm: `repeat(auto-fill, minmax(${getCardWidth(
                gridSettings.cardSize
              )}, 1fr))`,
            }}
            gap="4"
          >
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
          </RadixGrid>
        </Flex>
      )} */}
    </>
  );
}

function GridView() {
  const { collaboratorsCount } = useLoaderData<typeof loader>();
  return (
    <ViewDataResolver
      fallback={
        <GridViewSkeleton collaboratorsCount={collaboratorsCount ?? 0} />
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
          <GridViewUI
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

export default GridView;
