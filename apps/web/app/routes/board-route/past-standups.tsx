import { DateTime } from "luxon";
import { Suspense, use } from "react";
import { useLoaderData } from "react-router";
import type { loader } from "./board-route";
import {
  validateDynamicFormSchema,
  type DynamicFormValues,
} from "./dynamic-form";
import {
  Box,
  Card,
  Flex,
  Skeleton,
  Text,
  Tooltip,
  useThemeContext,
} from "@radix-ui/themes";
import { type Standup } from "types";
import { parseMarkdownToHtml } from "~/libs/markdown";

type Props = {};

function Standups() {
  const { appearance } = useThemeContext();

  const { boardPromise, standupsPromise, standupFormsPromise } =
    useLoaderData<typeof loader>();

  const board = use(boardPromise);

  if (!board) {
    return <SuspenseFallback />;
  }

  const standups = use(standupsPromise);
  const standupForms = use(standupFormsPromise);

  if (!standups || !standupForms) {
    return <SuspenseFallback />;
  }

  const boardTimezone = board.timezone;

  const today = DateTime.now().setZone(boardTimezone).startOf("day"); // 2025-01-13T00:00:00.000Z

  const pastStandups = standups.filter(
    (standup) =>
      !DateTime.fromISO(standup.createdAt, { zone: "utc" })
        .setZone(boardTimezone)
        .startOf("day")
        .equals(today)
  );

  if (pastStandups.length === 0) {
    return (
      <Flex direction="column" gap="5">
        <Box>
          <Text size="3" weight="bold">
            Past Standups
          </Text>
        </Box>
        <Card
          size={{
            initial: "3",
            sm: "4",
          }}
        >
          <Flex
            direction="column"
            justify="center"
            align="center"
            gap="2"
            py="128px"
            maxWidth="360px"
            mx="auto"
          >
            <Text weight="medium" size="2">
              No past standups
            </Text>
            <Text size="2" align="center">
              Standups from all previous days will appear here once you start
              submitting updates.
            </Text>
          </Flex>
        </Card>
      </Flex>
    );
  }

  return pastStandups.map((standup) => {
    const form = standupForms.find((form) => form.id === standup.formId);

    const schema = validateDynamicFormSchema(form?.schema);

    if (!schema) {
      return null;
    }

    return (
      <Flex direction="column" gap="5">
        <Box>
          <Tooltip
            content={DateTime.fromISO(standup.createdAt)
              .setZone(boardTimezone)
              .toLocaleString(DateTime.DATETIME_FULL)}
          >
            <Text size="3" weight="bold">
              {DateTime.fromISO(standup.createdAt)
                .setZone(boardTimezone)
                .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
            </Text>
          </Tooltip>
        </Box>
        <Card
          key={standup.id}
          variant="surface"
          size={{
            initial: "3",
            sm: "4",
          }}
        >
          <Flex direction="column" gap="5" align="start">
            {schema.fields.map((field) => {
              const value = (
                standup.formData as Standup["formData"] as DynamicFormValues
              )[field.name];

              if (!value) {
                return null;
              }

              const html = parseMarkdownToHtml(value);

              return (
                <Flex key={field.name} direction="column" gap="2">
                  <Text size="2" weight="medium">
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
        </Card>
      </Flex>
    );
  });
}

function PastStandups({}: Props) {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Standups />
    </Suspense>
  );
}

function SuspenseFallback() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Flex key={index} direction="column" gap="5">
          <Text size="3" weight="bold">
            <Skeleton>Thu, Jun 19, 2025</Skeleton>
          </Text>
          <Card
            variant="surface"
            size={{
              initial: "3",
              sm: "4",
            }}
          >
            <Flex direction="column" gap="5" align="start">
              {/* <Text size="4" weight="bold">
              <Skeleton>Fri, Jan 17, 2025</Skeleton>
            </Text> */}
              <Flex direction="column" gap="5">
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">
                    <Skeleton>What did you do yesterday?</Skeleton>
                  </Text>
                  <Text size="2" className="max-h-[40px] overflow-hidden">
                    <Skeleton width="100%">
                      {Array.from({ length: 500 }).map((_, index) => "A ")}
                    </Skeleton>
                  </Text>
                </Flex>
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">
                    <Skeleton>What did you do yesterday?</Skeleton>
                  </Text>
                  <Text size="2" className="max-h-[40px] overflow-hidden">
                    <Skeleton width="100%">
                      {Array.from({ length: 500 }).map((_, index) => "A ")}
                    </Skeleton>
                  </Text>
                </Flex>
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">
                    <Skeleton>What did you do yesterday?</Skeleton>
                  </Text>
                  <Text size="2" className="max-h-[40px] overflow-hidden">
                    <Skeleton width="100%">
                      {Array.from({ length: 500 }).map((_, index) => "A ")}
                    </Skeleton>
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      ))}
    </>
  );
}

export default PastStandups;
