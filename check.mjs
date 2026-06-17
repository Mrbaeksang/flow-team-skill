// Cross-platform syntax check — replaces the bash `for` loop that broke on Windows.
// Recursively finds every .mjs under the repo and runs `node --check` on it.
// Pure Node (no shell), so `npm run check` behaves the same on Windows/macOS/Linux.
//   node check.mjs
import { readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = dirname(fileURLToPath(import.meta.url));
const SKIP = new Set(["node_modules", ".git"]);

function findMjs(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...findMjs(p));
    else if (name.endsWith(".mjs")) out.push(p);
  }
  return out;
}

const files = findMjs(root).sort();
let failed = 0;
for (const f of files) {
  const rel = f.slice(root.length + 1);
  try {
    execFileSync(process.execPath, ["--check", f], { stdio: "pipe" });
    console.log(`ok  ${rel}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${rel}\n${e.stderr?.toString() || e.message}`);
  }
}
console.log(`\n${files.length - failed}/${files.length} files OK`);
process.exit(failed ? 1 : 0);
