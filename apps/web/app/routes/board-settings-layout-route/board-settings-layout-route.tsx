import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Box, Button, Container, Flex, TabNav, Text } from "@radix-ui/themes";
import { Link, Outlet, useLocation, useParams } from "react-router";
import type { Route } from "./+types/board-settings-layout-route";

function BoardSettingsLayoutRoute({}: Route.ComponentProps) {
  const { boardId } = useParams();

  const location = useLocation();
  const locationPathname = location.pathname;

  return (
    <Container py="7" maxWidth="672px" px="4">
      <Flex direction="column" gap="7">
        <Flex direction="column" gap="4">
          <Flex>
            <Button asChild variant="ghost" highContrast>
              <Link to={`/boards/${boardId}`}>
                <ArrowLeftIcon />
                Back to board
              </Link>
            </Button>
          </Flex>
          <Flex mt="2">
            <Text size="6" weight="bold">
              Settings
            </Text>
          </Flex>
          <Box>
            <TabNav.Root>
              <TabNav.Link
                asChild
                active={locationPathname === `/boards/${boardId}/settings`}
              >
                <Link to={`/boards/${boardId}/settings`}>General</Link>
              </TabNav.Link>

              <TabNav.Link
                asChild
                active={
                  locationPathname ===
                  `/boards/${boardId}/settings/collaborators`
                }
              >
                <Link to={`/boards/${boardId}/settings/collaborators`}>
                  Collaborators
                </Link>
              </TabNav.Link>
              <TabNav.Link
                asChild
                active={
                  locationPathname === `/boards/${boardId}/settings/standups`
                }
              >
                <Link to={`/boards/${boardId}/settings/standups`}>
                  Standups
                </Link>
              </TabNav.Link>
            </TabNav.Root>
          </Box>
        </Flex>
        <Outlet />
      </Flex>
    </Container>
  );
}

export default BoardSettingsLayoutRoute;
