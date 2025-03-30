import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      typography: () => ({
        // NOTE: prose-custom
        custom: {
          css: {
            "--tw-prose-body": "initial",
            "--tw-prose-headings": "var(--color-pink-900)",
            "--tw-prose-lead": "var(--color-pink-700)",
            "--tw-prose-links": "var(--color-pink-900)",
            "--tw-prose-bold": "var(--color-pink-900)",
            "--tw-prose-counters": "var(--color-pink-600)",
            "--tw-prose-bullets": "var(--color-pink-400)",
            "--tw-prose-hr": "var(--color-pink-300)",
            "--tw-prose-quotes": "var(--color-pink-900)",
            "--tw-prose-quote-borders": "var(--color-pink-300)",
            "--tw-prose-captions": "var(--color-pink-700)",
            "--tw-prose-code": "var(--color-pink-900)",
            "--tw-prose-pre-code": "var(--color-pink-100)",
            "--tw-prose-pre-bg": "var(--color-pink-900)",
            "--tw-prose-th-borders": "var(--color-pink-300)",
            "--tw-prose-td-borders": "var(--color-pink-200)",
            "--tw-prose-invert-body": "var(--color-pink-200)",
            "--tw-prose-invert-headings": "var(--color-white)",
            "--tw-prose-invert-lead": "var(--color-pink-300)",
            "--tw-prose-invert-links": "var(--color-white)",
            "--tw-prose-invert-bold": "var(--color-white)",
            "--tw-prose-invert-counters": "var(--color-pink-400)",
            "--tw-prose-invert-bullets": "var(--color-pink-600)",
            "--tw-prose-invert-hr": "var(--color-pink-700)",
            "--tw-prose-invert-quotes": "var(--color-pink-100)",
            "--tw-prose-invert-quote-borders": "var(--color-pink-700)",
            "--tw-prose-invert-captions": "var(--color-pink-400)",
            "--tw-prose-invert-code": "var(--color-white)",
            "--tw-prose-invert-pre-code": "var(--color-pink-300)",
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": "var(--color-pink-600)",
            "--tw-prose-invert-td-borders": "var(--color-pink-700)",
          },
        },
      }),
    },
  },
  plugins: [typography],
} satisfies Config;
