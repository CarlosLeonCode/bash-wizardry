// Seasonal ambience calendar. Pure and dependency-free so `npm test` can run
// it with Node's built-in runner (src/lib/season.test.ts).

export const SEASONS = ["halloween", "christmas", "valentine"] as const;

export type Season = (typeof SEASONS)[number];

/** Inclusive windows as [month, day], months 1-based. Christmas wraps New Year. */
const WINDOWS: { season: Season; from: [number, number]; to: [number, number] }[] = [
  { season: "halloween", from: [10, 15], to: [11, 2] },
  { season: "christmas", from: [12, 1], to: [1, 6] },
  { season: "valentine", from: [2, 1], to: [2, 15] },
];

const dayKey = ([month, day]: [number, number]) => month * 100 + day;

/** The season for the visitor's LOCAL calendar date, or null outside them. */
export function seasonFor(date: Date): Season | null {
  const today = dayKey([date.getMonth() + 1, date.getDate()]);
  for (const { season, from, to } of WINDOWS) {
    const start = dayKey(from);
    const end = dayKey(to);
    const inside =
      start <= end
        ? today >= start && today <= end
        : today >= start || today <= end;
    if (inside) return season;
  }
  return null;
}

/**
 * The season to show: `?season=halloween|christmas|valentine|none` overrides
 * the calendar so any season can be previewed out of its dates.
 */
export function currentSeason(
  search: string,
  date: Date = new Date(),
): Season | null {
  const override = new URLSearchParams(search).get("season")?.toLowerCase();
  if (override === "none") return null;
  if (SEASONS.includes(override as Season)) return override as Season;
  return seasonFor(date);
}
