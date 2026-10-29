// Reads ../catalog/commands.tsv and writes src/stats.generated.json so every
// number on screen comes from the real catalog instead of being hardcoded.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const tsv = readFileSync(join(here, "..", "..", "catalog", "commands.tsv"), "utf8");

const rows = tsv
  .split("\n")
  .slice(1)
  .filter((line) => line.trim() !== "" && !line.startsWith("#"))
  .map((line) => line.split("\t"));

const perModule = {};
for (const [module] of rows) perModule[module] = (perModule[module] ?? 0) + 1;

const stats = {
  spells: rows.length,
  modules: Object.keys(perModule).length,
  perModule,
};

writeFileSync(join(here, "..", "src", "stats.generated.json"), JSON.stringify(stats, null, 2) + "\n");
console.log(`catalog: ${stats.spells} spells across ${stats.modules} modules`);
