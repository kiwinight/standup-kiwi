import { Button, Callout, Card, Flex, Table, Text } from "@radix-ui/themes";
import { useParams } from "react-router";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import type { Route } from "./+types/board-settings-sharing-route";
import { FEATURE_NOT_IMPLEMENTED_ALERT_MESSAGE } from "~/libs/alert";
export async function loader({ request, params }: Route.LoaderArgs) {
  return null;
}

export default function BoardSettingsSharingRoute({}: Route.ComponentProps) {
  const { boardId } = useParams();

  return (
    <>
      <Callout.Root>
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>{FEATURE_NOT_IMPLEMENTED_ALERT_MESSAGE}</Callout.Text>
      </Callout.Root>
      <Card
        size={{
          initial: "3",
          sm: "4",
        }}
        className="blur-[2px] pointer-events-none select-none"
      >
        <Flex direction="column">
          <Flex justify="between" align="center">
            <Text size="4" weight="bold">
              Collaborators
            </Text>
            <Button highContrast>Add collaborator</Button>
          </Flex>

          <Table.Root mt="5">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
                <Table.Cell>danilo@standupkiwi.com</Table.Cell>
                <Table.Cell>Owner</Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
                <Table.Cell>zahra@standupkiwi.com</Table.Cell>
                <Table.Cell>Member</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Flex>
      </Card>

      {/* <Card
        // size={{
        //   initial: "2",
        //   sm: "4",
        // }}
        size={{
          initial: "3",
          sm: "4",
        }}
      >
        <Flex direction="column">
          <Text size="4" weight="bold">
            General Access
          </Text>
          <Text size="2" color="gray">
            NOTE: Hmm.. should the board support a public access with a link? Or
            restrict access to collaborators only?
            REF: https://tldraw.notion.site/
          </Text>
        </Flex>
      </Card> */}
    </>
  );
}
