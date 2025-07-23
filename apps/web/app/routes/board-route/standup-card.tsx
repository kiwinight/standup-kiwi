import {
  useThemeContext,
  Card,
  Flex,
  Tooltip,
  Text,
  Box,
} from "@radix-ui/themes";
import { DateTime } from "luxon";
import type { Standup, StandupForm, User, Board } from "types";
import { parseMarkdownToHtml } from "~/libs/markdown";
import {
  validateDynamicFormSchema,
  type DynamicFormValues,
} from "./dynamic-form";

function StandupCard({
  standup,
  standupForm,
  user,
  boardTimezone,
  style,
}: {
  standup: Standup;
  standupForm: StandupForm | undefined;
  user: User;
  boardTimezone: Board["timezone"];
  style?: React.CSSProperties;
}) {
  const { appearance } = useThemeContext();

  const schema = validateDynamicFormSchema(standupForm?.schema);

  if (!schema) {
    return null;
  }

  return (
    <Card
      variant="surface"
      size={{
        initial: "3",
        sm: "4",
      }}
      style={style}
    >
      <Flex direction="column" gap="5" align="start">
        <Tooltip
          content={
            <Flex direction="column" gap="1">
              <Text size="2">{user.primary_email}</Text>
              <Text size="2">
                Last saved at{" "}
                {DateTime.fromISO(standup.createdAt, {
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
            {user.primary_email.split("@")[0]}
          </Text>
        </Tooltip>
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
  );
}

export default StandupCard;
