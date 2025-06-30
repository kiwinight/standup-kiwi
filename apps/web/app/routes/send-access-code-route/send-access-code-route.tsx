import type { Route } from "./+types/send-access-code-route";
import { isErrorData, type ApiData, type ListUser } from "types";
import { data } from "react-router";
import { redirect } from "react-router";

interface SendAccessCodeRequestBody {
  email: string;
}

function sendAccessCode(email: string) {
  return fetch(import.meta.env.VITE_API_URL + "/auth/otp/send-code", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json() as Promise<ApiData<{ nonce: string }>>);
}

function checkIfUserExists(email: string) {
  return fetch(
    import.meta.env.VITE_API_URL + "/auth/otp/check-if-user-exists",
    {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response) => response.json() as Promise<ApiData<boolean>>);
}

export type ActionType = typeof action;

export async function action({ request }: Route.ActionArgs) {
  const { email } = (await request.json()) as SendAccessCodeRequestBody;

  const responseData = await sendAccessCode(email);

  if (isErrorData(responseData)) {
    return data({
      error: responseData.message,
    });
  }

  const { nonce } = responseData;

  const userExistsResponse = await checkIfUserExists(email);

  let userExists = true; // Default to true when API error occurs - safer for existing users
  if (!isErrorData(userExistsResponse)) {
    userExists = userExistsResponse;
  }

  const redirectUrl = "/auth/email/sign-in";

  const params = new URLSearchParams({
    nonce: nonce,
    email: email,
    userExists: String(userExists),
  });

  return redirect(`${redirectUrl}?${params.toString()}`);
}
