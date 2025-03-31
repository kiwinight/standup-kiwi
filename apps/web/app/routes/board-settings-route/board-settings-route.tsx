import { Button, Card, Flex, Select, Text, TextField } from "@radix-ui/themes";
import {
  data,
  useLoaderData,
  type ActionFunctionArgs,
  redirect,
  Form,
} from "react-router";
import type { Route } from "./+types/board-settings-route";
import { use, useMemo } from "react";
import React from "react";
import { alertFeatureNotImplemented } from "../../libs/alert";
import verifyAuthentication from "~/libs/auth";
import { isApiErrorResponse, type ApiResponse, type Board } from "types";
import { RouteErrorResponse } from "~/root";
import { commitSession } from "~/libs/auth-session.server";

function getBoard(boardId: string, { accessToken }: { accessToken: string }) {
  return fetch(import.meta.env.VITE_API_URL + `/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => response.json() as Promise<ApiResponse<Board>>);
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken } = await verifyAuthentication(request);

  const boardId = params.boardId;

  const boardPromise = getBoard(boardId, { accessToken }).then((data) => {
    if (isApiErrorResponse(data)) {
      throw new RouteErrorResponse(
        data.statusCode,
        data.message,
        Error(data.error)
      );
    }
    return data;
  });

  return data({ boardPromise });
}

function getFormName(formData: FormData): string | undefined {
  return formData.get("name")?.toString().trim();
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { accessToken, refreshed, session } =
    await verifyAuthentication(request);

  const boardId = params.boardId;

  let formData = await request.formData();

  const name = getFormName(formData);

  const board = await fetch(
    import.meta.env.VITE_API_URL + `/boards/${boardId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then(async (response) => {
    const data: ApiResponse<Board> = await response.json();

    return data;
  });

  if (isApiErrorResponse(board)) {
    return data(
      {
        errors: {
          name: "Failed to update board",
        },
      },
      {
        headers: {
          ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
        },
      }
    );
  }

  return redirect("/boards/" + board.id + "/settings", {
    headers: {
      ...(session ? { "Set-Cookie": await commitSession(session) } : {}),
    },
  });
}

export default function BoardSettingsRoute({}: Route.ComponentProps) {
  const { boardPromise } = useLoaderData<typeof loader>();

  const board = use(boardPromise);

  const [boardName, setBoardName] = React.useState(board.name ?? "");

  // Get all available timezones using the Intl API
  const timezones = useMemo(() => {
    // Get all timezone identifiers
    const timezoneIds = Intl.supportedValuesOf("timeZone");

    // Current date to show current offset
    const now = new Date();

    // Group timezones by offset
    const groups: Record<
      string,
      { value: string; label: string; offset: string }[]
    > = {};

    timezoneIds.forEach((id) => {
      // Get the city name from the ID
      const cityName = id.split("/").pop()?.replace(/_/g, " ");

      // Create timezone-specific formatter to get the correct UTC offset
      const tzFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: id,
        timeZoneName: "shortOffset",
      });

      // Get the UTC offset from formatter
      const rawOffset =
        tzFormatter
          .formatToParts(now)
          .find((part) => part.type === "timeZoneName")?.value || "";

      // Convert GMT+X to UTC+X format and handle the case where it shows "UTCGMT"
      let utcOffset = rawOffset.replace(/GMT([+-]\d+)/, "UTC$1");

      // Clean up any cases of "UTCGMT" that appear
      utcOffset = utcOffset.replace("UTCGMT", "UTC+00");

      // If the rawOffset is just "GMT" without a number, treat it as UTC+00
      if (rawOffset === "GMT") {
        utcOffset = "UTC+00";
      }

      // Format the offset for sorting (e.g., "UTC+9" -> "+09")
      let formattedOffset = utcOffset.replace(
        /UTC([+-])(\d+)/,
        (_, sign, hours) => {
          // Pad with leading zero if needed
          return `${sign}${hours.padStart(2, "0")}`;
        }
      );

      // For UTC+00, make sure we have the right format
      if (utcOffset === "UTC+00" || utcOffset === "UTC-00") {
        formattedOffset = "+00";
      }

      // The key for grouping - we'll use the full UTC+X format
      const groupKey = `UTC${formattedOffset}`;

      // Create a user-friendly label with the required format
      const label = `${cityName}`;

      // Use formatted offset as the group key
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push({
        value: id,
        label: label,
        offset: formattedOffset, // Store the formatted offset for display
      });
    });

    // Sort the groups by UTC offset
    const sortedGroups: Record<
      string,
      { value: string; label: string; offset: string }[]
    > = {};

    Object.keys(groups)
      .sort((a, b) => {
        // Extract numeric offset values for sorting
        const offsetA = a.replace(/UTC([+-])(\d+)/, "$1$2");
        const offsetB = b.replace(/UTC([+-])(\d+)/, "$1$2");

        return parseInt(offsetA, 10) - parseInt(offsetB, 10);
      })
      .forEach((key) => {
        sortedGroups[key] = groups[key].sort((a, b) =>
          a.label.localeCompare(b.label)
        );
      });

    return sortedGroups;
  }, []);

  return (
    <>
      <Card
        size={{
          initial: "2",
          sm: "4",
        }}
      >
        <Form method="post">
          <Flex direction="column">
            <Text size="4" weight="bold">
              Board name
            </Text>
            <Flex direction="column" mt="5" gap="5">
              <Flex key="name" direction="column" gap="2">
                <TextField.Root
                  name="name"
                  placeholder="e.g. Daily Standup"
                  size="2"
                  defaultValue={board.name}
                  onChange={(e) => setBoardName(e.target.value)}
                />
                <Text color="gray" size="2">
                  Give your standup board a clear and recognizable name.
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex justify="end" mt="5" gap="2">
            <Button
              highContrast
              size="2"
              type="submit"
              disabled={board.name === boardName}
            >
              Save
            </Button>
          </Flex>
        </Form>
      </Card>

      <Card
        size={{
          initial: "2",
          sm: "4",
        }}
      >
        <form
          method="post"
          onSubmit={(event) => {
            event.preventDefault();
            alertFeatureNotImplemented();
          }}
        >
          <Flex direction="column">
            <Text size="4" weight="bold">
              Timezone
            </Text>
            <Flex direction="column" mt="5" gap="5">
              <Flex key="name" direction="column" gap="2">
                <Text size="2" weight="medium">
                  Standup timezone
                </Text>

                <Select.Root defaultValue="UTC">
                  <Select.Trigger />
                  <Select.Content>
                    {Object.entries(timezones).map(
                      ([offsetGroup, timezoneList]) => (
                        <React.Fragment key={offsetGroup}>
                          <Select.Group>
                            <Select.Label>{offsetGroup}</Select.Label>
                            {timezoneList.map((tz) => (
                              <Select.Item key={tz.value} value={tz.value}>
                                (UTC{tz.offset}) {tz.label}
                              </Select.Item>
                            ))}
                          </Select.Group>
                          <Select.Separator />
                        </React.Fragment>
                      )
                    )}
                  </Select.Content>
                </Select.Root>
                <Text color="gray" size="2">
                  This timezone determines the date assigned to all standups on
                  this board. Standups are recorded based on the selected
                  timezone.
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex justify="end" mt="5" gap="2">
            <Button highContrast size="2" type="submit" loading={false}>
              Save
            </Button>
          </Flex>
        </form>
      </Card>
    </>
  );
}
