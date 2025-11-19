import {
  Button,
  Card,
  Container,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import {
  data,
  redirect,
  useFetcher,
  type ActionFunctionArgs,
  type ClientActionFunctionArgs,
} from "react-router";
import requireAuthenticated from "~/libs/auth";
import { commitSession } from "~/libs/auth-session.server";
import type { Route } from "./+types/create-new-board-route";
import { createBoard, type CreateBoardRequestBody } from "~/libs/api/boards";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuthenticated(request);
}

function getFormName(formData: FormData): string | undefined {
  return formData.get("name")?.toString().trim();
}

export async function clientAction({
  request,
  serverAction,
}: ClientActionFunctionArgs) {
  const clonedRequest = request.clone();
  let formData = await clonedRequest.formData();

  const name = getFormName(formData);

  let errors: {
    name?: string;
  } = {};

  if (!name) {
    errors.name = "Board name is required";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return await serverAction<typeof action>();
}

export async function action({ request }: ActionFunctionArgs) {
  const { accessToken, refreshed, session } = await requireAuthenticated(
    request
  );

  let formData = await request.formData();

  const name = getFormName(formData);

  const timezone = formData.get("timezone")?.toString().trim();

  if (!name || !timezone) {
    return data(
      {
        errors: {
          name: "Board name and timezone are required",
        },
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  }

  try {
    const board = await createBoard({ name, timezone }, { accessToken });

    return redirect("/boards/" + board.id, {
      headers: {
        ...(session ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    });
  } catch (error) {
    return data(
      {
        errors: {
          name: "Failed to create board",
        },
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  }
}

type Props = {};

function CreateNewBoardRoute({}: Props) {
  const fetcher = useFetcher<typeof clientAction>();

  return (
    <Container py="7" maxWidth="672px" px="4">
      <Text size="6" weight="bold">
        Create a new board
      </Text>
      <Card
        size={{
          initial: "3",
          sm: "4",
        }}
        mt="7"
      >
        <Text size="4" weight="bold">
          New board
        </Text>

        <fetcher.Form name="create-new-board" method="post" className="mt-6">
          <Flex direction="column" gap="2">
            <label>
              <Text size="2" weight="medium">
                Board name
              </Text>
            </label>

            <TextField.Root
              name="name"
              variant="soft"
              placeholder="Enter the board name"
            />
            {fetcher.data?.errors?.name && (
              <Text size="2" color="red">
                {fetcher.data.errors.name}
              </Text>
            )}
            <input
              className="hidden"
              name="timezone"
              value={Intl.DateTimeFormat().resolvedOptions().timeZone}
            />
          </Flex>

          <Flex justify="end" mt="5" gap="2">
            <Button
              highContrast
              size="2"
              type="submit"
              loading={fetcher.state !== "idle"}
            >
              Create
            </Button>
          </Flex>
        </fetcher.Form>
      </Card>
    </Container>
  );
}

export default CreateNewBoardRoute;
