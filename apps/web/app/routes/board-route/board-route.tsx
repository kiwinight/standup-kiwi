import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Skeleton,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { Suspense, useState } from "react";
import { GearIcon, ListBulletIcon, Share1Icon } from "@radix-ui/react-icons";
import type { Route } from "./+types/board-route";
import { Await } from "react-router";
import { RouteErrorResponse } from "~/root";
import { isApiErrorResponse, type ApiResponse, type Board } from "types";
import verifyAuthentication from "~/libs/auth";
import FormRenderer, { formSchema, FormSkeleton } from "./form-renderer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken } = await verifyAuthentication(request);

  const boardId = params.boardId;

  const boardDataPromise = fetch(
    import.meta.env.VITE_API_URL + `/boards/${boardId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then(async (response) => {
    const data = (await response.json()) as ApiResponse<Board>;

    if (isApiErrorResponse(data)) {
      throw new RouteErrorResponse(
        data.statusCode,
        data.message,
        Error(data.error)
      );
    }

    return data;
  });

  return { boardDataPromise };
}

export default function BoardRoute({ loaderData }: Route.ComponentProps) {
  const { boardDataPromise } = loaderData;

  const [formState, setFormState] = useState({
    yesterday: "",
    today: "",
    blockers: "",
  });

  const [isFormVisible, setIsFormVisible] = useState(true);

  return (
    <Container my="7" maxWidth="672px" px="4">
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

      <Box>
        <Card
          variant="surface"
          size={{
            initial: "2",
            sm: "4",
          }}
          mt="7"
        >
          <Suspense fallback={<FormSkeleton />}>
            <Await resolve={boardDataPromise} errorElement={<div>Error</div>}>
              {(data) => {
                const formStructure = formSchema.parse(data.formSchemas);
                return <FormRenderer schema={formStructure} />;
              }}
            </Await>
          </Suspense>
        </Card>

        <Box mt="7">
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
      </Box>
    </Container>
  );
}
