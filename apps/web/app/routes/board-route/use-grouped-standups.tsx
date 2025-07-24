// NOTE: By default, the standups are grouped by date. In the future, we can group by something else with a different option.

import { DateTime } from "luxon";
import type { Standup } from "types";

function useGroupedStandups({
  standups,
  timezone,
}: {
  standups: Standup[];
  timezone: string;
}): { groups: [dateKey: string, standups: Standup[]][] } {
  const today = DateTime.now().setZone(timezone).startOf("day");

  const groupedStandups = standups.reduce<Map<string, Standup[]>>(
    (grouped, standup) => {
      const standupDate = DateTime.fromISO(standup.createdAt, { zone: "utc" })
        .setZone(timezone)
        .startOf("day");

      const key = standupDate.equals(today) ? "today" : standupDate.toISODate();

      if (!key) {
        return grouped;
      }

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key)?.push(standup);

      return grouped;
    },
    new Map<string, Standup[]>()
  );

  if (!groupedStandups.has("today")) {
    groupedStandups.set("today", []);
  }

  const sortedGroups = Array.from(groupedStandups.entries()).sort((a, b) => {
    if (a[0] === "today") return -1;
    if (b[0] === "today") return 1;

    return DateTime.fromISO(b[0], { zone: "utc" })
      .setZone(timezone)
      .diff(DateTime.fromISO(a[0], { zone: "utc" }).setZone(timezone))
      .toMillis();
  });

  return {
    groups: sortedGroups,
  };
}

export default useGroupedStandups;
