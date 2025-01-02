import type { Route } from "./+types/home";
import type { User } from "types";
import KiwinightSymbol from "./kiwinight-symbol";
import {
  Box,
  Button,
  Card,
  Container,
  DropdownMenu,
  Flex,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { useState } from "react";
import { GearIcon, ListBulletIcon, Share1Icon } from "@radix-ui/react-icons";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  const response = await fetch(import.meta.env.VITE_API_URL + "/users");
  const users: User[] = await response.json();
  return { users };
}

export function HydrateFallback() {
  return <p>Loading Game...</p>;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;
  const headers = users.length > 0 ? Object.keys(users[0]) : [];

  const [formState, setFormState] = useState({
    yesterday: "",
    today: "",
    blockers: "",
  });

  console.log(JSON.stringify(formState));

  const [isFormVisible, setIsFormVisible] = useState(true);

  // const hmm = use(
  //   fetch(import.meta.env.VITE_API_URL + "/users").then((res) => res.json())
  // );

  return (
    <>
      <Flex
        className="h-[56px] px-4 z-10 bg-[var(--color-background)] border-b border-b-[#e5e7eb]"
        justify="start"
        align="center"
        position="sticky"
        top="0"
        // zIndex="1"
      >
        <Flex gap="4" align="center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button
                variant="soft"
                highContrast
                size="2"
                radius="medium"
                className="!pl-[8px] !pr-[8px]"
              >
                <ListBulletIcon
                  fontSize={24}
                  width={16}
                  height={16}
                  // width={20} height={20}
                />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Label>
                <Text
                  size="2"
                  weight="bold"
                  // color="gray"
                  className="!text-[var(--gray-12)]"
                >
                  Boards
                </Text>
              </DropdownMenu.Label>

              <DropdownMenu.Group>
                <DropdownMenu.Label>Made by me</DropdownMenu.Label>
                <DropdownMenu.Item>Personal</DropdownMenu.Item>
                <DropdownMenu.Item>Personal B</DropdownMenu.Item>

                <DropdownMenu.Label>Shared with me</DropdownMenu.Label>
                <DropdownMenu.Item>Team A</DropdownMenu.Item>
                <DropdownMenu.Item>Team B</DropdownMenu.Item>
                <DropdownMenu.Item>Team C</DropdownMenu.Item>
              </DropdownMenu.Group>
              <DropdownMenu.Separator />

              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>
                  Theme
                  {/* <Text size="2" weight="bold">
                    Appearance
                  </Text> */}
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item>Light</DropdownMenu.Item>
                  <DropdownMenu.Item>Dark</DropdownMenu.Item>
                  <DropdownMenu.Item>System</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              {/* <DropdownMenu.Separator /> */}
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>
                  <Text size="2" weight="bold">
                    hyukkwonepic
                  </Text>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item>Settings</DropdownMenu.Item>
                  <DropdownMenu.Item color="red">Logout</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <Flex gap="2">
            <KiwinightSymbol width={24} height={24} />
            <Text size="3" weight="bold">
              {/* <Text weight="medium" mr="1">
                Kiwi
              </Text> */}
              Standup
              {/* Kiwi Standup */}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Container
        mt="7"
        maxWidth="672px"
        px="4"
        // maxWidth="768px"
      >
        <Flex
          justify="between"
          align={{
            initial: "start",
            sm: "center",
          }}
          direction={{
            initial: "column",
            sm: "row",
          }}
        >
          <Text size="6" weight="bold">
            Personal
          </Text>

          <Flex
            gap="5"
            mt={{
              initial: "4",
              sm: "0",
            }}
          >
            <Button variant="ghost" highContrast>
              <Share1Icon />
              Share
            </Button>
            <Button variant="ghost" highContrast>
              <GearIcon />
              Settings
            </Button>
          </Flex>
        </Flex>

        <Box pt="7">
          <Text size="3" weight="bold">
            Today
          </Text>

          <Card variant="surface" size="3" mt="5">
            <Text size="5" weight="bold">
              Hyukoo
            </Text>

            <Box mt="5">
              {!isFormVisible && (
                <div
                // onClick={() => setIsFormVisible(true)}
                // className="py-1 px-2 -my-1 -mx-2 bg-accent-a3 hover:bg-[var(--accent-a3)] hover:cursor-[var(--cursor-button)] rounded-[var(--radius-2)]"
                // style={{

                //     backgroundColor: "var(--accent-a3)",

                // }}
                >
                  <Flex direction="column">
                    <Text
                      size="2"
                      weight="medium"
                      className="!leading-[var(--line-height-3)]"
                    >
                      What did you do yesterday?
                    </Text>
                    <Text mt="2" size="2">
                      {formState.yesterday}
                    </Text>
                  </Flex>

                  <Flex direction="column" mt="5">
                    <Text
                      size="2"
                      weight="medium"
                      className="!leading-[var(--line-height-3)]"
                    >
                      What will you do today?
                    </Text>
                    <Text mt="2" size="2">
                      {formState.today}
                    </Text>
                  </Flex>

                  <Flex direction="column" mt="5">
                    <Text
                      size="2"
                      weight="medium"
                      className="!leading-[var(--line-height-3)]"
                    >
                      Do you have any blockers?
                    </Text>
                    <Text mt="2" size="2">
                      {formState.blockers}
                    </Text>
                  </Flex>

                  <Flex justify="end" mt="5" gap="2">
                    <Button
                      variant="soft"
                      size="2"
                      highContrast
                      onClick={() => setIsFormVisible(true)}
                    >
                      Edit
                    </Button>
                  </Flex>
                </div>
              )}
              {isFormVisible && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(
                      event.target as HTMLFormElement
                    );
                    setFormState({
                      yesterday: formData.get("yesterday") as string,
                      today: formData.get("today") as string,
                      blockers: formData.get("blockers") as string,
                    });
                    setIsFormVisible(false);
                  }}
                >
                  <Box>
                    <label>
                      <Text size="2" weight="medium">
                        What did you do yesterday?
                      </Text>
                      <TextArea
                        name="yesterday"
                        mt="2"
                        variant="soft"
                        placeholder="Write your reply here..."
                        className="w-full !min-h-[80px]"
                        resize="vertical"
                        defaultValue={formState.yesterday}
                      />
                    </label>
                  </Box>

                  <Box mt="5">
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
                        defaultValue={formState.today}
                      />
                    </label>
                  </Box>

                  <Box mt="5">
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
                        defaultValue={formState.blockers}
                      />
                    </label>
                  </Box>

                  <Flex justify="end" mt="5" gap="2">
                    {formState.yesterday ||
                    formState.today ||
                    formState.blockers ? (
                      <Button
                        type="button"
                        highContrast
                        size="2"
                        variant="soft"
                        onClick={() => {
                          setIsFormVisible(false);
                        }}
                      >
                        Cancel
                      </Button>
                    ) : null}
                    <Button highContrast size="2" type="submit">
                      Save
                    </Button>
                  </Flex>
                </form>
              )}
            </Box>
          </Card>

          <Box mt="7">
            <Text size="3" weight="bold">
              History
            </Text>

            <Card variant="surface" size="3" mt="5">
              <Flex direction="column">
                <Text size="5" weight="bold">
                  Dec 31, 2024
                </Text>
                <br />
                <Text size="2" weight="medium">
                  What did you do yesterday?
                </Text>
                <Text size="2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos.
                </Text>
                <br />

                <Text size="2" weight="medium">
                  What will you do today?
                </Text>
                <Text size="2">
                  Pater noster qui est in caelis. Sanctificetur nomen tuum.
                  Adveniat regnum tuum. Fiat voluntas tua.
                </Text>
                <br />

                <Text size="2" weight="medium">
                  Do you have any blockers?
                </Text>
                <Text size="2">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Explicabo laudantium repellendus veritatis sequi. Magnam
                  placeat nesciunt similique. Exercitationem architecto
                  reiciendis necessitatibus. Dolore illum quae accusantium eum
                  suscipit ipsum sint dicta?
                </Text>
              </Flex>
            </Card>

            <Card variant="surface" size="3" mt="5">
              <Flex direction="column">
                <Text size="5" weight="bold">
                  Dec 30, 2024
                </Text>
                <br />
                <Text size="2" weight="medium">
                  What did you do yesterday?
                </Text>
                <Text size="2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos.
                </Text>
                <br />

                <Text size="2" weight="medium">
                  What will you do today?
                </Text>
                <Text size="2">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Explicabo laudantium repellendus veritatis sequi. Magnam
                  placeat nesciunt similique. Exercitationem architecto
                  reiciendis necessitatibus. Dolore illum quae accusantium eum
                  suscipit ipsum sint dicta?
                </Text>
                <br />

                <Text size="2" weight="medium">
                  Do you have any blockers?
                </Text>
                <Text size="2">
                  Lorem ipsum, dolor sit amet consectetur adipisicing
                </Text>
              </Flex>
            </Card>

            <Card variant="surface" size="3" mt="5">
              <Flex direction="column">
                <Text size="5" weight="bold">
                  Dec 29, 2024
                </Text>
                <br />
                <Text size="2" weight="medium">
                  What did you do yesterday?
                </Text>
                <Text size="2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos.
                </Text>
                <br />

                <Text size="2" weight="medium">
                  What will you do today?
                </Text>
                <Text size="2">
                  Pater noster qui est in caelis. Sanctificetur nomen tuum.
                  Adveniat regnum tuum. Fiat voluntas tua.
                </Text>
                <br />

                <Text size="2" weight="medium">
                  Do you have any blockers?
                </Text>
                <Text size="2">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Explicabo laudantium repellendus veritatis sequi.
                </Text>
              </Flex>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* <section>
        <h1>Users</h1>
        <br />
        <h2>List</h2>
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                {headers.map((header) => (
                  <td key={header}>{user[header as keyof User]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section> */}
    </>
  );
}
