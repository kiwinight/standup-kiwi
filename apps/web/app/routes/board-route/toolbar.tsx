import { Share1Icon, GearIcon } from "@radix-ui/react-icons";
import { Flex, Skeleton, Button, Text } from "@radix-ui/themes";
import React, { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import type { loader } from "./board-route";

type Props = {};

function Toolbar({}: Props) {
  const { boardDataPromise } = useLoaderData<typeof loader>();

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
          <Await resolve={boardDataPromise}>
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
        <Button variant="ghost" highContrast>
          <Share1Icon />
          Share
        </Button>
        <Button variant="ghost" highContrast>
          <GearIcon />
          Settings
        </Button>
      </Flex>
    </Flex>
  );
}

export default Toolbar;
