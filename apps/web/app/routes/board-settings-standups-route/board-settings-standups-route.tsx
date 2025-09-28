import { useLoaderData, data, Await, useParams } from "react-router";
import { type ApiData, isErrorData, type StandupForm } from "types";
import { commitSession } from "~/libs/auth-session.server";
import requireAuthenticated from "~/libs/auth";
import { Suspense, useState } from "react";
import { ApiError } from "~/root";
import type { Route } from "./+types/board-settings-standups-route";
import { getBoard, getStandupForm } from "../board-route/board-route";
import {
  Button,
  Card,
  Flex,
  IconButton,
  Inset,
  Separator,
  Switch,
  Tabs,
  Text,
  TextArea,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import {
  AutoSizeTextArea,
  validateDynamicFormSchema,
} from "../board-route/dynamic-form";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Pencil1Icon,
  Pencil2Icon,
  PlusIcon,
  CopyIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const boardId = parseInt(params.boardId, 10);

  if (isNaN(boardId) || boardId <= 0) {
    throw new ApiError("Invalid board ID", 400);
  }

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const boardDataPromise = getBoard(boardId, { accessToken });

  const boardPromise = getBoard(boardId, { accessToken }).then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data;
  });

  const boardActiveStandupFormPromise = boardPromise.then((board) => {
    if (!board) {
      return null;
    }

    if (!board.activeStandupFormId) {
      return null;
    }

    return getStandupForm(
      {
        standupFormId: board.activeStandupFormId,
        boardId: board.id,
      },
      { accessToken }
    ).then((data) => {
      if (isErrorData(data)) {
        return null;
      }
      return data;
    });
  });

  return data(
    {
      baseUrl,
      boardDataPromise,
      boardPromise,
      boardActiveStandupFormPromise,
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
}

function BoardExistanceGuard() {
  const { boardDataPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense>
      <Await resolve={boardDataPromise}>
        {(data) => {
          if (isErrorData(data)) {
            throw new ApiError(data.message, data.statusCode);
          }
          return null;
        }}
      </Await>
    </Suspense>
  );
}

export default function BoardSettingsCollaboratorsRoute({}: Route.ComponentProps) {
  return (
    <>
      <BoardExistanceGuard />

      <TemporarySetting />
    </>
  );
}

function ComponentDataResolver({
  children,
  fallback,
}: {
  children: (data: {
    boardActiveStandupForm: StandupForm | null;
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { boardActiveStandupFormPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={boardActiveStandupFormPromise}>
        {(boardActiveStandupForm) => {
          return children({ boardActiveStandupForm });
        }}
      </Await>
    </Suspense>
  );
}

function Component({
  boardActiveStandupForm,
}: {
  boardActiveStandupForm: StandupForm | null;
}) {
  console.log(boardActiveStandupForm);
  const initialSchema = validateDynamicFormSchema(
    boardActiveStandupForm?.schema
  );
  const [schema, setSchema] = useState(initialSchema);

  if (!schema) {
    return null;
  }

  return (
    <Flex mt="5" direction="column" gap="5">
      <Tabs.Root defaultValue="edit">
        <Tabs.List>
          <Tabs.Trigger value="edit">Edit</Tabs.Trigger>
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="edit">
          <Flex mt="5" direction="column" gap="5">
            {schema.fields.map((field, index) => {
              return (
                <>
                  <Card
                    variant="surface"
                    size={{
                      initial: "2",
                      sm: "3",
                    }}
                  >
                    <Flex direction="column" gap="4">
                      <Flex key={field.name} direction="column" gap="2">
                        <label>
                          <Flex align="center" gap="2">
                            <Text size="2" className="font-semibold">
                              {field.label}
                            </Text>
                            {field.required && (
                              <Text size="1" color="gray">
                                Required
                              </Text>
                            )}
                          </Flex>
                        </label>
                        {field.type === "textarea" && (
                          <AutoSizeTextArea
                            variant="soft"
                            className="w-full min-h-[72px]!"
                            resize="none"
                            placeholder={field.placeholder}
                            value=""
                            // TODO: value is required for autosizing. handle them.
                          />
                        )}

                        {field.description && (
                          <Text size="2" color="gray">
                            {field.description}
                          </Text>
                        )}
                      </Flex>

                      <Inset
                        clip="padding-box"
                        side="bottom"
                        pb="current"
                        px="0"
                      >
                        <Separator size="4" />
                      </Inset>

                      <Flex justify="between">
                        <Flex gap="2">
                          <Tooltip content="Move up">
                            <IconButton variant="soft">
                              <ArrowUpIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Move down">
                            <IconButton variant="soft">
                              <ArrowDownIcon />
                            </IconButton>
                          </Tooltip>
                        </Flex>

                        <Flex gap="2">
                          <Button variant="soft">
                            <Pencil2Icon />
                            Edit
                          </Button>

                          {/* <Button variant="soft">
                      <CopyIcon />
                      Duplicate
                    </Button> */}

                          <Tooltip content="Duplicate">
                            <IconButton variant="soft">
                              <CopyIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip content="Remove">
                            <IconButton variant="soft">
                              <TrashIcon />
                            </IconButton>
                          </Tooltip>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Card>
                  {index === schema.fields.length - 1 && (
                    <Flex justify="center">
                      <Button variant="soft">
                        <PlusIcon />
                        Add field
                      </Button>
                    </Flex>
                  )}
                </>
              );
              return (
                <>
                  <Flex key={field.name} direction="column" gap="2">
                    <label>
                      <Flex align="center" gap="2">
                        <Text size="2" className="font-semibold">
                          {field.label}
                        </Text>
                        {field.required && (
                          <Text size="1" color="gray">
                            Required
                          </Text>
                        )}
                      </Flex>
                    </label>
                    {field.type === "textarea" && (
                      <AutoSizeTextArea
                        variant="soft"
                        className="w-full min-h-[72px]!"
                        resize="none"
                        placeholder={field.placeholder}
                        // TODO: value is required for autosizing. handle them.
                      />
                    )}

                    {field.description && (
                      <Text size="2" color="gray">
                        {field.description}
                      </Text>
                    )}
                    <Flex justify="end">
                      {/* <IconButton variant="outline">
                    <Pencil1Icon />
                  </IconButton> */}
                      <Button variant="soft">
                        <Pencil1Icon />
                        Edit
                      </Button>
                    </Flex>
                  </Flex>
                  <Separator size="4" />
                </>
              );
            })}
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    </Flex>
  );
}

function TemporarySetting() {
  return (
    <Card
      size={{
        initial: "3",
        sm: "4",
      }}
    >
      <Flex direction="column" gap="2">
        <Text size="4" weight="bold">
          Standup form
        </Text>

        <Text size="2" color="gray">
          Customize the standup form to fit your needs.
        </Text>
      </Flex>
      <ComponentDataResolver fallback={<div>Loading...</div>}>
        {({ boardActiveStandupForm }) => (
          <Component boardActiveStandupForm={boardActiveStandupForm} />
        )}
      </ComponentDataResolver>
      <Flex justify="end" mt="5" gap="2">
        <Button highContrast size="2" type="button" variant="outline">
          Cancel
        </Button>
        <Button highContrast size="2" type="submit">
          Save
        </Button>
      </Flex>
    </Card>
  );
}
