import { Suspense } from "react";
import type { Route } from "./+types/board-layout-route";
import { Await, Link, useLoaderData } from "react-router";
import { useParams } from "react-router";
import { ListBulletIcon, PlusIcon, PersonIcon } from "@radix-ui/react-icons";
import { Flex, DropdownMenu, Button, Skeleton, Text } from "@radix-ui/themes";
import KiwinightSymbol from "~/components/kiwinight-symbol";

function NavBar() {
  const { currentUserBoardsDataPromise, currentUserDataPromise } =
    useLoaderData<Route.ComponentProps["loaderData"]>();

  const { boardId } = useParams();

  return (
    <Flex
      className="h-[56px] px-4 z-10 bg-[var(--color-background)]"
      justify="start"
      align="center"
      position="sticky"
      top="0"
    >
      <Flex gap="4" align="center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button
              variant="soft"
              highContrast
              size="2"
              radius="medium"
              className="!pl-[8px] !pr-[8px]"
            >
              <ListBulletIcon fontSize={24} width={16} height={16} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <Link to="/boards/create">
              <DropdownMenu.Item>
                <PlusIcon /> Create a new board
              </DropdownMenu.Item>
            </Link>

            <Suspense
              fallback={
                <>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Label>Boards</DropdownMenu.Label>
                  <DropdownMenu.Item>
                    <Text>
                      <Skeleton>Example</Skeleton>
                    </Text>
                  </DropdownMenu.Item>
                </>
              }
            >
              <Await resolve={currentUserBoardsDataPromise}>
                {(data) => {
                  const sharedBoards = data.filter(
                    (board) => board.usersCount > 1
                  );
                  const personalBoards = data.filter(
                    (board) => board.usersCount === 1
                  );

                  return (
                    <>
                      {personalBoards.length > 0 && (
                        <>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Label>Boards</DropdownMenu.Label>
                          {personalBoards.map((board) => {
                            const isActive = boardId
                              ? parseInt(boardId, 10) === board.id
                              : false;
                            return (
                              <Link key={board.id} to={`/boards/${board.id}`}>
                                <DropdownMenu.Item
                                  className={
                                    isActive ? "[&]:bg-[var(--accent-a3)]" : ""
                                  }
                                >
                                  <Text
                                  // weight={isActive ? "medium" : "regular"}
                                  >
                                    {board.name}
                                  </Text>
                                </DropdownMenu.Item>
                              </Link>
                            );
                          })}
                          {sharedBoards.length > 0 && (
                            <>
                              <DropdownMenu.Separator />

                              <DropdownMenu.Label>
                                Shared boards
                              </DropdownMenu.Label>

                              {sharedBoards.map((board) => {
                                const isActive = boardId
                                  ? parseInt(boardId, 10) === board.id
                                  : false;
                                return (
                                  <Link
                                    key={board.id}
                                    to={`/boards/${board.id}`}
                                  >
                                    <DropdownMenu.Item
                                      className={
                                        isActive ? "!bg-[var(--accent-a3)]" : ""
                                      }
                                    >
                                      <Text
                                      // weight={isActive ? "medium" : "regular"}
                                      >
                                        {board.name}
                                      </Text>
                                    </DropdownMenu.Item>
                                  </Link>
                                );
                              })}
                            </>
                          )}
                        </>
                      )}
                    </>
                  );
                }}
              </Await>
            </Suspense>

            <DropdownMenu.Separator />
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>Theme</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item
                  onClick={() => {
                    alert("Not implemented!");
                  }}
                >
                  Light
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => {
                    alert("Not implemented!");
                  }}
                >
                  Dark
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => {
                    alert("Not implemented!");
                  }}
                >
                  System
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>
                <PersonIcon />
                <Text size="2">
                  <Suspense fallback={<Skeleton>Loading</Skeleton>}>
                    <Await resolve={currentUserDataPromise}>
                      {(data) => {
                        return <>{data.primary_email}</>;
                      }}
                    </Await>
                  </Suspense>
                </Text>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item
                  onClick={() => {
                    alert("Not implemented!");
                  }}
                >
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  color="red"
                  onClick={() => {
                    alert("Not implemented!");
                  }}
                >
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <Flex gap="2">
          <KiwinightSymbol width={24} height={24} />
          <Text size="3" weight="bold" className="!tracking-tight">
            Kiwi Standup
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default NavBar;
