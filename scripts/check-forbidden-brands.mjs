const FORBIDDEN = [
  { term: "grok", pattern: /\bgrok\b/i },
  { term: "grok bot", pattern: /\bgrok\s+bot\b/i },
  { term: "xai", pattern: /\bxai\b/i },
  // Solo la marca con C mayúscula: "cursor" en minúscula choca con CSS y librerías de gráficos.
  { term: "Cursor", pattern: /(?<![A-Za-z])Cursor(?![A-Za-z])/ },
  { term: "llm", pattern: /\bllm\b/i },
  { term: "token", pattern: /\btoken\b/i },
  { term: "prompt", pattern: /\bprompt\b/i },
  { term: "agente", pattern: /\bagente\b/i },
  { term: "sesión de modelo", pattern: /\bsesi[oó]n\s+de\s+modelo\b/i },
  { term: "máquina virtual", pattern: /\bm[aá]quina\s+virtual\b/i },
  { term: "proveedor técnico", pattern: /\bproveedor\s+t[eé]cnico\b/i },
];

const ROOTS = ["src", "public", "dist"];
const IGNORE_DIRS = new Set(["node_modules", ".git", ".tools", "coverage"]);
const ALLOWED_TEST_HINTS = [/forbidden/i, /brand/i, /check-forbidden/i];
const BINARY_EXT = new Set([
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".eot",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".svg",
  ".map",
]);

import fs from "node:fs";
import path from "node:path";

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function isAllowedTest(file) {
  return ALLOWED_TEST_HINTS.some((re) => re.test(file));
}

function isBinaryAsset(file) {
  return BINARY_EXT.has(path.extname(file).toLowerCase());
}

const hits = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (isAllowedTest(file) || isBinaryAsset(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const item of FORBIDDEN) {
      if (item.pattern.test(text)) {
        hits.push({ file, term: item.term });
      }
    }
  }
}

if (hits.length) {
  console.error("Términos prohibidos encontrados:");
  for (const hit of hits) {
    console.error(` - ${hit.file}: "${hit.term}"`);
  }
  process.exit(1);
}

console.log("lint:brand OK — sin términos prohibidos en src/public/dist.");
