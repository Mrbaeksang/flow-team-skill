#!/usr/bin/env node
// One-step API-key setup for non-developers.
// Run `node setup.mjs`, paste your Flow API key when asked — it writes `.env`.
// You never have to edit a file by hand. `.env` is gitignored, so the key stays local.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const ENV_PATH = new URL("./.env", import.meta.url);

function currentKey() {
  if (!existsSync(ENV_PATH)) return "";
  const m = readFileSync(ENV_PATH, "utf8").match(/^\s*FLOW_API_KEY\s*=\s*(.*)$/m);
  return m ? m[1].trim() : "";
}

const rl = createInterface({ input, output });
try {
  console.log("\n  Flow API key setup");
  console.log("  ──────────────────");
  console.log("  Issue a key from Flow's 키관리 (Key Management) page, then paste it below.\n");

  const existing = currentKey();
  if (existing) console.log(`  (a key is already saved: ${existing.slice(0, 8)}…  — press Enter to keep it)\n`);

  const answer = (await rl.question("  Paste your Flow API key: ")).trim();
  const key = answer || existing;

  if (!key) {
    console.log("\n  No key entered. Nothing changed. Run `node setup.mjs` again when you have one.\n");
    process.exit(1);
  }

  writeFileSync(ENV_PATH, `FLOW_API_KEY=${key}\n`);
  console.log("\n  ✓ Saved to .env (gitignored — your key is never committed).");
  console.log("  Verify it works:  node skills/flow-team/scripts/flow.mjs me\n");
} finally {
  rl.close();
}
