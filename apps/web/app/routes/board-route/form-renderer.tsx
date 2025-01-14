import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Box, TextArea, Button, Text, Skeleton } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const fieldSchema = z.object({
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
});

export const formSchema = z.object({
  title: z.string().optional(), // Form title
  description: z.string().optional(), // Form description
  fields: z.array(fieldSchema).min(1), // Array of fields
});

type FormInputs = {
  [key: string]: any; // Allows dynamic field names
};

function FormRenderer({ schema }: { schema: z.infer<typeof formSchema> }) {
  const { title, description, fields } = formSchema.parse(schema);

  // Create a dynamic validation schema based on the fields
  const dynamicSchema = z.object(
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
  } = useForm<FormInputs>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {} as FormInputs),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log("Form Data:", data);
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
        <Box mt="5">
          {fields.map((field, index) => {
            return (
              <Flex
                key={field.name}
                mt={index === 0 ? "0" : "5"}
                direction="column"
                gap="2"
              >
                <label>
                  <Text size="2" weight="medium">
                    {field.label} {field.required && "*"}
                  </Text>
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
        </Box>
        <Flex justify="end" mt="5" gap="2">
          {false && (
            // TODO: If already submitted, show cancel button
            <Button highContrast size="2" variant="soft" onClick={() => {}}>
              Cancel
            </Button>
          )}
          <Button highContrast size="2" type="submit">
            Save
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}

export default FormRenderer;

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
              <Text size="2" weight="medium">
                <Skeleton>What did you do yesterday? *</Skeleton>
              </Text>
            </label>
            <Skeleton height="80px" />
          </Flex>

          <Flex direction="column" gap="2" mt="5">
            <label>
              <Text size="2" weight="medium">
                <Skeleton>What will you do today? *</Skeleton>
              </Text>
            </label>
            <Skeleton height="80px" />
          </Flex>

          <Flex direction="column" gap="2" mt="5">
            <label>
              <Text size="2" weight="medium">
                <Skeleton>Do you have any blockers?</Skeleton>
              </Text>
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
