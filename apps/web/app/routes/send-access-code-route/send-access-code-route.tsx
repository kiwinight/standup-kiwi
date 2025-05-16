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

async function determineRedirectUrl(email: string) {
  const userExistsResponse = await checkIfUserExists(email);

  if (isErrorData(userExistsResponse)) {
    return "/access/sign-in";
  }

  return userExistsResponse ? "/access/sign-in" : "/access/sign-up";
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

  const redirectUrl = await determineRedirectUrl(email);

  return redirect(redirectUrl + "?nonce=" + nonce);
}
