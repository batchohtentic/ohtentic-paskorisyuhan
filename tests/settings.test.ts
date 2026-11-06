import { test } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_FUN_RUN_SETTINGS, funRunSettingsSchema } from "../src/lib/settings-schema.ts";

test("defaults are valid and contain no invented details", () => {
  const d = funRunSettingsSchema.parse(DEFAULT_FUN_RUN_SETTINGS);
  assert.equal(d.eventDate, "2026-12-05");
  for (const k of ["startingPoint", "destination", "registrationFormUrl", "paymentInstructions", "routeInfo"] as const) assert.equal(d[k], null, k);
});

test("registration link must be https", () => {
  const bad = funRunSettingsSchema.safeParse({ ...DEFAULT_FUN_RUN_SETTINGS, registrationFormUrl: "javascript:alert(1)" });
  assert.equal(bad.success, false);
  const http = funRunSettingsSchema.safeParse({ ...DEFAULT_FUN_RUN_SETTINGS, registrationFormUrl: "http://forms.gle/x" });
  assert.equal(http.success, false);
  const ok = funRunSettingsSchema.safeParse({ ...DEFAULT_FUN_RUN_SETTINGS, registrationFormUrl: "https://forms.gle/abc" });
  assert.equal(ok.success, true);
});

test("empty strings become null (shown as To be announced)", () => {
  const r = funRunSettingsSchema.parse({ ...DEFAULT_FUN_RUN_SETTINGS, startingPoint: "  " });
  assert.equal(r.startingPoint, null);
});
