import { useLoaderData, data, Await, useParams } from "react-router";
import { type ApiData, isErrorData, type StandupForm } from "types";
import { commitSession } from "~/libs/auth-session.server";
import requireAuthenticated from "~/libs/auth";
import { Suspense, useState } from "react";
import { ApiError } from "~/root";
import type { Route } from "./+types/board-settings-standups-route";
import { getBoard, getStandupForm } from "../board-route/board-route";
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  IconButton,
  Inset,
  Separator,
  Switch,
  Tabs,
  Text,
  TextArea,
  TextField,
  Tooltip,
} from "@radix-ui/themes";
import {
  AutoSizeTextArea,
  validateDynamicFormSchema,
} from "../board-route/dynamic-form";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Pencil1Icon,
  Pencil2Icon,
  PlusIcon,
  CopyIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { GripHorizontalIcon } from "lucide-react";
import { Reorder, useDragControls } from "motion/react";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { accessToken, session, refreshed } = await requireAuthenticated(
    request
  );

  const boardId = parseInt(params.boardId, 10);

  if (isNaN(boardId) || boardId <= 0) {
    throw new ApiError("Invalid board ID", 400);
  }

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const boardDataPromise = getBoard(boardId, { accessToken });

  const boardPromise = getBoard(boardId, { accessToken }).then((data) => {
    if (isErrorData(data)) {
      return null;
    }
    return data;
  });

  const boardActiveStandupFormPromise = boardPromise.then((board) => {
    if (!board) {
      return null;
    }

    if (!board.activeStandupFormId) {
      return null;
    }

    return getStandupForm(
      {
        standupFormId: board.activeStandupFormId,
        boardId: board.id,
      },
      { accessToken }
    ).then((data) => {
      if (isErrorData(data)) {
        return null;
      }
      return data;
    });
  });

  return data(
    {
      baseUrl,
      boardDataPromise,
      boardPromise,
      boardActiveStandupFormPromise,
    },
    {
      headers: {
        ...(refreshed ? { "Set-Cookie": await commitSession(session) } : {}),
      },
    }
  );
}

function BoardExistanceGuard() {
  const { boardDataPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense>
      <Await resolve={boardDataPromise}>
        {(data) => {
          if (isErrorData(data)) {
            throw new ApiError(data.message, data.statusCode);
          }
          return null;
        }}
      </Await>
    </Suspense>
  );
}

export default function BoardSettingsCollaboratorsRoute({}: Route.ComponentProps) {
  return (
    <>
      <BoardExistanceGuard />

      <TemporarySetting />
    </>
  );
}

function ComponentDataResolver({
  children,
  fallback,
}: {
  children: (data: {
    boardActiveStandupForm: StandupForm | null;
  }) => React.ReactNode;
  fallback: React.ReactNode;
}) {
  const { boardActiveStandupFormPromise } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={boardActiveStandupFormPromise}>
        {(boardActiveStandupForm) => {
          return children({ boardActiveStandupForm });
        }}
      </Await>
    </Suspense>
  );
}

type FieldItemProps = {
  field: NonNullable<
    ReturnType<typeof validateDynamicFormSchema>
  >["fields"][number];
  index: number;
  totalFields: number;
  moveFieldUp: (index: number) => void;
  moveFieldDown: (index: number) => void;
  duplicateField: (index: number) => void;
  removeField: (index: number) => void;
  openEditDialog: (index: number) => void;
};

function FieldItem({
  field,
  index,
  totalFields,
  moveFieldUp,
  moveFieldDown,
  duplicateField,
  removeField,
  openEditDialog,
}: FieldItemProps) {
  const controls = useDragControls();

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
      <Card
        variant="surface"
        size={{
          initial: "2",
          sm: "3",
        }}
        className="group"
      >
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

        <Flex
          direction="column"
          gap={{
            initial: "4",
            sm: "5",
          }}
        >
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
              <TextArea
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

          <Inset clip="padding-box" side="x">
            <Separator size="4" />
          </Inset>

          <Inset clip="padding-box" side="y" pt="0" pb="0">
            <Flex justify="between" py="4">
              <Flex gap="2">
                <Flex
                  display={{
                    sm: "none",
                  }}
                  gap="2"
                >
                  <Tooltip content="Move up">
                    <IconButton
                      variant="soft"
                      onClick={() => moveFieldUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUpIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Move down">
                    <IconButton
                      variant="soft"
                      onClick={() => moveFieldDown(index)}
                      disabled={index === totalFields - 1}
                    >
                      <ArrowDownIcon />
                    </IconButton>
                  </Tooltip>
                </Flex>
                <Button variant="soft" onClick={() => duplicateField(index)}>
                  Duplicate
                </Button>
              </Flex>

              <Flex gap="2">
                <Button variant="soft" onClick={() => openEditDialog(index)}>
                  Edit
                </Button>

                <Button
                  variant="soft"
                  onClick={() => removeField(index)}
                  disabled={totalFields === 1}
                >
                  Remove
                </Button>
              </Flex>
            </Flex>
          </Inset>
        </Flex>
      </Card>
    </Reorder.Item>
  );
}

function Component({
  boardActiveStandupForm,
}: {
  boardActiveStandupForm: StandupForm | null;
}) {
  // console.log(boardActiveStandupForm);
  const initialSchema = validateDynamicFormSchema(
    boardActiveStandupForm?.schema
  );
  const [schema, setSchema] = useState(initialSchema);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(
    null
  );
  const [isAddingField, setIsAddingField] = useState(false);
  const [editFormData, setEditFormData] = useState({
    label: "",
    description: "",
    type: "textarea" as const,
    placeholder: "",
    required: false,
  });
  const [initialEditFormData, setInitialEditFormData] = useState({
    label: "",
    description: "",
    type: "textarea" as const,
    placeholder: "",
    required: false,
  });

  const moveFieldUp = (index: number) => {
    if (index === 0 || !schema) return;

    const newFields = [...schema.fields];
    const temp = newFields[index];
    newFields[index] = newFields[index - 1];
    newFields[index - 1] = temp;

    setSchema({
      ...schema,
      fields: newFields,
    });
  };

  const moveFieldDown = (index: number) => {
    if (!schema || index === schema.fields.length - 1) return;

    const newFields = [...schema.fields];
    const temp = newFields[index];
    newFields[index] = newFields[index + 1];
    newFields[index + 1] = temp;

    setSchema({
      ...schema,
      fields: newFields,
    });
  };

  const handleReorder = (newFields: NonNullable<typeof schema>["fields"]) => {
    if (!schema) return;

    setSchema({
      ...schema,
      fields: newFields,
    });
  };

  const duplicateField = (index: number) => {
    if (!schema) return;

    const fieldToDuplicate = schema.fields[index];
    const newFields = [...schema.fields];

    // Generate a unique name for the duplicated field
    const baseName = fieldToDuplicate.name;
    let newName = `${baseName}_copy`;
    let counter = 2;

    // Keep incrementing until we find a unique name
    while (newFields.some((field) => field.name === newName)) {
      newName = `${baseName}_copy_${counter}`;
      counter++;
    }

    // Create the duplicated field withth modified label and unique name
    const duplicatedField = {
      ...fieldToDuplicate,
      name: newName,
      label: `${fieldToDuplicate.label} (Copy)`,
    };

    // Insert the duplicated field right after the original
    newFields.splice(index + 1, 0, duplicatedField);

    setSchema({
      ...schema,
      fields: newFields,
    });
  };

  const removeField = (index: number) => {
    if (!schema) return;

    // Prevent removing the last field
    if (schema.fields.length === 1) return;

    const newFields = schema.fields.filter((_, i) => i !== index);

    setSchema({
      ...schema,
      fields: newFields,
    });
  };

  const openAddDialog = () => {
    const initialData = {
      label: "",
      description: "",
      type: "textarea" as const,
      placeholder: "",
      required: false,
    };
    setEditFormData(initialData);
    setInitialEditFormData(initialData);
    setIsAddingField(true);
  };

  const closeAddDialog = () => {
    setIsAddingField(false);
  };

  const addFieldWithData = () => {
    if (!schema) return;

    const newFields = [...schema.fields];

    // Generate a unique name for the new field
    let counter = 1;
    let newName = `field_${counter}`;

    // Keep incrementing until we find a unique name
    while (newFields.some((field) => field.name === newName)) {
      counter++;
      newName = `field_${counter}`;
    }

    // Create the new field with form data
    const newField = {
      name: newName,
      label: editFormData.label || "Untitled Field",
      type: editFormData.type,
      placeholder: editFormData.placeholder,
      description: editFormData.description,
      required: editFormData.required,
    };

    // Add the new field to the end
    newFields.push(newField);

    setSchema({
      ...schema,
      fields: newFields,
    });

    closeAddDialog();
  };

  const handleCancel = () => {
    setSchema(initialSchema);
  };

  const openEditDialog = (index: number) => {
    if (!schema) return;

    const field = schema.fields[index];
    const fieldData = {
      label: field.label || "",
      description: field.description || "",
      type: field.type || "textarea",
      placeholder: field.placeholder || "",
      required: field.required ?? false,
    };
    setEditFormData(fieldData);
    setInitialEditFormData(fieldData);
    setEditingFieldIndex(index);
  };

  const closeEditDialog = () => {
    setEditingFieldIndex(null);
  };

  const saveFieldEdit = () => {
    if (!schema || editingFieldIndex === null) return;

    const newFields = [...schema.fields];
    newFields[editingFieldIndex] = {
      ...newFields[editingFieldIndex],
      label: editFormData.label,
      description: editFormData.description,
      type: editFormData.type,
      placeholder: editFormData.placeholder,
      required: editFormData.required,
    };

    setSchema({
      ...schema,
      fields: newFields,
    });

    closeEditDialog();
  };

  // Check if schema has been modified
  const hasChanges = JSON.stringify(schema) !== JSON.stringify(initialSchema);

  // Check if the edit form has changes
  const hasFormChanges =
    JSON.stringify(editFormData) !== JSON.stringify(initialEditFormData);

  // For adding: disable if label is empty
  // For editing: disable if nothing changed
  const isSaveDisabled = isAddingField
    ? editFormData.label.trim() === ""
    : !hasFormChanges;

  if (!schema) {
    return null;
  }

  return (
    <Flex mt="5" direction="column" gap="5">
      <Reorder.Group
        axis="y"
        values={schema.fields}
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
        {schema.fields.map((field, index) => (
          <FieldItem
            key={field.name}
            field={field}
            index={index}
            totalFields={schema.fields.length}
            moveFieldUp={moveFieldUp}
            moveFieldDown={moveFieldDown}
            duplicateField={duplicateField}
            removeField={removeField}
            openEditDialog={openEditDialog}
          />
        ))}
      </Reorder.Group>
      <Flex justify="center" mb="5">
        <Button variant="soft" onClick={openAddDialog}>
          <PlusIcon />
          Add field
        </Button>
      </Flex>

      <Flex justify="between" gap="2">
        <Flex gap="2">
          <Button variant="soft" highContrast size="2" type="submit">
            Preview
          </Button>
        </Flex>

        <Flex gap="2">
          <Button
            highContrast
            size="2"
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={!hasChanges}
          >
            Discard
          </Button>

          <Button highContrast size="2" type="submit" disabled={!hasChanges}>
            Save
          </Button>
        </Flex>
      </Flex>

      <Dialog.Root
        open={editingFieldIndex !== null || isAddingField}
        onOpenChange={(open) => {
          if (!open) {
            closeEditDialog();
            closeAddDialog();
          }
        }}
      >
        <Dialog.Content>
          <Dialog.Title>
            {isAddingField ? "Add new field" : "Edit field"}
          </Dialog.Title>
          <Dialog.Description size="2">
            {isAddingField
              ? "Configure the new field properties below."
              : "Modify the field properties below."}
          </Dialog.Description>

          <Flex direction="column" gap="5" mt="5">
            <label>
              <Text as="div" size="2" mb="1" className="font-semibold">
                Label
              </Text>
              <TextField.Root
                value={editFormData.label}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, label: e.target.value })
                }
                placeholder="Field label"
              />
            </label>

            <label>
              <Flex align="center" gap="2">
                <Text size="2" className="font-semibold">
                  Required
                </Text>
                <Switch
                  checked={editFormData.required}
                  onCheckedChange={(checked) =>
                    setEditFormData({ ...editFormData, required: checked })
                  }
                />
              </Flex>
            </label>

            <label>
              <Text as="div" size="2" mb="1" className="font-semibold">
                Description
              </Text>
              <TextArea
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Optional description"
                rows={3}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" className="font-semibold">
                Placeholder
              </Text>
              <TextField.Root
                value={editFormData.placeholder}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    placeholder: e.target.value,
                  })
                }
                placeholder="Placeholder text"
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button
                onClick={isAddingField ? addFieldWithData : saveFieldEdit}
                highContrast
                disabled={isSaveDisabled}
              >
                Save
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}

function TemporarySetting() {
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
          Customize the standup form to fit your needs.
        </Text>
      </Flex>
      <ComponentDataResolver fallback={<div>Loading...</div>}>
        {({ boardActiveStandupForm }) => (
          <Component boardActiveStandupForm={boardActiveStandupForm} />
        )}
      </ComponentDataResolver>
    </Card>
  );
}
