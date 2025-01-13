import { createCookieSessionStorage } from "react-router";

type SessionData = {
  access_token: string;
  refresh_token: string;
};

type SessionFlashData = {
  error: string;
};

const authSessionCookieName = process.env.AUTH_SESSION_COOKIE_NAME!;
const authSessionCookieSecret = process.env.AUTH_SESSION_COOKIE_SECRET!;

console.log("authSessionCookieName", authSessionCookieName);

// authCookieSessionStorage
const authSession = createCookieSessionStorage<SessionData, SessionFlashData>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: authSessionCookieName,

    // all of these are optional
    // domain: "reactrouter.com",
    // domain: "localhost",
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    // expires: new Date(Date.now() + 60_000),
    httpOnly: true,
    // maxAge: 60,
    // path: "/",
    // sameSite: "lax",
    secrets: [authSessionCookieSecret],
    secure: true,
  },
});

const { getSession, commitSession, destroySession } = authSession;

export { getSession, commitSession, destroySession };
