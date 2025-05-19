import {
  Link,
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
import { Button, Flex, Heading, Text, Theme } from "@radix-ui/themes";
import { UserAppearanceSettingProvider } from "./context/UserAppearanceSettingContext";
import {
  ColorSchemeProvider,
  useColorScheme,
  colorSchemeFlickerPrevention,
} from "./context/ColorSchemeContext";

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
  const { colorScheme } = useColorScheme();

  let title = "Oops!";
  let description = "An unexpected error occurred.";

  if (isApiError(error)) {
    title = error.statusCode.toString();
    description = error.message;
  }

  return (
    <Theme
      accentColor="gray"
      {...(colorScheme !== null ? { appearance: colorScheme } : {})}
    >
      <Flex
        justify="center"
        align="center"
        minHeight="100dvh"
        direction="column"
        gap="2"
      >
        <Heading as="h1" size="8">
          {title}
        </Heading>
        <Text>{description}</Text>
        <Button variant="outline" asChild>
          <Link to="/">Go to Main</Link>
        </Button>
      </Flex>
    </Theme>
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
