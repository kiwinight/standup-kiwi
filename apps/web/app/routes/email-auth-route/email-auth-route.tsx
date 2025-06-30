import {
  Button,
  Card,
  Container,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useFetcher } from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionType as SendAccessCodeActionType } from "../send-access-code-route/send-access-code-route";
import { useEffect } from "react";
import type { Route } from "./+types/email-auth-route";

function EmailAuthRoute({}: Route.ComponentProps) {
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
    <Container py="7" maxWidth="672px" px="4">
      <Flex direction="column" gap="7">
        <Flex direction="column" gap="2">
          <Text size="6" weight="bold">
            Get started with your email
          </Text>
          <Text size="2" color="gray">
            We'll send you a one-time code so you can access your personalized
            workspace.
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
                  <TextField.Root
                    type="text"
                    placeholder="Enter your email"
                    variant="soft"
                    {...form.register("email")}
                  />
                  <Text size="2" color="gray">
                    An email address to get an one-time code.
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
                  Continue
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}

export default EmailAuthRoute;
