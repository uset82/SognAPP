/**
 * Bake a uniform scale into the Silver-symbol path coordinates.
 *
 * One-off helper. Replaces a hand-written `<g transform="...">` (which
 * react-native-svg won't replicate 1:1) with literal scaled coordinates so
 * the master, the generated geometry module and the React component all
 * render the same thing.
 *
 * Run: node scripts/bake-symbol-scale.mjs <scale>
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { parseMaster } from './logo-geometry.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const masterPath = join(
  repoRoot,
  'assets',
  'sogn-safe-icon',
  'SOGN-SAFE-App-Icon-1024.svg'
);

const scaleArg = Number(process.argv[2]);
if (!Number.isFinite(scaleArg) || scaleArg <= 0) {
  console.error('usage: node scripts/bake-symbol-scale.mjs <scale>');
  process.exit(2);
}
const SCALE = scaleArg;

const svg = readFileSync(masterPath, 'utf8');

// Use the same bbox the generator reports (excludes the brushed-metal
// hairlines, which extend well past the visible symbol).
const bbox = parseMaster(svg).symbolBbox;
const cx = bbox.centerX;
const cy = bbox.centerY;

console.log(
  `symbol bbox before scaling: ${bbox.width} x ${bbox.height}, centre (${cx}, ${cy})`
);
console.log(`scaling by ${SCALE} around the centre...`);

const round = (n) => Math.round(n * 100) / 100;

function scalePath(d) {
  const tokenRe = /([MLQZmlqz])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/g;
  let m;
  const tokens = [];
  while ((m = tokenRe.exec(d)) !== null) tokens.push(m[1] !== undefined ? m[1] : m[2]);

  let i = 0;
  let cmd = null;
  let out = '';
  while (i < tokens.length) {
    if (/^[MLQZmlqz]$/.test(tokens[i])) {
      cmd = tokens[i];
      out += cmd;
      i += 1;
      continue;
    }
    if (cmd === null) throw new Error(`path data starts with a number: ${d}`);
    if (cmd === 'Z' || cmd === 'z') continue;
    if (cmd === 'Q' || cmd === 'q') {
      out += ` ${round(cx + (Number(tokens[i]) - cx) * SCALE)} ${round(cy + (Number(tokens[i + 1]) - cy) * SCALE)}`;
      out += ` ${round(cx + (Number(tokens[i + 2]) - cx) * SCALE)} ${round(cy + (Number(tokens[i + 3]) - cy) * SCALE)}`;
      i += 4;
    } else {
      out += ` ${round(cx + (Number(tokens[i]) - cx) * SCALE)} ${round(cy + (Number(tokens[i + 1]) - cy) * SCALE)}`;
      i += 2;
    }
  }
  return out.trim();
}

// Scale every path inside Silver-symbol, including the brushed-metal-detail
// group - it has to move too so the clipPath stays lined up.
const next = svg.replace(
  /<g id="Silver-symbol"([\s\S]*?)<\/g>(?=[\s\S]*?<\/g>\s*<\/svg>)/,
  (whole) => {
    const open = whole.indexOf('>');
    const close = whole.lastIndexOf('</g>');
    const body = whole.slice(open + 1, close);
    const newBody = body.replace(
      /<path\b([^>]*?)\bd="([^"]+)"([^>]*)>/g,
      (_whole, pre, d, post) => `<path${pre}d="${scalePath(d)}"${post}>`
    );
    return whole.slice(0, open + 1) + newBody + '</g>';
  }
);

writeFileSync(masterPath, next, 'utf8');

const after = parseMaster(next).symbolBbox;
console.log(`wrote ${masterPath}`);
console.log(
  `symbol bbox after scaling: ${after.width} x ${after.height} (was ${bbox.width} x ${bbox.height})`
);
