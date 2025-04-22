import { Link, Outlet } from "react-router";
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import KiwinightSymbol from "~/components/kiwinight-symbol";
import type { Route } from "./+types/access-layout-route";
import { meta as rootMeta } from "~/root";

export function meta(args: Route.MetaArgs) {
  return [
    ...rootMeta(),
    {
      title: "Access • Standup Kiwi",
    },
  ];
}

function AccessLayoutRoute({}: Route.ComponentProps) {
  return (
    <div>
      <Flex
        className="h-[56px] px-4 z-10 bg-[var(--color-background)]"
        justify="start"
        align="center"
        position="sticky"
        top="0"
      >
        <Button variant="ghost" size="1" asChild>
          <Link to="/">
            <Flex align="center" gap="1">
              <KiwinightSymbol width={28} height={28} color="var(--gray-12)" />
              <Text
                size="3"
                weight="bold"
                className="!tracking-tight"
                color="gray"
                highContrast
              >
                Standup Kiwi
              </Text>
            </Flex>
          </Link>
        </Button>
      </Flex>
      <Box>
        <Outlet />
      </Box>
    </div>
  );
}

export default AccessLayoutRoute;
