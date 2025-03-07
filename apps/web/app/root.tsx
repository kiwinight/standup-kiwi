import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ErrorResponse,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import "@radix-ui/themes/styles.css";
import "./radix.css";
import { Theme } from "@radix-ui/themes";
import { AppearanceProvider, useAppearance } from "./context/AppearanceContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppearanceProvider>{children}</AppearanceProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { appearance } = useAppearance();

  return (
    <Theme accentColor="gray" appearance={appearance}>
      <Outlet />
    </Theme>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

/**
 * RouteErrorResponse implementation based on React Router's original implementation
 * @see https://github.com/remix-run/react-router/blob/main/packages/react-router/lib/router/utils.ts
 */
export class RouteErrorResponse implements ErrorResponse {
  status: number;
  statusText: string;
  data: any;
  private error?: Error;
  private internal: boolean;

  constructor(
    status: number,
    statusText: string | undefined,
    data: any,
    internal = false
  ) {
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data instanceof Error) {
      this.data = data.toString();
      this.error = data;
    } else {
      this.data = data;
    }
  }
}

export class NotFoundRouteErrorResponse extends RouteErrorResponse {
  constructor() {
    super(404, "Not found", Error("Not found"));
  }
}
