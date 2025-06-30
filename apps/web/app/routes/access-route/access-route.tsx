import { redirect } from "react-router";
import type { Route } from "./+types/access-route";

export async function loader({}: Route.LoaderArgs) {
  return redirect("/auth/email");
}
