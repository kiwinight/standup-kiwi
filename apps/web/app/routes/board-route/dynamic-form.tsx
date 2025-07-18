import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Box, TextArea, Button, Text, Skeleton } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useImperativeHandle, useEffect, useRef, type Ref } from "react";
import type { ComponentProps } from "react";

function AutoSizeTextArea({ ...props }: ComponentProps<typeof TextArea>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [props.value]);

  return <TextArea ref={textareaRef} {...props} />;
}

export function validateDynamicFormSchema(schema: unknown) {
  try {
    return dynamicFormSchema.parse(schema);
  } catch (error) {
    console.error("Error parsing schema", error);
    return undefined;
  }
}

const dynamicFormSchema = z.object({
  // description: z.string().optional(), // Form description
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

export type DynamicFormValues = {
  [key: string]: any; // Allows dynamic field names
};

export type DynamicFormRef = {
  submit: () => void;
};

function DynamicForm({
  ref,
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  loading,
  showCancelButton = true,
}: {
  ref: Ref<DynamicFormRef>;
  schema: z.infer<typeof dynamicFormSchema>;
  defaultValues?: DynamicFormValues;
  onSubmit: (data: DynamicFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  showCancelButton?: boolean;
}) {
  const { fields } = schema;

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
  } = useForm<DynamicFormValues>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues:
      defaultValues ||
      fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue || "";
        return acc;
      }, {} as DynamicFormValues),
  });

  useImperativeHandle(
    ref,
    () => ({
      submit: () => {
        handleFormSubmit();
      },
    }),
    []
  );

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form method="post" onSubmit={handleFormSubmit}>
      <Flex direction="column">
        <Flex direction="column" gap="5">
          {fields.map((field) => {
            return (
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
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <AutoSizeTextArea
                        variant="soft"
                        className="w-full min-h-[72px]!"
                        resize="none"
                        value={value}
                        onChange={onChange}
                        placeholder={field.placeholder}
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
        <Flex justify="end" mt="5" gap="3">
          {showCancelButton && (
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

export function DynamicFormSkeleton() {
  return (
    <form>
      <Flex direction="column">
        <Flex direction="column" gap="5">
          <Flex direction="column" gap="2">
            <label>
              <Flex align="center" gap="2">
                <Text size="2" className="font-semibold">
                  <Skeleton>What did you do yesterday? *</Skeleton>
                </Text>
              </Flex>
            </label>
            <Skeleton width="100%">
              <Box py="1" px="2" height="72px" />
            </Skeleton>
          </Flex>

          <Flex direction="column" gap="2">
            <label>
              <Flex align="center" gap="2">
                <Text size="2" className="font-semibold">
                  <Skeleton>What will you do today? *</Skeleton>
                </Text>
              </Flex>
            </label>
            <Skeleton width="100%">
              <Box py="1" px="2" height="72px" />
            </Skeleton>
          </Flex>

          <Flex direction="column" gap="2">
            <label>
              <Flex align="center" gap="2">
                <Text size="2" className="font-semibold">
                  <Skeleton>Do you have any blockers?</Skeleton>
                </Text>
              </Flex>
            </label>
            <Skeleton width="100%">
              <Box py="1" px="2" height="72px" />
            </Skeleton>
          </Flex>
        </Flex>
        <Flex justify="end" gap="2" mt="5">
          <Skeleton>
            <Button size="2">Save</Button>
          </Skeleton>
        </Flex>
      </Flex>
    </form>
  );
}
