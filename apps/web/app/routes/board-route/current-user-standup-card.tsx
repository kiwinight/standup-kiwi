import {
  Box,
  Button,
  Card as RadixCard,
  Flex,
  IconButton,
  Skeleton,
  Text,
  Tooltip,
  useThemeContext,
} from "@radix-ui/themes";
import {
  Suspense,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  type Ref,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  Await,
  useFetcher,
  useLoaderData,
  useParams,
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
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { useBoardViewSettings } from "~/hooks/use-board-view-settings";
import { useKeyPress } from "~/hooks/use-key-press";

interface CurrentUserStandupCardContextType {
  isExpanded: boolean;
  toggleExpansion: () => void;
  setIsExpanded: (expanded: boolean) => void;
}

const CurrentUserStandupCardContext =
  createContext<CurrentUserStandupCardContextType | null>(null);

function useCurrentUserStandupCard() {
  const context = useContext(CurrentUserStandupCardContext);
  if (!context) {
    throw new Error(
      "useCurrentUserStandupCard must be used within a CurrentUserStandupCardProvider"
    );
  }
  return context;
}

interface CurrentUserStandupCardProviderProps {
  children: ReactNode;
  defaultExpanded?: boolean;
}

function CurrentUserStandupCardProvider({
  children,
  defaultExpanded = false,
}: CurrentUserStandupCardProviderProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <CurrentUserStandupCardContext.Provider
      value={{
        isExpanded,
        toggleExpansion,
        setIsExpanded,
      }}
    >
      {children}
    </CurrentUserStandupCardContext.Provider>
  );
}

export function CardContentSkeleton() {
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

function CardContentUI({
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
    if (createStandupFetcher.state !== "idle" && createStandupFetcher.data) {
      const { error } = createStandupFetcher.data;
      if (error) {
        toast.error(error);
        console.error(error);
        setIsEditing(true);
      } else {
        toast.success("Your standup has been saved");
      }
    }
  }, [createStandupFetcher.state, createStandupFetcher.data]);

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
    if (updateStandupFetcher.state !== "idle" && updateStandupFetcher.data) {
      const error = updateStandupFetcher.data.error;
      if (error) {
        toast.error(error);
        console.error(error);
        setIsEditing(true);
      } else {
        toast.success("Your standup has been saved");
      }
    }
  }, [updateStandupFetcher.state, updateStandupFetcher.data]);

  const [isEditing, setIsEditing] = useState(!Boolean(currentUserTodayStandup));

  function handleDynamicFormCancel() {
    setIsEditing(false);
  }

  function handleEditButtonClick() {
    setIsEditing(true);
  }

  return (
    <Flex direction="column" gap="5">
      <Flex justify="between">
        <Tooltip
          content={
            <Flex direction="column" gap="1">
              <Text size="2">{currentUser?.primary_email}</Text>
              {currentUserTodayStandup?.updatedAt && (
                <Text size="2">
                  Last saved at{" "}
                  {DateTime.fromISO(currentUserTodayStandup.updatedAt, {
                    zone: "utc",
                  })
                    .setZone(boardTimezone)
                    .toLocaleString(DateTime.DATETIME_MED)}{" "}
                  ({boardTimezone})
                </Text>
              )}
            </Flex>
          }
        >
          <Text size="4" weight="bold">
            {currentUser?.primary_email.split("@")[0]}
          </Text>
        </Tooltip>
        <Flex justify="end" align="center" gap="4">
          <ExpansionButton />
        </Flex>
      </Flex>
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

function CardContentDataResolver({
  children,
  fallback,
}: {
  children: (data: {
    currentUser: User | null;
    board: Board;
    standups: Standup[];
    structure: StandupForm;
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);

  const { boardPromise, standupsPromise, boardActiveStandupFormPromise } =
    useLoaderData<typeof loader>();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={currentUserPromise}>
        {(currentUser) => (
          <Await resolve={boardPromise}>
            {(board) => (
              <Await resolve={standupsPromise}>
                {(standups) => (
                  <Await resolve={boardActiveStandupFormPromise}>
                    {(structure) => {
                      if (!board || !standups || !structure) {
                        return fallback;
                      }

                      return children({
                        currentUser,
                        board,
                        standups,
                        structure,
                      });
                    }}
                  </Await>
                )}
              </Await>
            )}
          </Await>
        )}
      </Await>
    </Suspense>
  );
}

export function TodayStandupNewSkeleton() {
  return (
    <RadixCard
      tabIndex={0}
      size={{
        initial: "3",
        sm: "4",
      }}
      className="group"
    >
      <CardContentSkeleton />
    </RadixCard>
  );
}

function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  const { boardId } = useParams();

  const { isExpanded } = useCurrentUserStandupCard();
  const { viewType } = useBoardViewSettings(parseInt(boardId!, 10));

  return (
    <RadixCard
      variant="surface"
      size={{
        initial: "3",
        sm: "4",
      }}
      className="group"
      style={{
        gridColumn: isExpanded ? "span 2" : undefined,
        alignSelf: viewType === "grid" ? "start" : undefined,
      }}
    >
      {children}
    </RadixCard>
  );
}

function ExpansionButton() {
  const { isExpanded, toggleExpansion } = useCurrentUserStandupCard();
  const { boardId } = useParams();
  const { viewType } = useBoardViewSettings(parseInt(boardId!, 10));

  if (viewType === "feed") {
    return null;
  }

  return (
    <Tooltip content={isExpanded ? "Minimize" : "Expand"}>
      <IconButton
        variant="ghost"
        onClick={toggleExpansion}
        aria-label={isExpanded ? "Minimize card" : "Expand card"}
        className="opacity-0! group-hover:opacity-100! transition-opacity! duration-0!"
      >
        {isExpanded ? (
          <Minimize2Icon size={15} strokeWidth={1.5} className="rotate-45" />
        ) : (
          <Maximize2Icon size={15} strokeWidth={1.5} className="rotate-45" />
        )}
      </IconButton>
    </Tooltip>
  );
}

function CurrentUserStandupCard() {
  const contentRef = useRef<ContentRef>(null);

  // Global keyboard shortcuts - work from anywhere on the page
  useKeyPress("e", () => {
    contentRef.current?.edit();
  });

  useKeyPress(["Meta+Enter", "Control+Enter"], () => {
    contentRef.current?.save();
  });

  useKeyPress("Escape", () => {
    // TODO: pressing escape triggers an error
    contentRef.current?.cancel();
  });

  return (
    <CurrentUserStandupCardProvider>
      <Card>
        <CardContentDataResolver fallback={<CardContentSkeleton />}>
          {({ currentUser, board, standups, structure }) => {
            return (
              <CardContentUI
                ref={contentRef}
                currentUser={currentUser}
                board={board}
                standups={standups}
                structure={structure}
              />
            );
          }}
        </CardContentDataResolver>
      </Card>
    </CurrentUserStandupCardProvider>
  );
}

export default CurrentUserStandupCard;
