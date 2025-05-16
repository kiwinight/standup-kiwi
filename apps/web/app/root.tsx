import {
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
import { UserAppearanceSettingProvider } from "./context/UserAppearanceSettingContext";
import {
  ColorSchemeProvider,
  useColorScheme,
  colorSchemeFlickerPrevention,
} from "./context/ColorSchemeContext";

// NOTE: This setup is for Node.js 18 environment
if (
  typeof process !== "undefined" &&
  process.versions &&
  process.versions.node
) {
  (function () {
    import("crypto").then(({ webcrypto }) => {
      if (!globalThis.crypto) {
        globalThis.crypto = webcrypto as unknown as Crypto;
      }
    });
  })();
}

export function meta(args?: Route.MetaArgs) {
  const description =
    "Standup Kiwi is a standup board for teams and solo experts. It is designed to keep your updates calm, clear, and effortless.";

  return [
    {
      title: "Standup Kiwi",
    },
    {
      name: "description",
      content: description,
    },
    {
      property: "og:title",
      content: "Standup Kiwi",
    },
    {
      property: "og:description",
      content: description,
    },
    {
      property: "og:image",
      content: "/og-image.png",
    },
    {
      property: "og:url",
      content: "https://app.standupkiwi.com",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:site_name",
      content: "Standup Kiwi",
    },
    {
      property: "og:locale",
      content: "en_US",
    },
  ];
}

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
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{ __html: colorSchemeFlickerPrevention }}
        />
      </head>
      <body>
        <UserAppearanceSettingProvider>
          <ColorSchemeProvider>{children}</ColorSchemeProvider>
        </UserAppearanceSettingProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { colorScheme } = useColorScheme();

  return (
    <Theme
      accentColor="gray"
      {...(colorScheme !== null ? { appearance: colorScheme } : {})}
    >
      <Outlet />
    </Theme>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Oops!";
  let description = "An unexpected error occurred.";

  if (isApiError(error)) {
    title = error.statusCode.toString();
    description = error.message;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{title}</h1>
      <p>{description}</p>
    </main>
  );
}

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

function isApiError(error: any): error is ApiError {
  return "statusCode" in error;
}
