import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";

type Props = {};

function CreateNewBoardRoute({}: Props) {
  return (
    <Container my="7" maxWidth="672px" px="4">
      <Text size="6" weight="bold">
        Create a new board
      </Text>
      <Card
        size={{
          initial: "2",
          sm: "4",
        }}
        mt="7"
      >
        <Text size="4" weight="bold">
          New board
        </Text>

        <form
          // mt="24px"
          className="mt-6"
          onSubmit={(event) => {}}
        >
          <Box>
            <label>
              <Text size="2" weight="medium">
                Board name
              </Text>
              <TextField.Root
                name="yesterday"
                // size="3"
                mt="2"
                variant="soft"
                placeholder="Board name"
              />
            </label>
          </Box>

          {/* <Box mt="5">
            <label>
              <Text size="2" weight="medium">
                What will you do today?
              </Text>
              <TextArea
                name="today"
                mt="2"
                variant="soft"
                placeholder="Write your reply here..."
                className="w-full !min-h-[80px]"
                resize="vertical"
                // defaultValue={formState.today}
              />
            </label>
          </Box> */}

          {/* <Box mt="5">
            <label>
              <Text size="2" weight="medium">
                Do you have any blockers?
              </Text>
              <TextArea
                name="blockers"
                mt="2"
                variant="soft"
                placeholder="Write your reply here..."
                className="w-full !min-h-[80px]"
                resize="vertical"
                // defaultValue={formState.blockers}
              />
            </label>
          </Box> */}

          <Flex justify="end" mt="5" gap="2">
            <Button highContrast size="2" type="submit">
              Create
            </Button>
          </Flex>
        </form>
      </Card>
    </Container>
  );
}

export default CreateNewBoardRoute;
