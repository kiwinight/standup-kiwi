import {
  GearIcon,
  EnvelopeClosedIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { Flex, Button, Text, Popover, Select } from "@radix-ui/themes";
import { Link, useLoaderData, useParams } from "react-router";
import {
  useBoardGridViewSettings,
  type GridWidth,
  type CardSize,
} from "~/hooks/use-board-grid-view-settings";
import { useBoardViewSettings } from "~/hooks/use-board-view-settings";
import type { ViewType } from "types";
import BoardName from "./board-name";
import type { loader } from "./board-route";

type Props = {};

function ViewTypeSetting() {
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
  const { width, cardSize, updateWidth, updateCardSize, isSharedBoard } =
    useBoardGridViewSettings(parseInt(boardId!, 10));

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

function ViewSettings() {
  const { boardId } = useParams();
  const { viewType } = useBoardViewSettings(parseInt(boardId!, 10));
  const { collaboratorsCount } = useLoaderData<typeof loader>();

  if (!collaboratorsCount || collaboratorsCount <= 1) {
    return null;
  }

  return (
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

          <ViewTypeSetting />
          {viewType === "grid" && <GridViewSettings />}
        </Flex>
      </Popover.Content>
    </Popover.Root>
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
      <BoardName />

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

        <ViewSettings />

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
