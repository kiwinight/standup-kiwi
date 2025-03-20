import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Select,
  TabNav,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Link, useParams } from "react-router";
import Toolbar from "../board-route/toolbar";
import type { Route } from "./+types/board-settings-route";
import { useState, useMemo } from "react";
import React from "react";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export async function loader({ request, params }: Route.LoaderArgs) {
  return null;
}

export default function BoardSettingsRoute({}: Route.ComponentProps) {
  const { boardId } = useParams();

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
    <Container my="7" maxWidth="672px" px="4">
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
          <Flex>
            <Text size="6" weight="bold">
              Board Settings
            </Text>
          </Flex>
          <Box>
            <TabNav.Root>
              <TabNav.Link href={`/boards/${boardId}/settings`} active>
                General
              </TabNav.Link>
              <TabNav.Link href={`/boards/${boardId}/settings/sharing`}>
                Sharing
              </TabNav.Link>
            </TabNav.Root>
          </Box>
        </Flex>

        <Card
          size={{
            initial: "2",
            sm: "4",
          }}
        >
          <form
            method="post"
            onSubmit={(event) => {
              console.log("Not implemented!");
            }}
          >
            <Flex direction="column">
              <Text size="4" weight="bold">
                Board name
              </Text>
              <Flex direction="column" mt="5" gap="5">
                <Flex key="name" direction="column" gap="2">
                  {/* <Text size="2" weight="medium">
                    Board name
                  </Text> */}
                  <TextField.Root
                    name="name"
                    placeholder="e.g. Daily Standup"
                    size="2"
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
                disabled
                loading={false}
              >
                Save
              </Button>
            </Flex>
          </form>
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
              console.log("Not implemented!");
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
                    This timezone determines the date assigned to all standups
                    on this board. Standups are recorded based on the selected
                    timezone.
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex justify="end" mt="5" gap="2">
              <Button
                highContrast
                size="2"
                type="submit"
                disabled
                loading={false}
              >
                Save
              </Button>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}
