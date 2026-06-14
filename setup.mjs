#!/usr/bin/env node
// One-step API-key setup. Two ways to use it — both keep the key out of the AI's view:
//
//   A) File hand-off (AI never reads the key):
//      An assistant creates `flow-key.txt`, you paste your key into it and save,
//      then run `node setup.mjs`. The script reads flow-key.txt, transplants the key
//      into `.env`, and deletes flow-key.txt. The assistant never opens the key file.
//
//   B) Interactive prompt:
//      `node setup.mjs` with no key file present asks you to paste the key in the
//      terminal (not the chat), then writes `.env`.
//
// `.env` and `flow-key.txt` are both gitignored — the key never gets committed.

import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const ENV_PATH = new URL("./.env", import.meta.url);
// Accept a few obvious names so whoever creates the hand-off file can't miss.
const KEY_FILE_NAMES = ["flow-key.txt", "FLOW_KEY.txt", "key.txt"];

function sanitize(raw) {
  // Tolerate "FLOW_API_KEY=xxx", quotes, comments, and stray whitespace/newlines.
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.replace(/^FLOW_API_KEY\s*=\s*/i, "").replace(/^["']|["']$/g, "").trim())
    .find((l) => l.length > 0) || "";
}

function currentKey() {
  if (!existsSync(ENV_PATH)) return "";
  const m = readFileSync(ENV_PATH, "utf8").match(/^\s*FLOW_API_KEY\s*=\s*(.*)$/m);
  return m ? m[1].trim() : "";
}

function save(key) {
  writeFileSync(ENV_PATH, `FLOW_API_KEY=${key}\n`);
  console.log("\n  ✓ Saved to .env (gitignored — your key is never committed).");
  console.log("  Verify it works:  node skills/flow-team/scripts/flow.mjs me\n");
}

// --- A) File hand-off: import from flow-key.txt, then delete it ----------------
for (const name of KEY_FILE_NAMES) {
  const fileUrl = new URL(`./${name}`, import.meta.url);
  if (!existsSync(fileUrl)) continue;
  const key = sanitize(readFileSync(fileUrl, "utf8"));
  if (!key) {
    console.log(`\n  ${name} is empty. Paste your Flow API key into it, save, and run again.\n`);
    process.exit(1);
  }
  save(key);
  unlinkSync(fileUrl); // remove the plaintext hand-off file
  console.log(`  (${name} deleted.)\n`);
  process.exit(0);
}

// --- B) Interactive prompt -----------------------------------------------------
const rl = createInterface({ input, output });
try {
  console.log("\n  Flow API key setup");
  console.log("  ──────────────────");
  console.log("  Issue a key from Flow's 키관리 (Key Management) page, then paste it below.");
  console.log("  (Or create flow-key.txt, paste the key there, and run this again.)\n");

  const existing = currentKey();
  if (existing) console.log(`  (a key is already saved: ${existing.slice(0, 8)}…  — press Enter to keep it)\n`);

  const answer = (await rl.question("  Paste your Flow API key: ")).trim();
  const key = answer || existing;

  if (!key) {
    console.log("\n  No key entered. Nothing changed. Run `node setup.mjs` again when you have one.\n");
    process.exit(1);
  }
  save(key);
} finally {
  rl.close();
}
