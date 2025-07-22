import { useFetcher, useRouteLoaderData } from "react-router";
import type { UpdateCurrentUserMetadataRequestBody } from "~/routes/update-current-user-metadata-route/update-current-user-metadata-route";
import type { loader } from "~/root";
import type { Appearance } from "types";

export function useCurrentUserAppearanceSetting(): Appearance {
  const rootData = useRouteLoaderData<typeof loader>("root");
  const fetcher = useFetcher({ key: "update-current-user-metadata" });

  let appearance: Appearance =
    rootData?.currentUser?.client_read_only_metadata?.settings?.appearance ||
    "inherit";

  if (fetcher.json) {
    const metadata = (
      fetcher.json as unknown as UpdateCurrentUserMetadataRequestBody
    )?.metadata;
    if (metadata?.settings?.appearance) {
      appearance = metadata.settings.appearance;
    }
  }

  return appearance;
}
