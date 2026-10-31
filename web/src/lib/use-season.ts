// Client hooks for the seasonal decorations. Both return their server value
// during SSR and hydration, then the browser's value right after, so the
// static HTML never depends on the visitor's date or settings.
import { useSyncExternalStore } from "react";
import { currentSeason, type Season } from "@/lib/season";

const noSubscription = () => () => {};

/** The season to decorate for (calendar or ?season=), null on the server. */
export function useSeason(): Season | null {
  return useSyncExternalStore(
    noSubscription,
    () => currentSeason(window.location.search),
    () => null,
  );
}

/** Whether `query` matches, kept in sync; `serverValue` before hydration. */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
