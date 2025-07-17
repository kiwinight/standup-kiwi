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
  useGridViewSettings,
  type GridWidth,
  type CardSize,
} from "~/context/GridViewSettingsContext";

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

function GridViewSettings() {
  const { collaboratorsCount } = useLoaderData<typeof loader>();

  const { viewSettings, updateViewSettings } = useGridViewSettings();

  const isSharedBoard = collaboratorsCount ? collaboratorsCount > 1 : false;

  return (
    <>
      {isSharedBoard && (
        <Flex direction="column" gap="2">
          <Text className="font-semibold" size="2">
            Width
          </Text>
          <Select.Root
            value={viewSettings.width}
            onValueChange={(value) =>
              updateViewSettings({ width: value as GridWidth })
            }
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Item value="narrow">Narrow</Select.Item>
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
            value={viewSettings.cardSize}
            onValueChange={(value) =>
              updateViewSettings({ cardSize: value as CardSize })
            }
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Item value="small">Small</Select.Item>
                <Select.Item value="medium">Medium</Select.Item>
                <Select.Item value="large">Large</Select.Item>
                <Select.Item value="auto">Auto</Select.Item>
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
          <Popover.Trigger>
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

              <Flex direction="column" gap="2">
                <Text className="font-semibold" size="2">
                  View
                </Text>
                <Select.Root
                  value={"grid"}
                  disabled
                  onValueChange={(value) => {
                    // TODO: Support view change
                    console.log("view change", value);
                  }}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Group>
                      <Select.Item value="grid">Grid</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </Flex>
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
