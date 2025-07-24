import { redirect } from "react-router";
import { destroySession, getSession } from "~/libs/auth-session.server";
import type { Route } from "./+types/sign-out-route";

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}
