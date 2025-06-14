import { useAutoRevalidation } from "~/hooks/use-auto-revalidation";
import { ClientOnly } from "./client-only";

function AutoRevalidationHandler({
  focus = true,
  visibilityChange = true,
  interval,
}: {
  focus?: boolean;
  visibilityChange?: boolean;
  interval?: number;
}) {
  const { state } = useAutoRevalidation({
    focus,
    visibilityChange,
    interval,
  });

  return null;
}

function AutoRevalidator({
  focus = true,
  visibilityChange = true,
  interval,
}: {
  focus?: boolean;
  visibilityChange?: boolean;
  interval?: number;
}) {
  return (
    <ClientOnly>
      {() => (
        <AutoRevalidationHandler
          focus={focus}
          visibilityChange={visibilityChange}
          interval={interval}
        />
      )}
    </ClientOnly>
  );
}

export default AutoRevalidator;
