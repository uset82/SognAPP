/**
 * Fidelity and integrity test for the SOGN SAFE brand mark.
 *
 * Chain of custody, from the artwork inwards:
 *
 *   Logoapp.png                       (authoritative logo artwork)
 *     -> assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg   (measured master)
 *       -> scripts/logo-geometry.mjs  (parser + generator)
 *         -> src/components/brand/logoGeometry.generated.ts  (committed output)
 *           -> SognSafeLogo.tsx       (what the app renders)
 *       -> .workbuddy-ai/tools/icon-pipeline/render-all-new.mjs
 *         -> variant SVGs, all PNGs, assets/*.png entrypoints
 *
 * Four gates:
 *   [1] STRUCTURE   the master still contains the expected named layer tree.
 *   [2] FRESHNESS   logoGeometry.generated.ts is exactly what the current
 *                   master produces. This is the real drift gate - it makes
 *                   hand-editing either side a hard failure.
 *   [3] RENDER      the component consumes the generated geometry and is pure
 *                   vector (a raster shortcut would defeat every gate above).
 *   [4] PROVENANCE  every PNG app.json / the Expo plugins can resolve is
 *                   byte-identical to the master-derived render.
 *
 * Run: node tests/logo-geometry.test.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  MASTER_SVG_PATH,
  GENERATED_TS_PATH,
  UNPORTABLE_GROUPS,
  parseMaster,
  renderGeometryModule,
  smallTransform,
} from '../scripts/logo-geometry.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const iconDir = join(repoRoot, 'assets', 'sogn-safe-icon');
const COMPONENT = join(repoRoot, 'src', 'components', 'brand', 'SognSafeLogo.tsx');

let failures = 0;

function check(ok, label, detail) {
  if (ok) {
    console.log(`  PASS  ${label}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${label}`);
    if (detail) console.log(`        ${detail}`);
  }
}

function section(title) {
  console.log(`\n[${title}]`);
}

console.log('SOGN SAFE brand mark - fidelity & integrity');
console.log('===========================================');

if (!existsSync(MASTER_SVG_PATH)) {
  console.log(`\nFATAL: master SVG not found at ${MASTER_SVG_PATH}`);
  process.exit(1);
}
if (!existsSync(COMPONENT)) {
  console.log(`\nFATAL: component not found at ${COMPONENT}`);
  process.exit(1);
}

const xml = readFileSync(MASTER_SVG_PATH, 'utf8');
const compSrc = readFileSync(COMPONENT, 'utf8');

/** Parse failures are structural, so report them as one hard failure. */
let parsed = null;
try {
  parsed = parseMaster(xml);
} catch (err) {
  console.log(`\nFATAL: could not parse master SVG: ${err.message}`);
  process.exit(1);
}

const { gradients, backgroundRects, symbolLayers, symbolBbox, viewBoxRect } = parsed;

/* --------------------- [1] master layer structure ------------------------ */

section('1. Master layer structure');

const EXPECTED_LAYERS = [
  'Charcoal-tile',
  'Fine-edge-highlight',
  'Silver-symbol',
  'Upper-panels',
  'Left-panel-depth',
  'Right-panel-depth',
  'Left-panel-face',
  'Right-panel-face',
  'Bright-inside-bevel',
  'Wide-folded-tier',
  'Wide-tier-depth',
  'Wide-tier-left',
  'Wide-tier-right',
  'Wide-tier-light',
  'Wide-tier-outline',
  'Lower-folded-tier',
  'Lower-tier-depth',
  'Lower-tier-left',
  'Lower-tier-right',
  'Lower-tier-light',
  'Lower-tier-outline',
  'Solid-triangular-tip',
  'Tip-depth',
  'Tip-left',
  'Tip-right',
  'Tip-light',
  'Tip-outline',
  'Brushed-metal-detail',
];

const missing = EXPECTED_LAYERS.filter((id) => !xml.includes(`id="${id}"`));
check(
  missing.length === 0,
  `all ${EXPECTED_LAYERS.length} named layers present`,
  missing.length ? `missing: ${missing.join(', ')}` : undefined
);

// The four elements of the mark, 5 paths each.
const groups = [...new Set(symbolLayers.map((l) => l.group))];
check(
  groups.length === 4,
  `symbol has 4 element groups (${groups.join(', ')})`,
  `found ${groups.length}: ${groups.join(', ')}`
);
check(
  symbolLayers.length === 20,
  `symbol has 20 portable paths (${symbolLayers.length})`
);

// Sanity on the parse itself, so a silent mis-measure cannot pass quietly.
const pctW = Math.round((symbolBbox.width / viewBoxRect.width) * 100);
const pctH = Math.round((symbolBbox.height / viewBoxRect.height) * 100);
console.log(
  `  INFO  symbol bbox ${symbolBbox.width} x ${symbolBbox.height} ` +
    `-> ${pctW}% width, ${pctH}% height of canvas`
);
check(
  symbolBbox.minX > viewBoxRect.x &&
    symbolBbox.maxX < viewBoxRect.x + viewBoxRect.width &&
    symbolBbox.minY > viewBoxRect.y &&
    symbolBbox.maxY < viewBoxRect.y + viewBoxRect.height,
  'symbol sits fully inside the tile (with margin)'
);

check(
  gradients.length === 11 && gradients.every((g) => g.stops.length >= 2),
  `11 gradients, each with >= 2 stops (${gradients.length})`
);
check(
  backgroundRects.length === 2,
  `2 background rects (${backgroundRects.map((r) => r.id).join(', ')})`
);
check(
  UNPORTABLE_GROUPS.every((g) => xml.includes(`id="${g}"`)),
  `excluded groups still exist in the master (${UNPORTABLE_GROUPS.join(', ')})`
);

/* ------------------------- [2] generated freshness ----------------------- */

section('2. Generated geometry is fresh (drift gate)');

const expectedModule = renderGeometryModule(parsed);

let currentModule = null;
try {
  currentModule = readFileSync(GENERATED_TS_PATH, 'utf8');
} catch {
  currentModule = null;
}

if (currentModule === null) {
  check(false, 'logoGeometry.generated.ts exists', 'run: node scripts/logo-geometry.mjs');
} else {
  check(
    currentModule === expectedModule,
    'logoGeometry.generated.ts matches the master',
    'stale - regenerate with: node scripts/logo-geometry.mjs'
  );

  // Pin the values the rest of the app leans on.
  check(
    currentModule.includes(`export const MASTER_VIEWBOX = '${parsed.viewBox}'`),
    `MASTER_VIEWBOX is '${parsed.viewBox}'`
  );
  check(
    currentModule.includes(`export const SMALL_TRANSFORM = '${smallTransform(parsed)}'`),
    `SMALL_TRANSFORM is '${smallTransform(parsed)}'`
  );
}

/* --------------------- [3] component consumes it ------------------------- */

section('3. Component wiring');

for (const name of [
  'MASTER_VIEWBOX',
  'SMALL_TRANSFORM',
  'GRADIENTS',
  'BACKGROUND_RECTS',
  'SYMBOL_LAYERS',
]) {
  check(
    compSrc.includes(name),
    `component uses generated ${name}`
  );
}

check(
  /from '\.\/logoGeometry\.generated'/.test(compSrc),
  'component imports ./logoGeometry.generated'
);

// A raster shortcut would render a PNG and defeat every check above.
check(
  !/require\([^)]*\.png|from '[^']*\.png'/.test(compSrc),
  'component is pure vector (no raster import)'
);

// The generator owns the geometry; the component must not restate any of it.
check(
  !/const GEO|d:\s*'M\d/.test(compSrc),
  'component does not hand-transcribe path data'
);

check(
  /export const SognSafeLogo/.test(compSrc) && /export default SognSafeLogo/.test(compSrc),
  'SognSafeLogo is exported (named + default)'
);

check(
  /preserveAspectRatio="none"/.test(compSrc),
  'component preserves the master aspect handling'
);

/* ----------------------- [4] app-facing PNGs ----------------------------- */

section('4. App-facing PNGs match the master render');

/** Every image path app.json or an Expo plugin can resolve. */
const ENTRYPOINTS = [
  { to: 'assets/icon.png', from: 'png/SOGN-SAFE-App-Icon-1024.png', size: 1024 },
  { to: 'assets/splash-icon.png', from: 'png/SOGN-SAFE-App-Icon-1024.png', size: 1024 },
  { to: 'assets/favicon.png', from: 'png/SOGN-SAFE-App-Icon-128.png', size: 128 },
  {
    to: 'assets/android-icon-foreground.png',
    from: 'png-symbol-square/Symbol-Only-Square-Metallic-1024.png',
    size: 1024,
  },
  {
    to: 'assets/android-icon-monochrome.png',
    from: 'png-symbol-square-mono/Symbol-Only-Square-Mono-White-1024.png',
    size: 1024,
  },
  { to: 'assets/images/icon.png', from: 'png/SOGN-SAFE-App-Icon-1024.png', size: 1024 },
  { to: 'assets/images/splash-icon.png', from: 'png/SOGN-SAFE-App-Icon-1024.png', size: 1024 },
  { to: 'assets/images/favicon.png', from: 'png/SOGN-SAFE-App-Icon-128.png', size: 128 },
  {
    to: 'assets/images/android-icon-foreground.png',
    from: 'png-symbol-square/Symbol-Only-Square-Metallic-1024.png',
    size: 1024,
  },
  {
    to: 'assets/images/android-icon-monochrome.png',
    from: 'png-symbol-square-mono/Symbol-Only-Square-Mono-White-1024.png',
    size: 1024,
  },
];

for (const { to, from, size } of ENTRYPOINTS) {
  const targetPath = join(repoRoot, to);
  const sourcePath = join(iconDir, from);

  if (!existsSync(targetPath)) {
    check(false, `${to} exists`);
    continue;
  }
  if (!existsSync(sourcePath)) {
    check(false, `${to} <- source missing: sogn-safe-icon/${from}`);
    continue;
  }

  const buf = readFileSync(targetPath);
  if (buf.length < 24 || buf.toString('ascii', 1, 4) !== 'PNG') {
    check(false, `${to} is a valid PNG`);
    continue;
  }

  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  if (w !== size || h !== size) {
    check(false, `${to} is ${size}x${size}`, `got ${w}x${h}`);
    continue;
  }

  const srcBuf = readFileSync(sourcePath);
  check(buf.equals(srcBuf), `${to} == sogn-safe-icon/${from}`);
}

/* --------------------- [5] app.json resolves paths ----------------------- */

section('5. app.json points at files that exist');

const appJson = JSON.parse(readFileSync(join(repoRoot, 'app.json'), 'utf8')).expo;
const referenced = [
  appJson.icon,
  appJson.splash?.image,
  appJson.web?.favicon,
  appJson.android?.adaptiveIcon?.foregroundImage,
  appJson.android?.adaptiveIcon?.monochromeImage,
  ...(appJson.plugins ?? [])
    .filter(Array.isArray)
    .flatMap(([, opts]) => (opts && typeof opts === 'object' ? [opts.image, opts.icon] : [])),
].filter((p) => typeof p === 'string');

for (const p of referenced) {
  const abs = join(repoRoot, p.replace(/^\.\//, ''));
  check(existsSync(abs), `app.json -> ${p}`);
}

/* ------------------------------------------------------------------------- */

console.log('\n===========================================');
if (failures === 0) {
  console.log('PASS - brand mark matches the master everywhere');
  process.exit(0);
}
console.log(`FAIL - ${failures} check(s) failed`);
process.exit(1);
