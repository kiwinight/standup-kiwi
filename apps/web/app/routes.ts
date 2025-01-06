import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/board-layout.tsx", [
    route("/boards/create", "routes/create-new-board-route.tsx"),
    route("/boards/:boardId", "routes/board-route.tsx"),
  ]),
  route("/sign-in", "routes/sign-in-route.tsx"),
  route(
    "/sign-in/one-time-password",
    "routes/sign-in-one-time-password-route.tsx"
  ),
] satisfies RouteConfig;
