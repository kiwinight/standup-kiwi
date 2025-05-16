import { Share1Icon, GearIcon } from "@radix-ui/react-icons";
import { Flex, Skeleton, Button, Text } from "@radix-ui/themes";
import { Suspense, use } from "react";
import { Link, useLoaderData, useParams } from "react-router";
import type { loader } from "./board-route";

function BoardName() {
  const { boardPromise } = useLoaderData<typeof loader>();

  const board = use(boardPromise);

  if (!board) {
    return <Skeleton>Sample name</Skeleton>;
  }

  return <>{board.name}</>;
}

type Props = {};

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
      <Text size="6" weight="bold">
        <Suspense fallback={<Skeleton>Sample name</Skeleton>}>
          <BoardName />
        </Suspense>
      </Text>

      <Flex
        gap="5"
        mt={{
          initial: "4",
          sm: "0",
        }}
      >
        <Button asChild variant="ghost" highContrast>
          <Link to={`/boards/${boardId}/settings/sharing`}>
            <Share1Icon />
            Share
          </Link>
        </Button>

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
