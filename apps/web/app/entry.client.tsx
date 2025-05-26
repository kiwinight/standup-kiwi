import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import posthog from "posthog-js";

function PosthogInit() {
  useEffect(() => {
    posthog.init(import.meta.env.VITE_POSTHOG_PROJECT_API_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_API_HOST,
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    });
  }, []);

  return null;
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
      <PosthogInit />
    </StrictMode>
  );
});
