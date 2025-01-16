import { Box, Card, Container, Flex, Text } from "@radix-ui/themes";

import type { Route } from "./+types/board-route";
import { RouteErrorResponse } from "~/root";
import {
  isApiErrorResponse,
  type ApiResponse,
  type Board,
  type Standup,
} from "types";
import verifyAuthentication from "~/libs/auth";

import Toolbar from "./toolbar";
import TodaysStandup from "./todays-standup";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function getBoardData(
  boardId: string,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiResponse<Board>>);
}

function listStandups(
  boardId: string,
  { accessToken }: { accessToken: string }
) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}/standups`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiResponse<Standup[]>>);
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken } = await verifyAuthentication(request);

  const boardId = params.boardId;

  const boardDataPromise = getBoardData(boardId, { accessToken }).then(
    (data) => {
      if (isApiErrorResponse(data)) {
        throw new RouteErrorResponse(
          data.statusCode,
          data.message,
          Error(data.error)
        );
      }
      return data;
    }
  );

  const standupsPromise = listStandups(boardId, { accessToken }).then(
    (data) => {
      if (isApiErrorResponse(data)) {
        throw new RouteErrorResponse(
          data.statusCode,
          data.message,
          Error(data.error)
        );
      }
      return data;
    }
  );

  return { boardDataPromise, standupsPromise };
}

export default function BoardRoute({ loaderData }: Route.ComponentProps) {
  return (
    <Container my="7" maxWidth="672px" px="4">
      <Flex direction="column" gap="7">
        <Toolbar />

        <TodaysStandup />

        <Box>
          <Text size="3" weight="bold">
            History
          </Text>

          <Card
            variant="surface"
            size={{
              initial: "2",
              sm: "4",
            }}
            mt="5"
          >
            <Flex direction="column">
              <Text size="4" weight="bold">
                Dec 31, 2024
              </Text>
              <br />
              <Text size="2" weight="medium">
                What did you do yesterday?
              </Text>
              <Text size="2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </Text>
              <br />

              <Text size="2" weight="medium">
                What will you do today?
              </Text>
              <Text size="2">
                Pater noster qui est in caelis. Sanctificetur nomen tuum.
                Adveniat regnum tuum. Fiat voluntas tua.
              </Text>
              <br />

              <Text size="2" weight="medium">
                Do you have any blockers?
              </Text>
              <Text size="2">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Explicabo laudantium repellendus veritatis sequi. Magnam placeat
                nesciunt similique. Exercitationem architecto reiciendis
                necessitatibus. Dolore illum quae accusantium eum suscipit ipsum
                sint dicta?
              </Text>
            </Flex>
          </Card>

          <Card
            variant="surface"
            size={{
              initial: "2",
              sm: "4",
            }}
            mt="5"
          >
            <Flex direction="column">
              <Text size="4" weight="bold">
                Dec 30, 2024
              </Text>
              <br />
              <Text size="2" weight="medium">
                What did you do yesterday?
              </Text>
              <Text size="2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </Text>
              <br />

              <Text size="2" weight="medium">
                What will you do today?
              </Text>
              <Text size="2">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Explicabo laudantium repellendus veritatis sequi. Magnam placeat
                nesciunt similique. Exercitationem architecto reiciendis
                necessitatibus. Dolore illum quae accusantium eum suscipit ipsum
                sint dicta?
              </Text>
              <br />

              <Text size="2" weight="medium">
                Do you have any blockers?
              </Text>
              <Text size="2">
                Lorem ipsum, dolor sit amet consectetur adipisicing
              </Text>
            </Flex>
          </Card>

          <Card
            variant="surface"
            size={{
              initial: "2",
              sm: "4",
            }}
            mt="5"
          >
            <Flex direction="column">
              <Text size="4" weight="bold">
                Dec 29, 2024
              </Text>
              <br />
              <Text size="2" weight="medium">
                What did you do yesterday?
              </Text>
              <Text size="2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </Text>
              <br />

              <Text size="2" weight="medium">
                What will you do today?
              </Text>
              <Text size="2">
                Pater noster qui est in caelis. Sanctificetur nomen tuum.
                Adveniat regnum tuum. Fiat voluntas tua.
              </Text>
              <br />

              <Text size="2" weight="medium">
                Do you have any blockers?
              </Text>
              <Text size="2">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Explicabo laudantium repellendus veritatis sequi.
              </Text>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </Container>
  );
}
