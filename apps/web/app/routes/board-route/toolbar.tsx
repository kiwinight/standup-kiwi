import { Share1Icon, GearIcon } from "@radix-ui/react-icons";
import { Flex, Skeleton, Button, Text, Tooltip } from "@radix-ui/themes";
import React, { Suspense } from "react";
import { Await, Link, useLoaderData, useParams } from "react-router";
import type { loader } from "./board-route";

type Props = {};

function Toolbar({}: Props) {
  const { boardPromise } = useLoaderData<typeof loader>();

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
          <Await resolve={boardPromise}>
            {(data) => {
              return <>{data.name}</>;
            }}
          </Await>
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
