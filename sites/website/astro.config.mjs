// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://standupkiwi.com",
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), mdx(), sitemap()],
});
