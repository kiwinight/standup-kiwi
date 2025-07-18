import {
  Box,
  Button,
  Card,
  Flex,
  Skeleton,
  Text,
  Tooltip,
  useThemeContext,
} from "@radix-ui/themes";
import {
  Suspense,
  useEffect,
  useState,
  use,
  useRef,
  useImperativeHandle,
  type Ref,
  useMemo,
} from "react";
import {
  Await,
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
} from "react-router";
import type { loader } from "./board-route";
import type { loader as rootLoader } from "~/root";
import { DateTime } from "luxon";
import DynamicForm, {
  DynamicFormSkeleton,
  type DynamicFormRef,
  validateDynamicFormSchema,
  type DynamicFormValues,
} from "./dynamic-form";
import {
  type ActionType as CreateStandupActionType,
  type CreateStandupRequestBody,
} from "../create-board-standup/create-board-standup";
import { type ActionType as UpdateStandupActionType } from "../update-board-standup/update-board-standup";

import type { Board, Standup, StandupForm, User } from "types";

import { parseMarkdownToHtml } from "~/libs/markdown";
import { useToast } from "~/hooks/use-toast";

export function ContentSkeleton() {
  return (
    <Flex direction="column" gap="5">
      <Text size="4" weight="bold">
        <Skeleton>username</Skeleton>
      </Text>
      <DynamicFormSkeleton />
    </Flex>
  );
}

interface ContentRef {
  edit: () => void;
  cancel: () => void;
  save: () => void;
}

function Content({
  ref,
  board,
  standups,
  structure,
  currentUser,
}: {
  ref: Ref<ContentRef>;
  board: Board;
  standups: Standup[];
  structure: StandupForm;
  currentUser: User | null;
}) {
  const { appearance } = useThemeContext();
  const { toast } = useToast();
  const schema = validateDynamicFormSchema(structure.schema);

  if (!schema) {
    return null;
  }

  // Guard clause: don't show standup if no current user
  if (!currentUser) {
    return <DynamicFormSkeleton />;
  }

  const dynamicFormRef = useRef<DynamicFormRef>(null);

  useImperativeHandle(
    ref,
    () => ({
      edit: () => {
        handleEditButtonClick();
      },
      cancel: () => {
        handleDynamicFormCancel();
      },
      save: () => {
        dynamicFormRef.current?.submit();
      },
    }),
    []
  );

  const boardTimezone = board.timezone;
  const boardToday = DateTime.now().setZone(boardTimezone).startOf("day"); // 2025-01-13T00:00:00.000Z

  const createStandupFetcher = useFetcher<CreateStandupActionType>({
    key: "create-standup",
  });
  const updateStandupFetcher = useFetcher<UpdateStandupActionType>({
    key: "update-standup",
  });

  let currentUserTodayStandup: Standup | undefined = standups.find(
    (standup) => {
      // Convert createdAt to the board's timezone
      const standupDate = DateTime.fromISO(standup.createdAt, {
        zone: "utc",
      })
        .setZone(boardTimezone)
        .startOf("day"); // 2025-01-13T00:00:00.000Z

      return (
        standupDate.equals(boardToday) && standup.userId === currentUser?.id
      );
    }
  );

  if (createStandupFetcher.data) {
    const standup = createStandupFetcher.data?.standup;
    if (standup) {
      currentUserTodayStandup = standup;
    }
  }

  if (createStandupFetcher.json) {
    const { formData, formId } =
      (createStandupFetcher.json as unknown as CreateStandupRequestBody) || {};

    currentUserTodayStandup = {
      id: 0,
      boardId: board.id,
      userId: currentUser?.id || "",
      formId: formId,
      formData: formData,
      createdAt: "",
      updatedAt: "",
    };
  }

  useEffect(() => {
    if (createStandupFetcher.data) {
      const { error } = createStandupFetcher.data;
      if (error) {
        toast.error(error);
        console.error(error);
        setIsEditing(true);
      } else {
        toast.success("Your standup has been saved");
      }
    }
  }, [createStandupFetcher.data]);

  if (updateStandupFetcher.data) {
    const standup = updateStandupFetcher.data?.standup;
    if (standup) {
      currentUserTodayStandup = standup;
    }
  }

  if (updateStandupFetcher.json) {
    const { formData } =
      (updateStandupFetcher.json as {
        formData: Standup["formData"];
      }) || {};

    if (currentUserTodayStandup) {
      currentUserTodayStandup = {
        ...currentUserTodayStandup,
        formData: formData as Standup["formData"],
      };
    }
  }

  useEffect(() => {
    if (updateStandupFetcher.data) {
      const error = updateStandupFetcher.data.error;
      if (error) {
        toast.error(error);
        console.error(error);
        setIsEditing(true);
      } else {
        toast.success("Your standup has been saved");
      }
    }
  }, [updateStandupFetcher.data]);

  const [isEditing, setIsEditing] = useState(!Boolean(currentUserTodayStandup));

  function handleDynamicFormCancel() {
    setIsEditing(false);
  }

  function handleEditButtonClick() {
    setIsEditing(true);
  }

  return (
    <Flex direction="column" gap="5">
      {/* TODO: hide user name if there's only one collaborator */}
      <Tooltip
        content={
          <Flex direction="column" gap="1">
            <Text size="2">{currentUser?.primary_email}</Text>
            <Text size="2">
              Last saved at{" "}
              {DateTime.fromISO(currentUserTodayStandup?.createdAt || "", {
                zone: "utc",
              })
                .setZone(boardTimezone)
                .toLocaleString(DateTime.DATETIME_MED)}{" "}
              ({boardTimezone})
            </Text>
          </Flex>
        }
      >
        <Text size="4" weight="bold">
          {currentUser?.primary_email.split("@")[0]}
        </Text>
      </Tooltip>
      {isEditing && (
        <DynamicForm
          ref={dynamicFormRef}
          schema={schema}
          defaultValues={
            currentUserTodayStandup
              ? (currentUserTodayStandup.formData as DynamicFormValues)
              : undefined
          }
          showCancelButton={Boolean(
            currentUserTodayStandup && createStandupFetcher.state === "idle"
          )}
          onSubmit={async (data) => {
            if (!currentUserTodayStandup) {
              createStandupFetcher.submit(
                {
                  formData: data,
                  formId: structure.id,
                },
                {
                  encType: "application/json",
                  method: "POST",
                  action: `/boards/${board.id}/standups/create`,
                }
              );
              setIsEditing(false);
            }

            if (currentUserTodayStandup && isEditing) {
              updateStandupFetcher.submit(
                {
                  formData: data,
                },
                {
                  encType: "application/json",
                  method: "POST",
                  action: `/boards/${board.id}/standups/${currentUserTodayStandup?.id}/update`,
                }
              );
              setIsEditing(false);
            }
          }}
          onCancel={
            currentUserTodayStandup && isEditing
              ? handleDynamicFormCancel
              : undefined
          }
        />
      )}
      {!isEditing && (
        <Flex direction="column" gap="5">
          <Flex direction="column" gap="5">
            {schema.fields.map((field) => {
              const value = (
                currentUserTodayStandup?.formData as DynamicFormValues
              )[field.name];
              if (!value) {
                return null;
              }

              const html = parseMarkdownToHtml(value);

              return (
                <Flex key={field.name} direction="column" gap="2">
                  <Text size="2" className="font-semibold">
                    {field.label}
                  </Text>
                  <Box
                    className={`prose prose-sm ${
                      appearance === "dark" ? "dark:prose-invert" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </Flex>
              );
            })}
          </Flex>
          <Flex justify="end" gap="2">
            <Button
              highContrast
              size="2"
              variant="surface"
              onClick={handleEditButtonClick}
            >
              Edit
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}

function Resolver({
  ref,
  children,
}: {
  ref: Ref<ContentRef>;
  children: (data: {
    currentUser: User | null;
    board: Board;
    standups: Standup[];
    structure: StandupForm;
  }) => React.ReactNode;
}) {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  const { boardPromise, standupsPromise, boardActiveStandupFormPromise } =
    useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<ContentSkeleton />}>
      <Await
        resolve={useMemo(() => {
          return Promise.all([
            currentUserPromise,
            boardPromise,
            standupsPromise,
            boardActiveStandupFormPromise,
          ]);
        }, [boardPromise, standupsPromise, boardActiveStandupFormPromise])}
      >
        {(data) => {
          const [currentUser, board, standups, structure] = data;

          if (!board || !standups || !structure) {
            return <ContentSkeleton />;
          }

          return children({
            currentUser,
            board,
            standups,
            structure,
          });
        }}
      </Await>
    </Suspense>
  );
}

export function TodayStandupNewSkeleton() {
  return (
    <Card
      tabIndex={0}
      size={{
        initial: "3",
        sm: "4",
      }}
    >
      <ContentSkeleton />
    </Card>
  );
}

function CurrentUserStandupCard() {
  const contentRef = useRef<ContentRef>(null);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      contentRef.current?.save();
    }

    if (event.key.toLowerCase() === "e") {
      contentRef.current?.edit();
    }

    if (event.key === "Escape") {
      // TODO: pressing escape triggers an error
      contentRef.current?.cancel();
    }
  }

  return (
    <Card
      tabIndex={0}
      size={{
        initial: "3",
        sm: "4",
      }}
      onKeyDown={handleKeyDown}
    >
      <Resolver ref={contentRef}>
        {({ currentUser, board, standups, structure }) => {
          return (
            <Content
              ref={contentRef}
              currentUser={currentUser}
              board={board}
              standups={standups}
              structure={structure}
            />
          );
        }}
      </Resolver>
    </Card>
  );
}

export default CurrentUserStandupCard;
