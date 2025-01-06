import { Button, Container, Heading, TextField } from "@radix-ui/themes";
import { redirect, useFetcher } from "react-router";
import type { Route } from "../+types/root";
import { commitSession, getSession } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const otp = formData.get("otp");

  const response = await fetch(
    "http://localhost:4000/auth/otp/sign-in-with-otp",
    {
      method: "POST",
      body: JSON.stringify({ otp, nonce: request.url.split("nonce=")[1] }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data: {
    access_token: string;
    refresh_token: string;
    is_new_user: boolean;
    user_id: string;
  } = await response.json();

  const session = await getSession(request.headers.get("Cookie"));

  session.set("access_token", data.access_token);
  session.set("refresh_token", data.refresh_token);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

type Props = {};

function SignInOneTimePasswordRoute({}: Props) {
  const fetcher = useFetcher();

  return (
    <div>
      <Container size="1">
        <Heading>Sign In / One Time Password</Heading>
        <fetcher.Form method="post">
          <TextField.Root
            type="text"
            name="otp"
            placeholder="One Time Password"
          />
          <Button type="submit" loading={fetcher.state === "submitting"}>
            Sign In
          </Button>
        </fetcher.Form>
      </Container>
    </div>
  );
}

export default SignInOneTimePasswordRoute;
