// GTA VI Trophy Guide & Tracker — make.fun gta6-trophy-guide-01 entry (Node 22, stdlib only).
// The guide itself is plain static files under app/ (index.html + style.css + app.js +
// data/trophies.json): it opens in a desktop browser and works with the network off.
// This program hands the entry in: it copies app/ and screenshots/ from beside this
// file into /output (or MAKEFUN_OUTPUT_DIR outside the grader) and writes
// /output/dossier.json with the vendored make.fun library, which is what the judge
// reads. vendor/makefun-frontend.ts is the kit's copy and must stay unchanged.
//
// Run it locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The copy is byte-for-byte (cpSync preserves file bytes), so the grader's two
// runs of this program write identical /output trees and identical dossier.json.
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Caps mirror the scorer's gate: at most 4 screenshots, each 256 KiB or less;
// app/ at most 993 files/directories and 48 MiB; dossier text capped at 160 KiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
