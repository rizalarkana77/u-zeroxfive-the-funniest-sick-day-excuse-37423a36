// The Funniest Sick-Day Excuse — entry program.
// Writes exactly one line to /output/entry.txt. Deterministic: the same
// bytes on every run. Node 22, standard library only, no network.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I can't come in — my goldfish caught my cold, and as its only qualified nurse I'm taking medical leave by proxy.";

// Self-check the gate before writing: the competition asks for a single
// line under 200 characters that someone could send to call in sick.
// Fail loudly instead of handing the grader a bad file. This line is
// 112 characters: one line, no newline inside it, nothing else.
if (LINE.length >= 200) {
  throw new Error(`line is ${LINE.length} characters, must be under 200`);
}
if (LINE.includes("\n")) {
  throw new Error("line must be a single line");
}
if (LINE.trim() !== LINE) {
  throw new Error("line must not have leading or trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "entry.txt");
writeFileSync(outFile, LINE, "utf8");

// Read it back: the file on disk must be byte-for-byte the line, nothing
// else — no trailing newline, no extra whitespace. If the write ever
// drifts, fail here rather than shipping a bad entry. Log the sha256 so
// repeated runs can be compared byte for byte.
const written = readFileSync(outFile, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the line");
}
const sha256 = createHash("sha256").update(written, "utf8").digest("hex");

console.log(`entry written: ${LINE.length} characters -> ${outFile}`);
console.log(`sha256: ${sha256}`);
