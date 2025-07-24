import { Flex, Skeleton, Text } from "@radix-ui/themes";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import type { loader } from "./board-route";

function BoardNameUI({ name }: { name: string | null }) {
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

function BoardNameDataResolver({
  children,
  fallback,
}: {
  children: (data: { name: string | null }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { boardNamePromise } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={boardNamePromise}>
        {(name) => {
          return children({ name });
        }}
      </Await>
    </Suspense>
  );
}

function BoardName() {
  return (
    <BoardNameDataResolver fallback={<BoardNameSkeleton />}>
      {({ name }) => {
        return <BoardNameUI name={name} />;
      }}
    </BoardNameDataResolver>
  );
}

export default BoardName;
