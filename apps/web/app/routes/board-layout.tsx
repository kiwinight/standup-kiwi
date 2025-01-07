import React from "react";
import { Outlet, useNavigate } from "react-router";
import {
  Box,
  Button,
  Card,
  Container,
  DropdownMenu,
  Flex,
  Select,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { CheckIcon, ListBulletIcon, PlusIcon } from "@radix-ui/react-icons";
import KiwinightSymbol from "~/components/kiwinight-symbol";
import type { Route } from "./+types/board-layout";
import { getSession } from "~/sessions.server";

function NavBar({ userEmail }: { userEmail: string }) {
  const navigate = useNavigate();
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
              <ListBulletIcon
                fontSize={24}
                width={16}
                height={16}
                // width={20} height={20}
              />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Group>
              <DropdownMenu.Item
                onClick={() => {
                  navigate("/boards/create");
                }}
              >
                <PlusIcon /> Create a new board
              </DropdownMenu.Item>

              <DropdownMenu.Separator />

              <DropdownMenu.Label>Boards</DropdownMenu.Label>
              <DropdownMenu.Item className="bg-[var(--accent-a3);]">
                <Text weight="medium">Personal</Text>
              </DropdownMenu.Item>
              <DropdownMenu.Item>Personal B</DropdownMenu.Item>
            </DropdownMenu.Group>

            <DropdownMenu.Separator />

            <DropdownMenu.Label>Shared boards</DropdownMenu.Label>

            <DropdownMenu.Item>Team A</DropdownMenu.Item>
            <DropdownMenu.Item>Team B</DropdownMenu.Item>
            <DropdownMenu.Item>Team C</DropdownMenu.Item>

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
            {/* <DropdownMenu.Separator /> */}
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>
                <Text size="2" weight="medium">
                  {userEmail}
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

  const response = await fetch(
    import.meta.env.VITE_API_URL + "/auth/users/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const currentUser: { primary_email: string } = await response.json();

  return { currentUser };
}

type Props = {};

function BoardLayout({ loaderData }: Route.ComponentProps) {
  const { currentUser } = loaderData;

  return (
    <div>
      <NavBar userEmail={currentUser.primary_email} />
      <Box>
        <Outlet />
      </Box>
    </div>
  );
}

export default BoardLayout;
