import { Await, Link, Outlet, useLoaderData, useParams } from "react-router";
import {
  Box,
  Button,
  DropdownMenu,
  Flex,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { ListBulletIcon, PersonIcon, PlusIcon } from "@radix-ui/react-icons";
import KiwinightSymbol from "~/components/kiwinight-symbol";
import type { Route } from "./+types/board-layout";
import { getSession } from "~/sessions.server";
import type { Board } from "types";
import { Suspense } from "react";

function NavBar() {
  const { currentUserBoardsPromise, currentUserPromise } =
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

            {/* {personalBoards.length > 0 && (
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
                        className={isActive ? "[&]:bg-[var(--accent-a3)]" : ""}
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
            )} */}

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
              <Await resolve={currentUserBoardsPromise}>
                {(value) => {
                  const sharedBoards = value.filter(
                    (board) => board.usersCount > 1
                  );
                  const personalBoards = value.filter(
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
            {/* 
            {sharedBoards.length > 0 && (
              <>
                <DropdownMenu.Separator />

                <DropdownMenu.Label>Shared boards</DropdownMenu.Label>

                {sharedBoards.map((board) => {
                  const isActive = boardId
                    ? parseInt(boardId, 10) === board.id
                    : false;
                  return (
                    <Link key={board.id} to={`/boards/${board.id}`}>
                      <DropdownMenu.Item
                        className={isActive ? "!bg-[var(--accent-a3)]" : ""}
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
            )} */}

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
                    <Await resolve={currentUserPromise}>
                      {(value) => <>{value.primary_email}</>}
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

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("access_token");

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const currentUserPromise = fetch(
    import.meta.env.VITE_API_URL + "/auth/users/me",
    { headers }
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch current user");
    }
    return response.json();
  }) as Promise<{ primary_email: string }>;

  const currentUserBoardsPromise = fetch(
    import.meta.env.VITE_API_URL + "/auth/users/me/boards",
    {
      headers,
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch boards");
    }
    return response.json();
  }) as Promise<(Board & { usersCount: number })[]>;

  return { currentUserBoardsPromise, currentUserPromise };
}

function BoardLayout({}: Route.ComponentProps) {
  return (
    <div>
      <NavBar />
      <Box>
        <Outlet />
      </Box>
    </div>
  );
}

export default BoardLayout;
