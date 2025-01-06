import { Button, Container, Heading, TextField } from "@radix-ui/themes";
import type { Route } from "../+types/root";
import { redirect, useFetcher } from "react-router";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  const response = await fetch("http://localhost:4000/auth/otp/send-code", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: {
    nonce: string;
  } = await response.json();

  return redirect(`/sign-in/one-time-password?nonce=${data.nonce}`);
}

type Props = {};

function SignInRoute({}: Props) {
  const fetcher = useFetcher();

  return (
    <div>
      <Container size="1">
        <Heading>Sign In</Heading>
        <fetcher.Form method="post">
          <TextField.Root type="text" name="email" placeholder="Email" />
          <Button type="submit" loading={fetcher.state === "submitting"}>
            Get Password/Link Email
          </Button>
        </fetcher.Form>
      </Container>
    </div>
  );
}

export default SignInRoute;
