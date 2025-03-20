import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
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

    route(
      "/boards/:boardId/standups/create",
      "routes/create-board-standup/create-board-standup.tsx"
    ),
    route(
      "/boards/:boardId/standups/:standupId/update",
      "routes/update-board-standup/update-board-standup.tsx"
    ),
  ]),
  route("/sign-in", "routes/sign-in-route/sign-in-route.tsx"),
  route(
    "/sign-in/one-time-password",
    "routes/sign-in-one-time-password-route/sign-in-one-time-password-route.tsx"
  ),
] satisfies RouteConfig;
