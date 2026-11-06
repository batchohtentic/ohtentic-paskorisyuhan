import { test } from "node:test";
import assert from "node:assert/strict";
import { can, PERMISSIONS, ROLES } from "../src/lib/auth/roles.ts";

test("checkpoint personnel can submit checkpoints but never see private/financial data or settings", () => {
  const r = ["checkpoint_personnel"] as const;
  assert.equal(can(r, "checkpoint.submit"), true);
  assert.equal(can(r, "registrations.view_private"), false);
  assert.equal(can(r, "registrations.manage"), false);
  assert.equal(can(r, "settings.manage"), false);
  assert.equal(can(r, "users.manage"), false);
  assert.equal(can(r, "results.approve"), false);
});

test("only the Results Administrator (or Super Admin) approves official winners", () => {
  for (const role of ROLES) {
    const expected = role === "results_admin" || role === "super_admin";
    assert.equal(can([role], "results.approve"), expected, role);
  }
});

test("only Race Director (or Super Admin) controls the race clock", () => {
  for (const role of ROLES) assert.equal(can([role], "race.clock"), role === "race_director" || role === "super_admin", role);
});

test("super admin has every permission", () => {
  for (const p of Object.keys(PERMISSIONS) as (keyof typeof PERMISSIONS)[]) assert.equal(can(["super_admin"], p), true, p);
});

test("no roles = no permissions", () => {
  for (const p of Object.keys(PERMISSIONS) as (keyof typeof PERMISSIONS)[]) assert.equal(can([], p), false, p);
});
