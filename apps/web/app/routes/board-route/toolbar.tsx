import {
  GearIcon,
  EnvelopeClosedIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  Flex,
  Skeleton,
  Button,
  Text,
  Popover,
  Select,
} from "@radix-ui/themes";
import { Suspense } from "react";
import { Await, Link, useLoaderData, useParams } from "react-router";
import type { loader } from "./board-route";
import {
  useBoardGridViewSettings,
  type GridWidth,
  type CardSize,
} from "~/hooks/use-board-grid-view-settings";
import { useBoardViewSettings } from "~/hooks/use-board-view-settings";
import type { ViewType } from "types";

function BoardName({ name }: { name: string | null }) {
  if (!name) {
    return <Skeleton>Sample name</Skeleton>;
  }

  return (
    <Text size="6" weight="bold">
      {name}
    </Text>
  );
}

function BoardNameSkeleton() {
  return (
    <Flex direction="column" gap="2">
      <Skeleton>
        <Text size="6" weight="bold">
          Sample board name
        </Text>
      </Skeleton>
    </Flex>
  );
}

function BoardNameResolver() {
  const { boardNamePromise } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<BoardNameSkeleton />}>
      <Await resolve={boardNamePromise}>
        {(name) => {
          return <BoardName name={name} />;
        }}
      </Await>
    </Suspense>
  );
}

type Props = {};

function ViewTypeSelector() {
  const { boardId } = useParams();
  const { viewType, updateViewType, allowedViewTypes, isPersonalBoard } =
    useBoardViewSettings(parseInt(boardId!, 10));

  return (
    <Flex direction="column" gap="2">
      <Text className="font-semibold" size="2">
        View
      </Text>
      <Select.Root
        value={viewType}
        disabled={isPersonalBoard}
        onValueChange={(value) => {
          if (!isPersonalBoard) {
            updateViewType(value as ViewType);
          }
        }}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            {allowedViewTypes.includes("feed") && (
              <Select.Item value="feed">Feed</Select.Item>
            )}
            {allowedViewTypes.includes("grid") && (
              <Select.Item value="grid">Grid</Select.Item>
            )}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
}

function GridViewSettings() {
  const { boardId } = useParams();
  const { collaboratorsCount } = useLoaderData<typeof loader>();
  const { viewType } = useBoardViewSettings(parseInt(boardId!, 10));
  const { width, cardSize, updateWidth, updateCardSize, isSharedBoard } =
    useBoardGridViewSettings(parseInt(boardId!, 10));

  // Only show grid settings when in grid view
  if (viewType !== "grid") {
    return null;
  }

  return (
    <>
      {isSharedBoard && (
        <Flex direction="column" gap="2">
          <Text className="font-semibold" size="2">
            Width
          </Text>
          <Select.Root
            value={width}
            onValueChange={(value) => updateWidth(value as GridWidth)}
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Item value="medium">Medium</Select.Item>
                <Select.Item value="wide">Wide</Select.Item>
                <Select.Item value="full">Full</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Flex>
      )}
      {isSharedBoard && (
        <Flex direction="column" gap="2">
          <Text className="font-semibold" size="2">
            Card size
          </Text>
          <Select.Root
            value={cardSize}
            onValueChange={(value) => updateCardSize(value as CardSize)}
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Item value="small">Small</Select.Item>
                <Select.Item value="medium">Medium</Select.Item>
                <Select.Item value="large">Large</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Flex>
      )}
    </>
  );
}

function Toolbar({}: Props) {
  const { boardId } = useParams();

  return (
    <Flex
      justify="between"
      align={{
        initial: "start",
        sm: "center",
      }}
      direction={{
        initial: "column",
        sm: "row",
      }}
    >
      <BoardNameResolver />

      <Flex
        gap="5"
        mt={{
          initial: "4",
          sm: "0",
        }}
      >
        <Button asChild variant="ghost" highContrast>
          <Link to={`/boards/${boardId}/settings/collaborators`}>
            <EnvelopeClosedIcon />
            Invite
          </Link>
        </Button>

        <Popover.Root>
          <Popover.Trigger suppressHydrationWarning>
            <Button variant="ghost" highContrast>
              <MixerHorizontalIcon />
              View
            </Button>
          </Popover.Trigger>
          <Popover.Content width="320px" size="3">
            <Flex direction="column" gap="5">
              <Text className="font-semibold" size="4">
                View settings
              </Text>

              <ViewTypeSelector />
              <GridViewSettings />
            </Flex>
          </Popover.Content>
        </Popover.Root>

        <Button asChild variant="ghost" highContrast>
          <Link to={`/boards/${boardId}/settings`}>
            <GearIcon />
            Settings
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
}

export default Toolbar;
