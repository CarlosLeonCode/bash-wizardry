// Run with `npm test` (node --test --experimental-strip-types).
import { test } from "node:test";
import assert from "node:assert/strict";
import { currentSeason, seasonFor } from "./season.ts";

// Noon local time: no timezone or DST edge can move the calendar day.
const day = (year: number, month: number, date: number) =>
  new Date(year, month - 1, date, 12);

const cases: [string, Date, ReturnType<typeof seasonFor>][] = [
  // Halloween: Oct 15 – Nov 2
  ["day before Halloween", day(2026, 10, 14), null],
  ["first day of Halloween", day(2026, 10, 15), "halloween"],
  ["Halloween", day(2026, 10, 31), "halloween"],
  ["last day of Halloween", day(2026, 11, 2), "halloween"],
  ["day after Halloween", day(2026, 11, 3), null],
  // Christmas: Dec 1 – Jan 6, across the year boundary
  ["day before Christmas", day(2026, 11, 30), null],
  ["first day of Christmas", day(2026, 12, 1), "christmas"],
  ["New Year's Eve", day(2026, 12, 31), "christmas"],
  ["New Year's Day", day(2027, 1, 1), "christmas"],
  ["last day of Christmas", day(2027, 1, 6), "christmas"],
  ["day after Christmas", day(2027, 1, 7), null],
  // Valentine's: Feb 1 – 15
  ["day before Valentine's", day(2027, 1, 31), null],
  ["first day of Valentine's", day(2027, 2, 1), "valentine"],
  ["last day of Valentine's", day(2027, 2, 15), "valentine"],
  ["day after Valentine's", day(2027, 2, 16), null],
  ["leap day", day(2028, 2, 29), null],
  ["midsummer", day(2026, 7, 1), null],
];

for (const [name, date, expected] of cases) {
  test(`seasonFor: ${name}`, () => {
    assert.equal(seasonFor(date), expected);
  });
}

test("seasonFor uses the local calendar day, not UTC", () => {
  assert.equal(seasonFor(new Date(2026, 9, 14, 23, 59)), null);
  assert.equal(seasonFor(new Date(2026, 9, 15, 0, 0)), "halloween");
  assert.equal(seasonFor(new Date(2027, 0, 6, 23, 59)), "christmas");
  assert.equal(seasonFor(new Date(2027, 0, 7, 0, 0)), null);
});

test("currentSeason: ?season= overrides the calendar", () => {
  const summer = day(2026, 7, 1);
  assert.equal(currentSeason("?season=halloween", summer), "halloween");
  assert.equal(currentSeason("?season=christmas", summer), "christmas");
  assert.equal(currentSeason("season=valentine", summer), "valentine");
  assert.equal(currentSeason("?lang=es&season=Christmas", summer), "christmas");
});

test("currentSeason: ?season=none hides an active season", () => {
  assert.equal(currentSeason("?season=none", day(2026, 10, 31)), null);
});

test("currentSeason: no or unknown override falls back to the calendar", () => {
  assert.equal(currentSeason("", day(2026, 10, 31)), "halloween");
  assert.equal(currentSeason("?season=easter", day(2026, 10, 31)), "halloween");
  assert.equal(currentSeason("?season=", day(2026, 7, 1)), null);
});
