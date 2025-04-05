import {
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useFetcher, useSearchParams } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ActionType as SignInWithAccessCodeActionType } from "../sign-in-with-access-code-route/sign-in-with-access-code-route";
import type { Route } from "./+types/sign-up-route";

function SignUpRoute({}: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();

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

  return (
    <Container my="7" maxWidth="672px" px="4">
      <Flex direction="column" gap="7">
        <Flex direction="column" gap="2">
          <Text size="6" weight="bold">
            Complete your sign up
          </Text>
          <Text size="2" color="gray">
            We’ve sent a 6-digit access code to your email. Enter it below to
            complete your sign up and access Standup Kiwi.
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
                { otp: data.otp, nonce: searchParams.get("nonce") },
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
                Your access code
              </Text>

              <Flex direction="column" mt="5" gap="5">
                <Flex direction="column" gap="2">
                  <label>
                    <Flex align="center" gap="2">
                      <Text
                        size="2"
                        className="font-[var(--font-weight-semibold)]"
                      >
                        Access code
                      </Text>
                      <Text size="1" color="gray">
                        Required
                      </Text>
                    </Flex>
                  </label>
                  <TextField.Root
                    type="text"
                    placeholder="A1B2C3"
                    variant="soft"
                    {...form.register("otp")}
                  />
                  <Text size="2" color="gray">
                    Enter the 6-digit access code we sent to your email.
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
                  Sign up
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}

export default SignUpRoute;
