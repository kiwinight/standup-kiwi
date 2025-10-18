import { useLoaderData, Await, useFetcher } from "react-router";
import { type Board, type StandupForm } from "types";
import { Suspense, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  IconButton,
  Inset,
  Skeleton,
  Switch,
  Text,
  TextArea,
  TextField,
  Tooltip,
  type ButtonProps,
} from "@radix-ui/themes";
import {
  validateDynamicFormSchema as validateStandupFormSchema,
  type StandupFormField,
  type StandupFormFields,
  type StandupFormSchema,
} from "../board-route/dynamic-form";
import { ArrowUpIcon, ArrowDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { GripHorizontalIcon } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";
import type { loader } from "./board-settings-standups-route";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type ActionType as CreateBoardStandupFormRouteActionType } from "../create-board-standup-form-route/create-board-standup-form-route";
import { useToast } from "~/hooks/use-toast";

const fieldEditSchema = z.object({
  label: z.string().min(1, "Label is required"),
  required: z.boolean(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
});

type FieldEditFormData = z.infer<typeof fieldEditSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, multiple dashes with single dash
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

type FieldProps = {
  field: StandupFormField;
  index?: number;
  defaultIsEditing?: boolean;
  isDraggable?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  onSave?: (updatedField: StandupFormField) => void;
  onCancel?: () => void;
  removeButtonProps?: ButtonProps;
};

function DragHandle({
  controls,
}: {
  controls: ReturnType<typeof useDragControls>;
}) {
  return (
    <Inset
      clip="padding-box"
      side="all"
      pb="current"
      pt="0"
      className="group-hover:opacity-100 opacity-0"
    >
      <Flex
        align="center"
        justify="center"
        height={{
          initial: "20px",
          sm: "28px",
        }}
        className="hover:cursor-move"
        onPointerDown={(e) => {
          controls.start(e);
        }}
      >
        <GripHorizontalIcon size={15} />
      </Flex>
    </Inset>
  );
}

function FieldCard({
  field,
  defaultIsEditing,
  isDraggable,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
  onSave,
  onCancel,
  removeButtonProps,
}: FieldProps) {
  const controls = useDragControls();

  const [isEditing, setIsEditing] = useState(defaultIsEditing);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FieldEditFormData>({
    resolver: zodResolver(fieldEditSchema),
    defaultValues: {
      label: field.label || "",
      required: field.required ?? true,
      description: field.description || "",
      placeholder: field.placeholder || "",
    },
  });

  function handleSave(data: FieldEditFormData) {
    onSave?.({ ...field, ...data });
    setIsEditing(false);
    reset(data);
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
    onCancel?.();
  }

  const cardContent = (
    <Card
      variant="surface"
      size={{
        initial: "2",
        sm: "3",
      }}
      className="group"
    >
      {!isDraggable && <DragHandle controls={controls} />}

      <Flex
        direction="column"
        gap={{
          initial: "4",
          sm: "5",
        }}
      >
        {isEditing ? (
          <form onSubmit={handleSubmit(handleSave)}>
            <Flex direction="column" gap="5">
              <Flex direction="column" gap="2">
                <label htmlFor="label">
                  <Flex align="center" gap="2">
                    <Text as="div" size="2" className="font-semibold">
                      Label
                    </Text>
                    <Text size="1" color="gray">
                      Required
                    </Text>
                  </Flex>
                </label>
                <Controller
                  name="label"
                  control={control}
                  render={({ field: formField }) => (
                    <TextField.Root
                      {...formField}
                      id="label"
                      placeholder="e.g., What are you working on today?"
                    />
                  )}
                />
                {errors.label && (
                  <Text size="1" color="red" mt="1">
                    {errors.label.message}
                  </Text>
                )}
              </Flex>

              <Flex align="center" gap="2">
                <label htmlFor="required">
                  <Text size="2" className="font-semibold">
                    Required
                  </Text>
                </label>

                <Controller
                  name="required"
                  control={control}
                  render={({ field: formField }) => (
                    <Switch
                      id="required"
                      checked={formField.value}
                      onCheckedChange={formField.onChange}
                    />
                  )}
                />
              </Flex>

              <Flex direction="column" gap="2">
                <label htmlFor="description">
                  <Text as="div" size="2" className="font-semibold">
                    Description
                  </Text>
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field: formField }) => (
                    <TextArea
                      {...formField}
                      id="description"
                      placeholder="Help text that explains what kind of answer you're looking for"
                      rows={3}
                    />
                  )}
                />
              </Flex>

              <Flex direction="column" gap="2">
                <label htmlFor="placeholder">
                  <Text as="div" size="2" className="font-semibold">
                    Placeholder
                  </Text>
                </label>
                <Controller
                  name="placeholder"
                  control={control}
                  render={({ field: formField }) => (
                    <TextField.Root
                      {...formField}
                      id="placeholder"
                      placeholder="e.g., List your tasks for today."
                    />
                  )}
                />
              </Flex>
            </Flex>
          </form>
        ) : (
          <Flex key={field.name} direction="column" gap="2">
            <label htmlFor={field.name}>
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
              <TextArea
                id={field.name}
                variant="soft"
                className="w-full min-h-[72px]!"
                resize="none"
                placeholder={field.placeholder}
                value="" // Not allowing users to type
                onChange={() => {}}
              />
            )}

            {field.description && (
              <Text size="2" color="gray">
                {field.description}
              </Text>
            )}
          </Flex>
        )}

        {isEditing ? (
          <Flex justify="end">
            <Flex gap="2">
              <Button variant="soft" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="soft"
                type="submit"
                onClick={handleSubmit(handleSave)}
                disabled={!isDirty}
              >
                Save
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Flex justify="between">
            <Flex gap="2">
              <Flex
                display={{
                  sm: "none",
                }}
                gap="2"
              >
                <Tooltip content="Move up">
                  <IconButton variant="soft" onClick={onMoveUp}>
                    <ArrowUpIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Move down">
                  <IconButton variant="soft" onClick={onMoveDown}>
                    <ArrowDownIcon />
                  </IconButton>
                </Tooltip>
              </Flex>
              <Button variant="soft" onClick={onDuplicate}>
                Duplicate
              </Button>
            </Flex>

            <Flex gap="2">
              <Button
                variant="soft"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>

              <Button variant="soft" onClick={onRemove} {...removeButtonProps}>
                Remove
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Card>
  );

  return (
    <Reorder.Item
      key={field.name}
      value={field}
      dragListener={false}
      dragControls={controls}
      transition={{ duration: 0.2 }}
      layout="position"
      className="select-none"
    >
      {cardContent}
    </Reorder.Item>
  );
}

function FormBuilder({
  boardId,
  initialSchema,
}: {
  boardId: number;
  initialSchema: StandupFormSchema | undefined;
}) {
  const { toast } = useToast();

  const [draftSchema, setDraftSchema] = useState<StandupFormSchema | undefined>(
    initialSchema
  );

  const [isAddingField, setIsAddingField] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const createBoardStandupFormFetcher =
    useFetcher<CreateBoardStandupFormRouteActionType>();

  useEffect(
    function handleCreateBoardStandupFormResponse() {
      if (
        createBoardStandupFormFetcher.state === "idle" &&
        createBoardStandupFormFetcher.data
      ) {
        const error = createBoardStandupFormFetcher.data.error;
        if (error) {
          toast.error(error);
          console.error(error);
        } else {
          toast.success("Standup form has been saved");
        }
      }
    },
    [createBoardStandupFormFetcher.state, createBoardStandupFormFetcher.data]
  );

  function handleMoveUp(index: number) {
    if (index === 0 || !draftSchema) return;

    const newFields = [...draftSchema.fields];
    const temp = newFields[index];
    newFields[index] = newFields[index - 1];
    newFields[index - 1] = temp;

    setDraftSchema({
      ...draftSchema,
      fields: newFields,
    });
  }

  function handleMoveDown(index: number) {
    if (!draftSchema || index === draftSchema.fields.length - 1) return;

    const newFields = [...draftSchema.fields];
    const temp = newFields[index];
    newFields[index] = newFields[index + 1];
    newFields[index + 1] = temp;

    setDraftSchema({
      ...draftSchema,
      fields: newFields,
    });
  }

  function handleReorder(fields: StandupFormFields) {
    if (!draftSchema) return;

    setDraftSchema({
      ...draftSchema,
      fields,
    });
  }

  function handleDuplicate(index: number) {
    if (!draftSchema) return;

    const fieldToDuplicate = draftSchema.fields[index];
    const fields = [...draftSchema.fields];

    const newLabel = `${fieldToDuplicate.label} (Copy)`;

    const newName = slugify(newLabel);

    const duplicatedField = {
      ...fieldToDuplicate,
      name: newName,
      label: newLabel,
    };

    fields.splice(index + 1, 0, duplicatedField);

    setDraftSchema({
      ...draftSchema,
      fields,
    });
  }

  function handleRemove(index: number) {
    if (!draftSchema) return;

    const fields = draftSchema.fields.filter((_, i) => i !== index);

    setDraftSchema({
      ...draftSchema,
      fields,
    });
  }

  function handleUpdate(
    index: number,
    updatedField: Partial<NonNullable<typeof draftSchema>["fields"][number]>
  ) {
    if (!draftSchema) return;

    const fields = [...draftSchema.fields];
    fields[index] = { ...fields[index], ...updatedField };

    setDraftSchema({
      ...draftSchema,
      fields,
    });
  }

  function handleAddingFieldSave(
    field: NonNullable<typeof draftSchema>["fields"][number]
  ) {
    if (!draftSchema) return;

    const uniqueName = slugify(field.label || "field");

    setDraftSchema({
      ...draftSchema,
      fields: [...draftSchema.fields, { ...field, name: uniqueName }],
    });

    setIsAddingField(false);
  }

  function handleAddingFieldCancel() {
    setIsAddingField(false);
  }

  function handleCancelButtonClick() {
    setDraftSchema(initialSchema);
  }

  function handlePreviewButtonClick() {
    setIsPreviewing(true);
  }

  function handleSaveButtonClick() {
    if (!draftSchema) return;
    if (!boardId) return;

    createBoardStandupFormFetcher.submit(
      { schema: JSON.parse(JSON.stringify(draftSchema)) },
      {
        encType: "application/json",
        method: "POST",
        action: `/boards/${boardId}/standup-forms/create`,
      }
    );
  }

  const hasChanges =
    JSON.stringify(draftSchema) !== JSON.stringify(initialSchema);

  if (!draftSchema) {
    return null;
  }

  return (
    <Flex mt="5" direction="column" gap="5">
      <Reorder.Group
        axis="y"
        values={draftSchema.fields}
        onReorder={handleReorder}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
          listStyle: "none",
          padding: 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {draftSchema.fields.map((field, index) => (
          <FieldCard
            key={field.name}
            field={field}
            index={index}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            onDuplicate={() => handleDuplicate(index)}
            onRemove={() => handleRemove(index)}
            onSave={(updatedField) => handleUpdate(index, updatedField)}
            removeButtonProps={{
              disabled: draftSchema.fields.length === 1,
            }}
          />
        ))}
        {isAddingField ? (
          <FieldCard
            field={{
              name: "temp",
              label: "",
              type: "textarea",
              required: true,
              description: "",
              placeholder: "",
            }}
            defaultIsEditing={true}
            isDraggable={true}
            onSave={handleAddingFieldSave}
            onCancel={handleAddingFieldCancel}
          />
        ) : (
          <Flex justify="center" mb="5">
            <Button
              variant="soft"
              onClick={() => setIsAddingField(true)}
              disabled={isAddingField}
            >
              <PlusIcon />
              Add field
            </Button>
          </Flex>
        )}
      </Reorder.Group>

      <Flex justify="between" gap="2">
        <Flex gap="2">
          {/* TODO: Implement preview feature */}
          {/* <Button
            variant="soft"
            highContrast
            size="2"
            type="button"
            onClick={handlePreviewButtonClick}
          >
            Preview
          </Button> */}
        </Flex>

        <Flex gap="2">
          <Button
            highContrast
            size="2"
            type="button"
            variant="outline"
            onClick={handleCancelButtonClick}
            disabled={
              !hasChanges || createBoardStandupFormFetcher.state !== "idle"
            }
          >
            Discard
          </Button>

          <Button
            highContrast
            size="2"
            type="submit"
            disabled={
              !hasChanges || createBoardStandupFormFetcher.state !== "idle"
            }
            onClick={handleSaveButtonClick}
            loading={createBoardStandupFormFetcher.state !== "idle"}
          >
            Save
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

function FormBuilderDataResolver({
  children,
  fallback,
}: {
  children: (data: {
    initialSchema: StandupFormSchema | undefined;
    board: Board | null;
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { boardActiveStandupFormPromise, boardPromise } =
    useLoaderData<typeof loader>();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={boardPromise}>
        {(board) => {
          return (
            <Await resolve={boardActiveStandupFormPromise}>
              {(boardActiveStandupForm) => {
                const initialSchema: StandupFormSchema | undefined =
                  validateStandupFormSchema(boardActiveStandupForm?.schema);

                return children({ initialSchema, board });
              }}
            </Await>
          );
        }}
      </Await>
    </Suspense>
  );
}

function StandupFormSetting() {
  return (
    <Card
      size={{
        initial: "3",
        sm: "4",
      }}
    >
      <Flex direction="column" gap="2">
        <Text size="4" weight="bold">
          Standup form
        </Text>

        <Text size="2" color="gray">
          Add, edit, and reorder fields for your board's standup form.
        </Text>
      </Flex>
      <FormBuilderDataResolver fallback={<FormBuilderSkeleton />}>
        {({ board, initialSchema }) => {
          if (!board) return <FormBuilderSkeleton />;
          if (!initialSchema) return <FormBuilderSkeleton />;
          return (
            <FormBuilder boardId={board.id} initialSchema={initialSchema} />
          );
        }}
      </FormBuilderDataResolver>
    </Card>
  );
}

function FormBuilderSkeleton() {
  return (
    <Flex mt="5" direction="column" gap="5">
      {/* Skeleton for 3 field cards */}
      {[1, 2, 3].map((index) => (
        <Card
          key={index}
          variant="surface"
          size={{
            initial: "2",
            sm: "3",
          }}
        >
          <Inset clip="padding-box" side="all" pb="current" pt="0">
            <Flex
              align="center"
              justify="center"
              height={{
                initial: "20px",
                sm: "28px",
              }}
            ></Flex>
          </Inset>

          <Flex
            direction="column"
            gap={{
              initial: "4",
              sm: "5",
            }}
          >
            <Flex direction="column" gap="2">
              <label>
                <Flex align="center" gap="2">
                  <Text size="2" className="font-semibold">
                    <Skeleton>What did you do yesterday?</Skeleton>
                  </Text>
                  <Text size="1" color="gray">
                    <Skeleton>Required</Skeleton>
                  </Text>
                </Flex>
              </label>
              <Skeleton width="100%">
                <Box py="1" px="2" height="72px" />
              </Skeleton>
            </Flex>

            <Flex justify="between">
              <Flex gap="2">
                <Skeleton>
                  <Button variant="soft">Duplicate</Button>
                </Skeleton>
              </Flex>

              <Flex gap="2">
                <Skeleton>
                  <Button variant="soft">Edit</Button>
                </Skeleton>
                <Skeleton>
                  <Button variant="soft">Remove</Button>
                </Skeleton>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      ))}

      {/* Add field button */}
      <Flex justify="center" mb="5">
        <Skeleton>
          <Button variant="soft" disabled>
            <PlusIcon />
            Add field
          </Button>
        </Skeleton>
      </Flex>

      {/* Action buttons */}
      <Flex justify="between" gap="2">
        <Flex gap="2" />

        <Flex gap="2">
          <Skeleton>
            <Button highContrast size="2" variant="outline" disabled>
              Discard
            </Button>
          </Skeleton>

          <Skeleton>
            <Button highContrast size="2" disabled>
              Save
            </Button>
          </Skeleton>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default StandupFormSetting;
