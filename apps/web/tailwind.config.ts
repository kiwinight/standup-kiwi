import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  theme: {
    extend: {
      typography: () => ({
        // NOTE: prose-custom
        custom: {
          css: {},
        },
      }),
    },
  },
} satisfies Config;
