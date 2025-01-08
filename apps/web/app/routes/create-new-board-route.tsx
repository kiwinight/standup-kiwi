import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import {
  redirect,
  useActionData,
  useFetcher,
  type ActionFunctionArgs,
  type ClientActionFunctionArgs,
} from "react-router";
import { getSession } from "~/sessions.server";

function getFormName(formData: FormData): string | undefined {
  return formData.get("name")?.toString().trim();
}

export async function clientAction({
  request,
  serverAction,
}: ClientActionFunctionArgs) {
  console.log("clientAction");
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
  let formData = await request.formData();

  const name = getFormName(formData);

  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("access_token");

  const board = await fetch(import.meta.env.VITE_API_URL + "/boards", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => {
    if (!response.ok) {
      return {
        errors: {
          name: "Failed to create board",
        },
      };
    }
    return response.json();
  });

  return redirect("/boards/" + board.id);
}

type Props = {};

function CreateNewBoardRoute({}: Props) {
  const fetcher = useFetcher<typeof clientAction>();

  return (
    <Container my="7" maxWidth="672px" px="4">
      <Text size="6" weight="bold">
        Create a new board
      </Text>
      <Card
        size={{
          initial: "2",
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
          </Flex>

          <Flex justify="end" mt="5" gap="2">
            <Button highContrast size="2" type="submit">
              Create
            </Button>
          </Flex>
        </fetcher.Form>
      </Card>
    </Container>
  );
}

export default CreateNewBoardRoute;
