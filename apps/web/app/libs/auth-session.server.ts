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
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    // path: "/",
    // sameSite: "lax",
    secrets: [authSessionCookieSecret],
    secure: process.env.NODE_ENV === "production", // NOTE: Secure cookie is enabled only in production for HTTPS. In development, it's disabled to allow cookie storage in Safari during local testing. WARNING: Always ensure this is TRUE in production to prevent session hijacking.
  },
});

const { getSession, commitSession, destroySession } = authSession;

export { getSession, commitSession, destroySession };
