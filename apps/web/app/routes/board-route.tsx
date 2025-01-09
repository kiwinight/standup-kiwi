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
import { getSession } from "~/sessions.server";
import type { Route } from "./+types/board-route";
import { Await } from "react-router";
import { NotFoundRouteErrorResponse, RouteErrorResponse } from "~/root";
import type { ApiResponse, Board } from "types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("access_token");

  const boardId = params.boardId;

  const boardDataPromise = fetch(
    import.meta.env.VITE_API_URL + `/boards/${boardId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.json() as Promise<ApiResponse<Board>>);

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
                if ("message" in data) {
                  if (data.statusCode === 401) {
                    throw new NotFoundRouteErrorResponse();
                  }

                  throw new RouteErrorResponse(
                    data.statusCode,
                    data.message,
                    Error(data.error)
                  );
                }

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
          <Text size="4" weight="bold">
            Today's standup
          </Text>

          <Box mt="5">
            {!isFormVisible && (
              <div>
                <Flex direction="column">
                  <Text
                    size="2"
                    weight="medium"
                    className="!leading-[var(--line-height-3)]"
                  >
                    What did you do yesterday?
                  </Text>
                  <Text mt="2" size="2">
                    {formState.yesterday}
                  </Text>
                </Flex>

                <Flex direction="column" mt="5">
                  <Text
                    size="2"
                    weight="medium"
                    className="!leading-[var(--line-height-3)]"
                  >
                    What will you do today?
                  </Text>
                  <Text mt="2" size="2">
                    {formState.today}
                  </Text>
                </Flex>

                <Flex direction="column" mt="5">
                  <Text
                    size="2"
                    weight="medium"
                    className="!leading-[var(--line-height-3)]"
                  >
                    Do you have any blockers?
                  </Text>
                  <Text mt="2" size="2">
                    {formState.blockers}
                  </Text>
                </Flex>

                <Flex justify="end" mt="5" gap="2">
                  <Button
                    variant="soft"
                    size="2"
                    highContrast
                    onClick={() => setIsFormVisible(true)}
                  >
                    Edit
                  </Button>
                </Flex>
              </div>
            )}
            {isFormVisible && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(
                    event.target as HTMLFormElement
                  );
                  setFormState({
                    yesterday: formData.get("yesterday") as string,
                    today: formData.get("today") as string,
                    blockers: formData.get("blockers") as string,
                  });
                  setIsFormVisible(false);
                }}
              >
                <Box>
                  <label>
                    <Text size="2" weight="medium">
                      What did you do yesterday?
                    </Text>
                    <TextArea
                      name="yesterday"
                      mt="2"
                      variant="soft"
                      placeholder="Write your reply here..."
                      className="w-full !min-h-[80px]"
                      resize="vertical"
                      defaultValue={formState.yesterday}
                    />
                  </label>
                </Box>

                <Box mt="5">
                  <label>
                    <Text size="2" weight="medium">
                      What will you do today?
                    </Text>
                    <TextArea
                      name="today"
                      mt="2"
                      variant="soft"
                      placeholder="Write your reply here..."
                      className="w-full !min-h-[80px]"
                      resize="vertical"
                      defaultValue={formState.today}
                    />
                  </label>
                </Box>

                <Box mt="5">
                  <label>
                    <Text size="2" weight="medium">
                      Do you have any blockers?
                    </Text>
                    <TextArea
                      name="blockers"
                      mt="2"
                      variant="soft"
                      placeholder="Write your reply here..."
                      className="w-full !min-h-[80px]"
                      resize="vertical"
                      defaultValue={formState.blockers}
                    />
                  </label>
                </Box>

                <Flex justify="end" mt="5" gap="2">
                  {formState.yesterday ||
                  formState.today ||
                  formState.blockers ? (
                    <Button
                      type="button"
                      highContrast
                      size="2"
                      variant="soft"
                      onClick={() => {
                        setIsFormVisible(false);
                      }}
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button highContrast size="2" type="submit">
                    Save
                  </Button>
                </Flex>
              </form>
            )}
          </Box>
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
