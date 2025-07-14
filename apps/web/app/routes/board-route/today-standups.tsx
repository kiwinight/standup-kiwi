import { Await, useLoaderData, useRouteLoaderData } from "react-router";
import type { loader } from "./board-route";
import { Suspense } from "react";
import {
  Box,
  Card,
  Flex,
  Grid,
  Text,
  Tooltip,
  useThemeContext,
} from "@radix-ui/themes";
import { DateTime } from "luxon";
import type { Board, Standup, StandupForm } from "types";
import { validateDynamicFormSchema } from "./dynamic-form";
import { parseMarkdownToHtml } from "~/libs/markdown";
import { type DynamicFormValues } from "./dynamic-form";
import TodayStandupNew from "./today-standup-new";
import type { loader as rootLoader } from "~/root";
import { SuspenseFallback } from "./past-standups-new";

function TodayStandups() {
  const { appearance } = useThemeContext();

  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const currentUserPromise =
    rootData?.currentUserPromise ?? Promise.resolve(null);
  const {
    boardPromise,
    standupsPromise,
    standupFormsPromise,
    collaboratorsPromise,
  } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Await resolve={currentUserPromise}>
        {(currentUser) => {
          if (!currentUser) {
            return <div>Error...</div>;
          }

          return (
            <Await resolve={boardPromise}>
              {(board) => {
                if (!board) {
                  return <div>Error...</div>;
                }

                return (
                  <Await resolve={standupsPromise}>
                    {(standups) => {
                      if (!standups) {
                        return <div>Error...</div>;
                      }

                      return (
                        <Await resolve={standupFormsPromise}>
                          {(standupForms) => {
                            if (!standupForms) {
                              return <div>Error...</div>;
                            }

                            return (
                              <Await resolve={collaboratorsPromise}>
                                {(collaborators) => {
                                  if (!collaborators) {
                                    return <div>Error...</div>;
                                  }

                                  const boardTimezone = board.timezone;

                                  const today = DateTime.now()
                                    .setZone(boardTimezone)
                                    .startOf("day"); // 2025-01-13T00:00:00.000Z

                                  const todayStandups = standups.filter(
                                    (standup) =>
                                      DateTime.fromISO(standup.createdAt, {
                                        zone: "utc",
                                      })
                                        .setZone(boardTimezone)
                                        .startOf("day")
                                        .equals(today)
                                  );

                                  const otherStandups = todayStandups.filter(
                                    (standup) =>
                                      standup.userId !== currentUser.id
                                  );

                                  return (
                                    <Flex direction="column" gap="5">
                                      <Flex direction="column" gap="5">
                                        <Text size="3" weight="bold">
                                          Today
                                        </Text>
                                      </Flex>
                                      <Grid
                                        // direction={{
                                        //   initial: "column",
                                        //   sm: "row",
                                        // }}
                                        // gap={{
                                        //   initial: "5",
                                        // }}
                                        columns={{
                                          initial: "1",
                                          sm: "2",
                                        }}
                                        gap="5"
                                      >
                                        <TodayStandupNew />
                                        {otherStandups.map((standup) => {
                                          const form = standupForms.find(
                                            (form) => form.id === standup.formId
                                          );

                                          const schema =
                                            validateDynamicFormSchema(
                                              form?.schema
                                            );

                                          if (!schema) {
                                            return null;
                                          }

                                          const user = collaborators.find(
                                            (collaborator) =>
                                              collaborator.userId ===
                                              standup.userId
                                          )?.user;

                                          if (!user) {
                                            return null;
                                          }

                                          return (
                                            <Card
                                              key={standup.id}
                                              variant="surface"
                                              size={{
                                                initial: "3",
                                                sm: "4",
                                              }}
                                            >
                                              <Flex
                                                direction="column"
                                                gap="5"
                                                align="start"
                                              >
                                                <Tooltip
                                                  content={
                                                    <Flex
                                                      direction="column"
                                                      gap="1"
                                                    >
                                                      <Text size="2">
                                                        {user.primary_email}
                                                      </Text>
                                                      <Text size="2">
                                                        Last saved at{" "}
                                                        {DateTime.fromISO(
                                                          standup.createdAt,
                                                          {
                                                            zone: "utc",
                                                          }
                                                        )
                                                          .setZone(
                                                            boardTimezone
                                                          )
                                                          .toLocaleString(
                                                            DateTime.DATETIME_MED
                                                          )}{" "}
                                                        ({boardTimezone})
                                                      </Text>
                                                    </Flex>
                                                  }
                                                >
                                                  <Text size="4" weight="bold">
                                                    {
                                                      user.primary_email.split(
                                                        "@"
                                                      )[0]
                                                    }
                                                  </Text>
                                                </Tooltip>
                                                {schema.fields.map((field) => {
                                                  const value = (
                                                    standup.formData as Standup["formData"] as DynamicFormValues
                                                  )[field.name];

                                                  if (!value) {
                                                    return null;
                                                  }

                                                  const html =
                                                    parseMarkdownToHtml(value);

                                                  return (
                                                    <Flex
                                                      key={field.name}
                                                      direction="column"
                                                      gap="2"
                                                    >
                                                      <Text
                                                        size="2"
                                                        weight="medium"
                                                      >
                                                        {field.label}
                                                      </Text>
                                                      <Box
                                                        className={`prose prose-sm ${
                                                          appearance === "dark"
                                                            ? "dark:prose-invert"
                                                            : ""
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                          __html: html,
                                                        }}
                                                      />
                                                    </Flex>
                                                  );
                                                })}
                                              </Flex>
                                            </Card>
                                          );
                                        })}
                                      </Grid>
                                    </Flex>
                                  );
                                }}
                              </Await>
                            );
                          }}
                        </Await>
                      );
                    }}
                  </Await>
                );
              }}
            </Await>
          );
        }}
      </Await>
    </Suspense>
  );
}

export default TodayStandups;
