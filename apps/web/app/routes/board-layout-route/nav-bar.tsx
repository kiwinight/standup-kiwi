import { Suspense, useState } from "react";
import type { Route } from "./+types/board-layout-route";
import {
  Await,
  Link,
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
} from "react-router";
import { useParams } from "react-router";
import { ListBulletIcon, PersonIcon } from "@radix-ui/react-icons";
import {
  Flex,
  DropdownMenu,
  Button,
  Skeleton,
  Text,
  Badge,
  IconButton,
  AlertDialog,
} from "@radix-ui/themes";
import KiwinightSymbol from "~/components/kiwinight-symbol";
import { alertFeatureNotImplemented } from "~/libs/alert";
import type { loader as rootLoader } from "~/root";
import { Palette, SquarePlus } from "lucide-react";
import { useCurrentUserAppearanceSetting } from "~/hooks/use-current-user-appearance-setting";

function SignOutMenuItem() {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const signOutFetcher = useFetcher({ key: "sign-out" });

  return (
    <>
      <DropdownMenu.Item
        color="red"
        onClick={(event) => {
          event.preventDefault();
          setShowSignOutDialog(true);
        }}
      >
        Sign out
      </DropdownMenu.Item>
      <AlertDialog.Root
        open={showSignOutDialog}
        onOpenChange={setShowSignOutDialog}
      >
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Sign out of your account?</AlertDialog.Title>
          <AlertDialog.Description size="2" color="gray">
            Are you sure you want to sign out?
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                color="red"
                variant="solid"
                loading={signOutFetcher.state === "submitting"}
                onClick={() => {
                  signOutFetcher.submit(
                    {},
                    {
                      method: "POST",
                      encType: "application/json",
                      action: "/sign-out",
                    }
                  );
                }}
              >
                Sign out
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
}

function NavBar() {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  const { currentUserBoardsPromise } =
    useLoaderData<Route.ComponentProps["loaderData"]>();

  const { boardId } = useParams();

  const appearance = useCurrentUserAppearanceSetting();
  const fetcher = useFetcher({ key: "update-current-user-metadata" });

  return (
    <Flex
      className="h-[56px] px-4 z-10 bg-(--color-background)"
      justify="start"
      align="center"
      position="sticky"
      top="0"
    >
      <Flex gap="3" align="center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger suppressHydrationWarning>
            <IconButton variant="surface" size="2" radius="large">
              <ListBulletIcon fontSize={24} width={16} height={16} />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item asChild>
              <Link to="/boards/create">
                <SquarePlus size={15} strokeWidth={1.5} />
                Create a new board
              </Link>
            </DropdownMenu.Item>
            {/* TODO: Make a board list page instead of using this dropdown menu */}
            {/* <DropdownMenu.Item>
              <Layers2Icon size={15} strokeWidth={1.5} />
              Boards
            </DropdownMenu.Item> */}
            {/* TODO: split this part into resolver component */}
            <Suspense
              fallback={
                <>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Group>
                    <DropdownMenu.Label>Boards</DropdownMenu.Label>
                    <DropdownMenu.CheckboxItem checked={false}>
                      <Skeleton>
                        {/* TODO: The skeleton height covers the full checkbox item. It should only cover the text height*/}
                        <span>Example board name</span>
                      </Skeleton>
                    </DropdownMenu.CheckboxItem>
                    <DropdownMenu.CheckboxItem checked={false}>
                      <Skeleton>
                        <span>Example board name</span>
                      </Skeleton>
                    </DropdownMenu.CheckboxItem>
                  </DropdownMenu.Group>
                </>
              }
            >
              <Await resolve={currentUserBoardsPromise}>
                {(currenctUserBoards) => {
                  if (!currenctUserBoards) {
                    return null;
                  }

                  const sharedBoards = currenctUserBoards.filter(
                    (board) => board.collaboratorsCount > 1
                  );
                  const personalBoards = currenctUserBoards.filter(
                    (board) => board.collaboratorsCount === 1
                  );

                  return (
                    <>
                      {personalBoards.length > 0 && (
                        <>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Group>
                            <DropdownMenu.Label>Boards</DropdownMenu.Label>
                            {personalBoards.map((board) => {
                              const isActive = boardId
                                ? parseInt(boardId, 10) === board.id
                                : false;
                              return (
                                <Link
                                  key={board.id}
                                  reloadDocument
                                  to={`/boards/${board.id}`}
                                >
                                  <DropdownMenu.CheckboxItem checked={isActive}>
                                    {board.name}
                                  </DropdownMenu.CheckboxItem>
                                </Link>
                              );
                            })}
                          </DropdownMenu.Group>
                        </>
                      )}
                      {sharedBoards.length > 0 && (
                        <>
                          <DropdownMenu.Separator />

                          <DropdownMenu.Group>
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
                                  reloadDocument
                                  to={`/boards/${board.id}`}
                                >
                                  <DropdownMenu.CheckboxItem checked={isActive}>
                                    {board.name}
                                  </DropdownMenu.CheckboxItem>
                                </Link>
                              );
                            })}
                          </DropdownMenu.Group>
                        </>
                      )}
                    </>
                  );
                }}
              </Await>
            </Suspense>

            <DropdownMenu.Separator />
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>
                <Palette size={15} strokeWidth={1.5} />
                Appearance
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.CheckboxItem
                  checked={appearance === "light"}
                  onCheckedChange={() => {
                    // setAppearance("light");
                    fetcher.submit(
                      {
                        metadata: {
                          settings: {
                            appearance: "light",
                          },
                        },
                      },
                      {
                        encType: "application/json",
                        method: "POST",
                        action: "/update-current-user-metadata",
                      }
                    );
                  }}
                >
                  Light
                </DropdownMenu.CheckboxItem>
                <DropdownMenu.CheckboxItem
                  checked={appearance === "dark"}
                  onCheckedChange={() => {
                    // setAppearance("dark");
                    fetcher.submit(
                      {
                        metadata: {
                          settings: {
                            appearance: "dark",
                          },
                        },
                      },
                      {
                        encType: "application/json",
                        method: "POST",
                        action: "/update-current-user-metadata",
                      }
                    );
                  }}
                >
                  Dark
                </DropdownMenu.CheckboxItem>
                <DropdownMenu.CheckboxItem
                  checked={appearance === "inherit"}
                  onCheckedChange={() => {
                    // setAppearance("inherit");
                    fetcher.submit(
                      {
                        metadata: {
                          settings: {
                            appearance: "inherit",
                          },
                        },
                      },
                      {
                        encType: "application/json",
                        method: "POST",
                        action: "/update-current-user-metadata",
                      }
                    );
                  }}
                >
                  System
                </DropdownMenu.CheckboxItem>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>
                <PersonIcon />
                <Text size="2">
                  <Suspense fallback={<Skeleton>Loading</Skeleton>}>
                    <Await resolve={currentUserPromise}>
                      {(data) => {
                        if (!data) {
                          return <Skeleton>Loading</Skeleton>;
                        }

                        return <>{data.primary_email}</>;
                      }}
                    </Await>
                  </Suspense>
                </Text>
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item
                  onClick={() => {
                    alertFeatureNotImplemented();
                  }}
                >
                  Settings
                </DropdownMenu.Item>
                <SignOutMenuItem />
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <Button variant="ghost" size="1" asChild>
          <Link to="/">
            <Flex align="center" gap="1">
              <KiwinightSymbol width={28} height={28} color="var(--gray-12)" />
              <Text
                size="3"
                weight="bold"
                className="tracking-tight!"
                color="gray"
                highContrast
              >
                Standup Kiwi
              </Text>
            </Flex>
          </Link>
        </Button>
        <Badge highContrast>Beta</Badge>
      </Flex>
    </Flex>
  );
}

export default NavBar;
