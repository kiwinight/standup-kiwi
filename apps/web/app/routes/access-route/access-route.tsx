import {
  Button,
  Card,
  Container,
  Flex,
  Separator,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useFetcher } from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionType as SendAccessCodeActionType } from "../send-access-code-route/send-access-code-route";
import { useEffect } from "react";

type Props = {};

function AccessRoute({}: Props) {
  const fetcher = useFetcher<SendAccessCodeActionType>();

  const formSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (fetcher.data?.error) {
      form.setError("email", { message: fetcher.data.error });
    }
  }, [fetcher.data]);

  return (
    <Container my="7" maxWidth="672px" px="4">
      <Flex direction="column" gap="7">
        <Flex direction="column" gap="2">
          <Text size="6" weight="bold">
            Welcome! Let’s get you access
          </Text>
          <Text size="2" color="gray">
            We’ll send a one-time access code to your email. Use it to sign in —
            or sign up if you're new — so we can recognize you and help you
            access your personalized experience.
          </Text>
        </Flex>
        <Card
          size={{
            initial: "2",
            sm: "4",
          }}
        >
          <form
            method="post"
            onSubmit={form.handleSubmit((data) => {
              fetcher.submit(
                {
                  email: data.email,
                },
                {
                  encType: "application/json",
                  method: "post",
                  action: "/access-code/send",
                }
              );
            })}
          >
            <Flex direction="column">
              <Text size="4" weight="bold">
                Your email
              </Text>

              <Flex direction="column" mt="5" gap="5">
                <Flex direction="column" gap="2">
                  <label>
                    <Flex align="center" gap="2">
                      <Text size="2" className="font-semibold">
                        Email*
                      </Text>
                      <Text size="1" color="gray">
                        Required
                      </Text>
                    </Flex>
                  </label>
                  <TextField.Root
                    type="text"
                    placeholder="Enter your email - e.g. your@email.com"
                    variant="soft"
                    {...form.register("email")}
                  />
                  <Text size="2" color="gray">
                    Enter your email to get access code.
                  </Text>
                  {form.formState.errors.email && (
                    <Text size="2" color="red">
                      {form.formState.errors.email.message}
                    </Text>
                  )}
                </Flex>
              </Flex>

              <Flex justify="end" mt="5" gap="2">
                <Button
                  highContrast
                  size="2"
                  type="submit"
                  loading={fetcher.state === "submitting"}
                >
                  Send code
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
        <Flex justify="center">
          <Text>or</Text>
        </Flex>
        <Card
          size={{
            initial: "2",
            sm: "4",
          }}
        >
          <Text size="4" weight="bold">
            Guest
          </Text>
        </Card>
      </Flex>
    </Container>
  );
}

export default AccessRoute;
