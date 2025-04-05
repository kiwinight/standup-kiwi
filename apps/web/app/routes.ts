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
          "/boards/:boardId/settings/sharing",
          "routes/board-settings-sharing-route/board-settings-sharing-route.tsx"
        ),
      ]
    ),
  ]),
  layout("routes/access-layout-route/access-layout-route.tsx", [
    route("/access", "routes/access-route/access-route.tsx"),
    route("/access/sign-in", "routes/sign-in-route/sign-in-route.tsx"),
    route("/access/sign-up", "routes/sign-up-route/sign-up-route.tsx"),
  ]),

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
    "/access-code/send",
    "routes/send-access-code-route/send-access-code-route.tsx"
  ),
  route(
    "/access-code/sign-in",
    "routes/sign-in-with-access-code-route/sign-in-with-access-code-route.tsx"
  ),
  // TODO: Add delete session route - logout
  // route(
  //   "/session/delete",
  //   "routes/delete-session-route/delete-session-route.tsx"
  // ),
] satisfies RouteConfig;
