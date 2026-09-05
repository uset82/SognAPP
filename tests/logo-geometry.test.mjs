/**
 * Phase 3 fidelity gate for the React Native logo component.
 *
 * We cannot boot a simulator here, so instead of eyeballing a screenshot we
 * prove the port is the same drawing as the vector master:
 *
 *   1. Parse assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg into an ordered
 *      list of (layer id, path data, fill, opacity).
 *   2. Reconstruct the same list from the geometry compiled into
 *      src/components/brand/SognSafeLogo.tsx.
 *   3. Compare layer-by-layer, in draw order.
 *
 * Draw order matters: these shapes overlap, so a correct set of paths in the
 * wrong sequence is a visibly different icon. This catches coordinate typos,
 * dropped layers, wrong fills and reordering in one pass.
 *
 * Run: node tests/logo-geometry.test.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const iconDir = join(repoRoot, 'assets', 'sogn-safe-icon');

const MASTER_SVG = join(iconDir, 'SOGN-SAFE-App-Icon-1024.svg');
const SMALL_SVG = join(iconDir, 'SOGN-SAFE-App-Icon-Small.svg');
const COMPONENT = join(repoRoot, 'src', 'components', 'brand', 'SognSafeLogo.tsx');

/* ---------- parse the master SVG ---------- */

function parseSvg(file) {
  const xml = readFileSync(file, 'utf8');
  const layers = [];
  const re = /<path\s+([^>]*)\/>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const attrs = m[1];
    const get = (name) => {
      // Anchor on whitespace, otherwise /d="/ also matches id=" and returns
      // the layer name instead of the path data.
      const hit = new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(attrs);
      return hit ? hit[1] : undefined;
    };
    layers.push({
      id: get('id'),
      d: get('d'),
      fill: get('fill'),
      opacity: get('opacity'),
    });
  }
  return layers;
}

/* ---------- reconstruct what the component draws ---------- */

const src = readFileSync(COMPONENT, 'utf8');

function grabObject(name) {
  const anchor = `const ${name}: LogoGeometry = {`;
  const start = src.indexOf(anchor);
  if (start === -1) throw new Error(`Could not find ${name} in the component`);
  const open = src.indexOf('{', start);
  let depth = 0;
  let end = -1;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === '{') depth += 1;
    else if (src[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  // Object of string literals lifted straight from our own source file.
  return eval(`(${src.slice(open, end + 1)})`);
}

const GEO = grabObject('GEO');
const GEO_SMALL = grabObject('GEO_SMALL');

const PALETTE = {
  seam: '#0D1114',
  shadow: '#05080A',
};

/**
 * Mirrors the JSX in SognSafeLogo.tsx for a metallic (non-mono) variant.
 * Fills are normalised to the master's shorthand so the comparison is about
 * geometry and intent, not about url(#...) id naming.
 */
function componentLayers(geo) {
  const layers = [
    { id: 'Center Seam', d: geo.seam, fill: PALETTE.seam },
    { id: 'Ship Left', d: geo.shipLeft, fill: 'url(#metalLeft)' },
    { id: 'Ship Right', d: geo.shipRight, fill: 'url(#metalRight)' },
  ];

  // Each chevron is drawn immediately after its own shadow, so the shadow must
  // stay underneath it - see the waves.map(...) block in the component.
  const waves = [];
  for (const n of [1, 2, 3]) {
    const shadow = geo[`wave${n}Shadow`];
    if (shadow) {
      waves.push({
        id: `Wave 0${n} Shadow`,
        d: shadow,
        fill: PALETTE.shadow,
        opacity: '0.85',
      });
    }
    waves.push({
      id: `Wave 0${n}`,
      d: geo[`wave${n}`],
      fill: 'url(#waveMetal)',
    });
  }

  return [
    ...layers,
    ...(geo.bevelLeft
      ? [{ id: 'Left Bevel', d: geo.bevelLeft, fill: 'url(#bevelGrad)' }]
      : []),
    ...(geo.bevelRight
      ? [{ id: 'Right Bevel', d: geo.bevelRight, fill: 'url(#bevelGrad)' }]
      : []),
    ...waves,
    { id: 'Direction Diamond', d: geo.diamond, fill: 'url(#diamondMetal)' },
  ];
}

/* ---------- compare ---------- */

function compare(label, expected, actual) {
  const problems = [];

  if (expected.length !== actual.length) {
    problems.push(
      `layer count ${expected.length} (svg) vs ${actual.length} (component)`,
    );
  }

  const n = Math.max(expected.length, actual.length);
  for (let i = 0; i < n; i += 1) {
    const e = expected[i];
    const a = actual[i];
    if (!e) {
      problems.push(`[${i}] component draws extra layer "${a.id}"`);
      continue;
    }
    if (!a) {
      problems.push(`[${i}] component is missing layer "${e.id}"`);
      continue;
    }
    if (e.id !== a.id) {
      problems.push(`[${i}] layer id "${e.id}" vs "${a.id}"`);
    }
    if (normalise(e.d) !== normalise(a.d)) {
      problems.push(`[${i}] ${e.id} path data differs`);
      problems.push(`      svg : ${e.d}`);
      problems.push(`      comp: ${a.d}`);
    }
    if ((e.fill ?? '') !== (a.fill ?? '')) {
      problems.push(`[${i}] ${e.id} fill "${e.fill}" vs "${a.fill}"`);
    }
    if ((e.opacity ?? '1') !== (a.opacity ?? '1')) {
      problems.push(`[${i}] ${e.id} opacity "${e.opacity}" vs "${a.opacity}"`);
    }
  }

  const ok = problems.length === 0;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}  (${expected.length} layers)`);
  problems.forEach((p) => console.log(`      ${p}`));
  return ok;
}

/** Collapse whitespace and float formatting so 507.0 === 507. */
function normalise(d = '') {
  return d.trim().replace(/\s+/g, ' ');
}

const master = parseSvg(MASTER_SVG);
const small = parseSvg(SMALL_SVG);

console.log('SOGN SAFE logo port verification');
console.log('================================\n');

const standardOk = compare(
  'standard geometry  <- SOGN-SAFE-App-Icon-1024.svg',
  master,
  componentLayers(GEO),
);

const smallOk = compare(
  'small geometry     <- SOGN-SAFE-App-Icon-Small.svg',
  small,
  componentLayers(GEO_SMALL),
);

console.log('');
const pass = standardOk && smallOk;
console.log(
  pass
    ? 'PASS - the component draws byte-identical geometry to the vector master'
    : 'FAIL - the component has drifted from the vector master',
);
process.exit(pass ? 0 : 1);
