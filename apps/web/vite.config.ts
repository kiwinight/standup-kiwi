import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [reactRouter(), tsconfigPaths(), tailwindcss(), devtoolsJson()],
});
