import test from "node:test";
import assert from "node:assert/strict";
import { calculateCompatibility, detectSkills } from "../lib/scoring.js";

test("detectSkills finds known technologies and aliases", () => {
  assert.deepEqual(detectSkills("Je maîtrise React, NextJS, Tailwind et les API REST."), ["React", "Next.js", "Tailwind CSS", "REST API"]);
});

test("calculateCompatibility returns matching and missing skills", () => {
  const result = calculateCompatibility(["React", "Git"], ["React", "TypeScript", "Git"]);
  assert.equal(result.score, 67);
  assert.deepEqual(result.matching, ["React", "Git"]);
  assert.deepEqual(result.missing, ["TypeScript"]);
});

test("calculateCompatibility keeps a usable educational baseline", () => {
  assert.equal(calculateCompatibility([], []).score, 18);
});
