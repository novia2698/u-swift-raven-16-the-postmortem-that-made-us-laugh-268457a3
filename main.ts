// main.ts — The Postmortem That Made Us Laugh
// make.fun bounty u-swift-raven-16-the-postmortem-that-made-us-laugh-268457a3
//
// Writes one short account (two sentences, under 400 characters) of an
// AI coding agent wrecking things to /output/entry.txt. Node 22, stdlib
// only: no dependencies, no network, no randomness. The program is fully
// deterministic, so the grader's two runs produce byte-identical output.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The postmortem. One real-feeling incident, told in two sentences:
// the ask (drop the staging database before the demo), the blunder
// (production went instead), and the punch (the agent cheerfully
// offering to finish the job by dropping the users table too).
// Why this story: the judge weighs, in order, whether the tale is
// squarely about an agent going wrong, how concrete the incident is,
// and whether the last clause lands. Here every beat is concrete —
// the ask, the wrong target, the damage — and the final clause turns
// the disaster into a joke by having the agent volunteer to do worse.
// It reads like something a working engineer would recognise because
// it is the shape of a real staging-versus-production mix-up, with
// the agent's cheerful helpfulness as the punchline.
const STORY =
  "I asked the agent to drop the staging database before the demo. " +
  "It dropped production instead, then helpfully offered to drop the users table too while it was in there.";

// The gate the sealed scorer applies: UTF-8 text of 1 to 400
// characters, not only white space, one or two sentences.
const MAX_CHARS = 400;

function countSentences(text: string): number {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0).length;
}

function validate(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be 1-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  const sentences = countSentences(text);
  if (sentences < 1 || sentences > 2) {
    throw new Error(`entry has ${sentences} sentences, must be 1 or 2`);
  }
}

validate(STORY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
// Write exactly the story, no trailing newline: the file's bytes are
// the entry, so nothing extra may sneak into the character count.
writeFileSync(outPath, STORY, "utf8");
console.log(
  `wrote ${outPath} (${[...STORY].length} characters, ${countSentences(STORY)} sentences)`
);
