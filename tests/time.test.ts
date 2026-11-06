import { test } from "node:test";
import assert from "node:assert/strict";
import { countdownParts, manilaDate, formatTime } from "../src/lib/time.ts";

const start = manilaDate("2026-12-05", "05:00").getTime();
const end = manilaDate("2026-12-05", "12:00").getTime();

test("race day 5:00 AM Manila is 21:00 UTC the day before", () => {
  assert.equal(new Date(start).toISOString(), "2026-12-04T21:00:00.000Z");
});

test("countdown from today (Nov 6, 2026 noon PH) shows 28 days 17 hours", () => {
  const p = countdownParts(manilaDate("2026-11-06", "12:00").getTime(), start, end);
  assert.deepEqual(p, { phase: "before", days: 28, hours: 17, minutes: 0, seconds: 0 });
});

test("one second before the gun", () => {
  const p = countdownParts(start - 1000, start, end);
  assert.equal(p.phase, "before");
  assert.equal(p.seconds, 1);
});

test("at the gun → THE RACE IS ON", () => {
  assert.equal(countdownParts(start, start, end).phase, "during");
});

test("after the event → THANK YOU", () => {
  assert.equal(countdownParts(end, start, end).phase, "after");
  assert.equal(countdownParts(end + 86_400_000, start, end).phase, "after");
});

test("times display in Philippine time regardless of server timezone", () => {
  assert.match(formatTime(new Date(start)), /^5:00\s?AM$/i);
});
