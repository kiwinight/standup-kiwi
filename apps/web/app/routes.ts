import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/index-route/index-route.tsx"),
  layout("routes/board-layout-route/board-layout-route.tsx", [
    route(
      "/boards/create",
      "routes/create-new-board-route/create-new-board-route.tsx"
    ),
    route("/boards/:boardId", "routes/board-route/board-route.tsx"),

    layout(
      "routes/board-settings-layout-route/board-settings-layout-route.tsx",
      [
        route(
          "/boards/:boardId/settings",
          "routes/board-settings-route/board-settings-route.tsx"
        ),
        route(
          "/boards/:boardId/settings/collaborators",
          "routes/board-settings-collaborators-route/board-settings-collaborators-route.tsx"
        ),
      ]
    ),
  ]),

  layout("routes/auth-layout-route/auth-layout-route.tsx", [
    route("/auth/email", "routes/email-auth-route/email-auth-route.tsx"),
    route(
      "/auth/email/continue",
      "routes/email-sign-in-route/email-sign-in-route.tsx"
    ),
  ]),

  route("/access", "routes/access-route/access-route.tsx"), // TODO: Remove this when access to /access is not needed
  route("/invitations/:token", "routes/invitation-route/invitation-route.tsx"),

  // action only routes
  route(
    "/boards/:boardId/standups/create",
    "routes/create-board-standup/create-board-standup.tsx"
  ),
  route(
    "/boards/:boardId/standups/:standupId/update",
    "routes/update-board-standup/update-board-standup.tsx"
  ),
  route(
    "/boards/:boardId/invitation/ensure",
    "routes/ensure-board-invitation/ensure-board-invitation.tsx"
  ),
  route(
    "/boards/:boardId/invitation/regenerate",
    "routes/regenerate-board-invitation/regenerate-board-invitation.tsx"
  ),
  route(
    "/access-code/send",
    "routes/send-access-code-route/send-access-code-route.tsx"
  ),
  route(
    "/access-code/sign-in",
    "routes/sign-in-with-access-code-route/sign-in-with-access-code-route.tsx"
  ),
  route(
    "/boards/:boardId/update",
    "routes/update-board-route/update-board-route.tsx"
  ),
  route(
    "/accept-invitation",
    "routes/accept-invitation-route/accept-invitation-route.tsx"
  ),
  // TODO: Add delete session route - logout
  // route(
  //   "/session/delete",
  //   "routes/delete-session-route/delete-session-route.tsx"
  // ),
] satisfies RouteConfig;
