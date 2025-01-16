import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Box, TextArea, Button, Text, Skeleton } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  title: z.string().optional(), // Form title
  description: z.string().optional(), // Form description
  fields: z
    .array(
      z.object({
        name: z.string().nonempty(), // Field identifier
        label: z.string().optional(), // Label for the field
        description: z.string().optional(), // Field description/helper text
        type: z
          .enum([
            // "text",
            // "number",
            // "email",
            // "password",
            // "checkbox",
            // "radio",
            // "select",
            "textarea",
          ])
          .default("textarea"), // Type of field
        placeholder: z.string().optional(), // Placeholder text
        required: z.boolean().default(true), // Is field required?
        defaultValue: z.any().optional(), // Default value
        validations: z
          .object({
            minLength: z.number().optional(),
            maxLength: z.number().optional(),
            min: z.number().optional(),
            max: z.number().optional(),
            regex: z.instanceof(RegExp).optional(),
          })
          .optional(), // Validation rules
        options: z
          .array(
            z.object({
              value: z.any(),
              label: z.string(),
            })
          )
          .optional(), // Options for select or radio buttons
      })
    )
    .min(1), // Array of fields
});

export type DynamicFormInputs = {
  [key: string]: any; // Allows dynamic field names
};

function DynamicForm({
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  loading,
}: {
  schema: z.infer<typeof formSchema>;
  defaultValues?: DynamicFormInputs;
  onSubmit: (data: DynamicFormInputs) => void;
  onCancel?: () => void;
  loading?: boolean;
}) {
  // TODO: handle case when schema is not valid
  const { title, description, fields } = formSchema.parse(schema);

  const dynamicFormSchema = z.object(
    fields.reduce((acc, field) => {
      if (field.type === "textarea") {
        let fieldValidation = z.string();

        if (field.validations) {
          fieldValidation = fieldValidation
            .min(field.validations.minLength || 0)
            .max(field.validations.maxLength || Infinity);
        }

        acc[field.name] = field.required
          ? fieldValidation.nonempty()
          : fieldValidation.optional();
      }

      return acc;
    }, {} as { [key: string]: z.ZodType })
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DynamicFormInputs>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues:
      defaultValues ||
      fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue || "";
        return acc;
      }, {} as DynamicFormInputs),
  });

  return (
    <form
      method="post"
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
      })}
    >
      <Flex direction="column">
        <Text size="4" weight="bold">
          {title}
        </Text>
        {description && (
          <Text size="2" mt="1">
            {description}
          </Text>
        )}
        <Flex direction="column" mt="5" gap="5">
          {fields.map((field) => {
            return (
              <Flex key={field.name} direction="column" gap="2">
                <label>
                  <Flex align="center" gap="2">
                    <Text size="2" weight="medium">
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
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextArea
                        value={value}
                        onChange={onChange}
                        variant="soft"
                        placeholder={field.placeholder}
                        className="w-full !min-h-[80px]"
                        resize="vertical"
                      />
                    )}
                  />
                )}

                {field.description && (
                  <Text size="2" color="gray">
                    {field.description}
                  </Text>
                )}

                {errors[field.name] && (
                  <Text size="2" color="red">
                    {(errors[field.name]?.message as string) || "Invalid input"}
                  </Text>
                )}
              </Flex>
            );
          })}
        </Flex>
        <Flex justify="end" mt="5" gap="2">
          {defaultValues && (
            <Button
              highContrast
              type="button"
              size="2"
              variant="surface"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button highContrast size="2" type="submit" loading={loading}>
            Save
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}

export default DynamicForm;

export function FormSkeleton() {
  return (
    <form>
      <Flex direction="column">
        <Text size="4" weight="bold">
          <Skeleton>Today's Standup</Skeleton>
        </Text>
        <Box mt="5">
          <Flex direction="column" gap="2">
            <label>
              <Flex>
                <Text size="2" weight="medium">
                  <Skeleton>What did you do yesterday? *</Skeleton>
                </Text>
              </Flex>
            </label>
            <Skeleton height="80px" />
          </Flex>

          <Flex direction="column" gap="2" mt="5">
            <label>
              <Flex>
                <Text size="2" weight="medium">
                  <Skeleton>What will you do today? *</Skeleton>
                </Text>
              </Flex>
            </label>
            <Skeleton height="80px" />
          </Flex>

          <Flex direction="column" gap="2" mt="5">
            <label>
              <Flex>
                <Text size="2" weight="medium">
                  <Skeleton>Do you have any blockers?</Skeleton>
                </Text>
              </Flex>
            </label>
            <Skeleton height="80px" />
            <Text size="2" color="gray">
              <Skeleton>
                Share any challenges or obstacles that might slow down your
                progress
              </Skeleton>
            </Text>
          </Flex>
        </Box>
        <Flex justify="end" mt="5" gap="2">
          <Skeleton>
            <Button size="2">Save</Button>
          </Skeleton>
        </Flex>
      </Flex>
    </form>
  );
}
