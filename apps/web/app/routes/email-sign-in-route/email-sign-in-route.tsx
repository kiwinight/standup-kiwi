import {
  Button,
  Card,
  Code,
  Container,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useFetcher, useSearchParams } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ActionType as SignInWithAccessCodeActionType } from "../sign-in-with-access-code-route/sign-in-with-access-code-route";
import { useEffect } from "react";
import type { Route } from "./+types/email-sign-in-route";

function EmailSignInRoute({}: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const userExists = searchParams.get("userExists") === "true";
  const nonce = searchParams.get("nonce") ?? "";

  const fetcher = useFetcher<SignInWithAccessCodeActionType>();

  const formSchema = z.object({
    otp: z.string().min(6),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (fetcher.data?.error) {
      form.setError("otp", { message: fetcher.data.error });
    }
  }, [fetcher.data]);

  return (
    <Container py="7" maxWidth="672px" px="4">
      <Flex direction="column" gap="7">
        <Flex direction="column" gap="2">
          <Text size="6" weight="bold">
            Enter the code from your email
          </Text>
          <Text size="2" color="gray">
            We've sent a one-time code to your email. Please check your inbox
            {email && (
              <>
                {" at "}
                <Text size="2" weight="bold">
                  {email}
                </Text>
              </>
            )}
            . If you don't see it, check your spam or junk folder.
          </Text>
        </Flex>
        <Card
          size={{
            initial: "2",
            sm: "4",
          }}
        >
          <form
            onSubmit={form.handleSubmit((data) => {
              fetcher.submit(
                { otp: data.otp, nonce },
                {
                  encType: "application/json",
                  method: "post",
                  action: "/access-code/sign-in",
                }
              );
            })}
          >
            <Flex direction="column">
              <Text size="4" weight="bold">
                One-time code
              </Text>

              <Flex direction="column" mt="5" gap="5">
                <Flex direction="column" gap="2">
                  <TextField.Root
                    type="text"
                    placeholder="Enter code"
                    variant="soft"
                    {...form.register("otp")}
                  />
                  <Text size="2" color="gray">
                    A six-digit one-time code we sent you. e.g.{" "}
                    <Code>C1B2A3</Code>
                  </Text>
                  {form.formState.errors.otp && (
                    <Text size="2" color="red">
                      {form.formState.errors.otp.message}
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
        {!userExists && (
          <Text size="2" color="gray" align="center">
            By continuing, you'll create a new account with this email address.
          </Text>
        )}
      </Flex>
    </Container>
  );
}

export default EmailSignInRoute;
