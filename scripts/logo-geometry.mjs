/**
 * Single source of truth for the SOGN SAFE brand mark geometry.
 *
 * The master SVG (`assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg`) is a
 * measured reconstruction of `Logoapp.png`. This module parses it and emits
 * `src/components/brand/logoGeometry.generated.ts`, which the React Native
 * component renders from.
 *
 * Everything downstream - the variant SVGs, all PNGs, the app icons and the
 * in-app mark - therefore traces back to one file. Hand-copying path data into
 * the component is what previously let the app drift from the artwork; this
 * generator removes that failure mode.
 *
 * No dependencies: pure string parsing, so both the build pipeline and the
 * test suite can import it directly.
 *
 * Run:  node scripts/logo-geometry.mjs            (writes the .ts module)
 *       node scripts/logo-geometry.mjs --check    (fails if it is stale)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');

export const MASTER_SVG_PATH = join(
  repoRoot,
  'assets',
  'sogn-safe-icon',
  'SOGN-SAFE-App-Icon-1024.svg'
);

export const GENERATED_TS_PATH = join(
  repoRoot,
  'src',
  'components',
  'brand',
  'logoGeometry.generated.ts'
);

/**
 * Groups inside <g id="Silver-symbol"> that react-native-svg cannot render.
 * `Brushed-metal-detail` is a clipped set of 116 hairlines at 8% opacity -
 * decorative only, and far too expensive for a 34pt in-app mark.
 */
export const UNPORTABLE_GROUPS = ['Brushed-metal-detail'];

/** How much the `small` variant scales the symbol up for tiny sizes. */
export const SMALL_SCALE = 1.22;

/* ------------------------------ XML helpers ------------------------------ */

export function attrs(tagBody) {
  const out = {};
  // Names may contain digits (x1, y2) and hyphens (stroke-width), and always
  // start with a letter.
  const re = /([a-zA-Z][a-zA-Z0-9-]*)="([^"]*)"/g;
  let m;
  while ((m = re.exec(tagBody)) !== null) out[m[1]] = m[2];
  return out;
}

export function eachOpeningTag(xml, name) {
  const out = [];
  const re = new RegExp(`<${name}\\b([^>]*)>`, 'g');
  let m;
  while ((m = re.exec(xml)) !== null) out.push(attrs(m[1]));
  return out;
}

export function eachBlock(xml, name) {
  const out = [];
  const re = new RegExp(`<${name}\\b([^>]*)>([\\s\\S]*?)</${name}>`, 'g');
  let m;
  while ((m = re.exec(xml)) !== null) out.push({ attrs: attrs(m[1]), body: m[2] });
  return out;
}

function matchingCloseG(haystack, from) {
  let depth = 1;
  const re = /<g\b[^>]*>|<\/g>/g;
  re.lastIndex = from;
  let m;
  while ((m = re.exec(haystack)) !== null) {
    if (m[0] === '</g>') {
      depth -= 1;
      if (depth === 0) return m.index;
    } else {
      depth += 1;
    }
  }
  return -1;
}

export function extractGroup(xml, id) {
  const open = new RegExp(`<g id="${id}"[^>]*>`).exec(xml);
  if (!open) throw new Error(`group <g id="${id}"> not found`);
  const close = matchingCloseG(xml, open.index + open[0].length);
  if (close === -1) throw new Error(`unbalanced <g id="${id}">`);
  return xml.slice(open.index, close + '</g>'.length);
}

/**
 * Everything INSIDE a `<g ...>...</g>` snippet, i.e. with the wrapper's own
 * opening and closing tags removed.
 */
export function groupBody(groupXml) {
  const openEnd = groupXml.indexOf('>') + 1;
  const closeStart = groupXml.lastIndexOf('</g>');
  if (openEnd <= 0 || closeStart < openEnd) throw new Error('malformed <g> snippet');
  return groupXml.slice(openEnd, closeStart);
}

/**
 * The DIRECT `<g>` children of a container, with balanced bodies.
 *
 * A lazy `[\s\S]*?` match is not good enough here: on nested groups it pairs
 * an outer opening tag with an inner `</g>`, which silently mislabels every
 * sibling that follows. Each group is instead matched to its real closing tag
 * and the scan jumps past the whole subtree.
 */
export function eachDirectGroup(xml) {
  const out = [];
  const re = /<g\b([^>]*)>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const groupAttrs = attrs(m[1]);
    const bodyStart = m.index + m[0].length;
    const close = matchingCloseG(xml, bodyStart);
    if (close === -1) throw new Error(`unbalanced <g id="${groupAttrs.id}">`);
    out.push({ attrs: groupAttrs, body: xml.slice(bodyStart, close) });
    re.lastIndex = close;
  }
  return out;
}

/* ---------------------------- path geometry ------------------------------ */

/**
 * Pull every coordinate pair out of an SVG path `d`.
 *
 * Only the commands the master actually uses are supported (M, L, Q, Z);
 * anything else throws rather than being silently mis-measured. Quadratic
 * control points are included, which makes the result a safe over-estimate of
 * the true bounding box.
 */
export function pathPoints(d) {
  const points = [];
  const tokenRe = /([MLQZmlqz])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/g;
  const tokens = [];
  let m;
  while ((m = tokenRe.exec(d)) !== null) tokens.push(m[1] !== undefined ? m[1] : m[2]);

  let i = 0;
  let cmd = null;
  while (i < tokens.length) {
    if (/^[MLQZmlqz]$/.test(tokens[i])) {
      cmd = tokens[i];
      i += 1;
    }
    if (cmd === null) throw new Error(`path data starts with a number: ${d}`);
    if (cmd === 'Z' || cmd === 'z') continue; // Z takes no arguments
    if (cmd === 'Q' || cmd === 'q') {
      points.push([Number(tokens[i]), Number(tokens[i + 1])]);
      points.push([Number(tokens[i + 2]), Number(tokens[i + 3])]);
      i += 4;
    } else {
      points.push([Number(tokens[i]), Number(tokens[i + 1])]);
      i += 2;
    }
  }
  return points;
}

export function boundingBox(layers) {
  const box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (const layer of layers) {
    for (const [x, y] of pathPoints(layer.d)) {
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        throw new Error(`non-finite coordinate in layer "${layer.id}"`);
      }
      box.minX = Math.min(box.minX, x);
      box.minY = Math.min(box.minY, y);
      box.maxX = Math.max(box.maxX, x);
      box.maxY = Math.max(box.maxY, y);
    }
  }
  if (box.minX === Infinity) throw new Error('no coordinates found');
  box.width = round(box.maxX - box.minX);
  box.height = round(box.maxY - box.minY);
  box.centerX = round((box.minX + box.maxX) / 2);
  box.centerY = round((box.minY + box.maxY) / 2);
  return box;
}

function round(n) {
  return Math.round(n * 100) / 100;
}

/* ------------------------------- the parse ------------------------------- */

/**
 * Parse the master SVG into the plain-data shape the component consumes.
 * Attribute values are kept verbatim (`url(#edge)`, `#333D43`) so the emitted
 * module stays directly comparable to the master's XML.
 */
export function parseMaster(xml) {
  const root = /<svg\b([^>]*)>/.exec(xml);
  if (!root) throw new Error('no <svg> root element');
  const rootAttrs = attrs(root[1]);

  const viewBox = rootAttrs.viewBox;
  if (!viewBox) throw new Error('<svg> has no viewBox');
  const [vx, vy, vw, vh] = viewBox.split(/[\s,]+/).map(Number);
  if ([vx, vy, vw, vh].some((n) => !Number.isFinite(n))) {
    throw new Error(`unparseable viewBox "${viewBox}"`);
  }

  // fill="none" on the root is what lets stroke-only paths omit a fill
  // attribute. The parser relies on it, so assert it rather than assume it.
  const inheritedFill = rootAttrs.fill ?? 'none';
  if (inheritedFill !== 'none') {
    throw new Error(
      `expected root fill="none" (stroke-only paths inherit it), got "${inheritedFill}"`
    );
  }

  const gradients = eachBlock(xml, 'linearGradient').map((b) => {
    if (!b.attrs.id) throw new Error('<linearGradient> without id');
    return {
      id: b.attrs.id,
      x1: Number(b.attrs.x1),
      y1: Number(b.attrs.y1),
      x2: Number(b.attrs.x2),
      y2: Number(b.attrs.y2),
      stops: eachOpeningTag(b.body, 'stop').map((s) => ({
        offset: s.offset === undefined ? 0 : Number(s.offset),
        color: s['stop-color'],
      })),
    };
  });

  const backgroundRects = eachOpeningTag(xml, 'rect').map((r) => {
    if (!r.id) throw new Error('<rect> without id');
    const out = {
      id: r.id,
      x: Number(r.x),
      y: Number(r.y),
      width: Number(r.width),
      height: Number(r.height),
      rx: Number(r.rx),
    };
    if (r.fill !== undefined) out.fill = r.fill;
    else out.fill = 'none';
    if (r.stroke !== undefined) out.stroke = r.stroke;
    if (r['stroke-width'] !== undefined) out.strokeWidth = Number(r['stroke-width']);
    return out;
  });

  const symbolLayers = [];
  const symbolXml = extractGroup(xml, 'Silver-symbol');
  for (const g of eachDirectGroup(groupBody(symbolXml))) {
    const groupId = g.attrs.id;
    if (!groupId) throw new Error('symbol sub-group without id');
    if (UNPORTABLE_GROUPS.includes(groupId)) continue;

    for (const p of eachOpeningTag(g.body, 'path')) {
      if (!p.id) throw new Error(`unnamed <path> in group "${groupId}"`);
      if (!p.d) throw new Error(`path "${p.id}" has no d`);
      const layer = { id: p.id, group: groupId, d: p.d };
      // Fill: explicit, else inherited from the root <svg fill="none">.
      layer.fill = p.fill ?? 'none';
      if (p.stroke !== undefined) layer.stroke = p.stroke;
      if (p['stroke-width'] !== undefined) layer.strokeWidth = Number(p['stroke-width']);
      if (p['stroke-opacity'] !== undefined) layer.strokeOpacity = Number(p['stroke-opacity']);
      if (p['stroke-linejoin'] !== undefined) layer.strokeLinejoin = p['stroke-linejoin'];
      symbolLayers.push(layer);
    }
  }

  if (symbolLayers.length === 0) throw new Error('no portable symbol layers found');

  const bbox = boundingBox(symbolLayers);

  return {
    viewBox,
    viewBoxRect: { x: vx, y: vy, width: vw, height: vh },
    gradients,
    backgroundRects,
    symbolLayers,
    symbolBbox: bbox,
  };
}

/**
 * Transform that scales the symbol up for the `small` variant.
 *
 * Anchored on the viewBox centre rather than the symbol's own bbox centre:
 * at 32px what matters is that the mark stays optically centred in the tile,
 * and the viewBox centre is a stable definition that cannot shift when the
 * artwork is nudged.
 */
export function smallTransform(parsed, scale = SMALL_SCALE) {
  const { x, y, width, height } = parsed.viewBoxRect;
  const cx = round(x + width / 2);
  const cy = round(y + height / 2);
  return `translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`;
}

/* ------------------------------- emit ------------------------------------ */

const HEADER = `/**
 * GENERATED FILE - DO NOT EDIT.
 *
 * Source of truth: assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg
 * Regenerate with: node scripts/logo-geometry.mjs
 *
 * tests/logo-geometry.test.mjs fails if this file is out of date.
 */
`;

const TYPES = `
export interface GradientStop {
  offset: number;
  color: string;
}

export interface GradientDef {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stops: GradientStop[];
}

export interface SymbolLayer {
  id: string;
  group: string;
  d: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
}

export interface BackgroundRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}
`;

/** Stable, readable JSON with a 2-space indent - valid JSON, so it parses. */
const toJson = (value) => JSON.stringify(value, null, 2).split('\n').join('\n');

export function renderGeometryModule(parsed) {
  const { viewBox, gradients, backgroundRects, symbolLayers, symbolBbox, viewBoxRect } = parsed;

  return `${HEADER}${TYPES}
/**
 * The master works in a non-origin coordinate space (content spans
 * x ${viewBoxRect.x}..${round(viewBoxRect.x + viewBoxRect.width)}, y ${viewBoxRect.y}..${round(viewBoxRect.y + viewBoxRect.height)}).
 * Keeping the same viewBox here - rather than rebasing to "0 0 1024 1024" -
 * means every path below is byte-identical to the master, which is what makes
 * the drift check meaningful.
 */
export const MASTER_VIEWBOX = '${viewBox}';

/** Symbol ink extent in master units, excluding decorative brushed metal. */
export const SYMBOL_BBOX = ${toJson(symbolBbox)};

/** How much the \`small\` variant scales the symbol up for tiny sizes. */
export const SMALL_SCALE = ${SMALL_SCALE};

/** Scale the symbol up about the viewBox centre, for 32-64px renders. */
export const SMALL_TRANSFORM = '${smallTransform(parsed)}';

/** All master gradients, gradientUnits="userSpaceOnUse". */
export const GRADIENTS: GradientDef[] = ${toJson(gradients)};

/** The dark tile and its hairline inner highlight. */
export const BACKGROUND_RECTS: BackgroundRect[] = ${toJson(backgroundRects)};

/**
 * The symbol paths in master document order. \`fill\` / \`stroke\` hold the
 * master's raw attribute values verbatim: a gradient reference stays
 * \`url(#edge)\` and is resolved to a per-instance id at render time.
 */
export const SYMBOL_LAYERS: SymbolLayer[] = ${toJson(symbolLayers)};
`;
}

export function regenerate(write = false) {
  const xml = readFileSync(MASTER_SVG_PATH, 'utf8');
  const parsed = parseMaster(xml);
  const next = renderGeometryModule(parsed);
  if (write) writeFileSync(GENERATED_TS_PATH, next, 'utf8');
  return { parsed, next };
}

/* --------------------------------- CLI ----------------------------------- */

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const checkOnly = process.argv.includes('--check');
  const { parsed, next } = regenerate(false);

  let current = null;
  try {
    current = readFileSync(GENERATED_TS_PATH, 'utf8');
  } catch {
    current = null;
  }

  if (checkOnly) {
    if (current === next) {
      console.log('logo geometry is up to date');
      process.exit(0);
    }
    console.error(
      'logo geometry is STALE - run: node scripts/logo-geometry.mjs\n' +
        `  expected: ${GENERATED_TS_PATH} to match assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg`
    );
    if (current === null) console.error('  (generated file does not exist yet)');
    process.exit(1);
  }

  writeFileSync(GENERATED_TS_PATH, next, 'utf8');
  const b = parsed.symbolBbox;
  const pctW = Math.round((b.width / parsed.viewBoxRect.width) * 100);
  const pctH = Math.round((b.height / parsed.viewBoxRect.height) * 100);
  console.log(`wrote ${GENERATED_TS_PATH.replace(repoRoot, '.')}`);
  console.log(
    `  viewBox ${parsed.viewBox}\n` +
      `  gradients ${parsed.gradients.length}  rects ${parsed.backgroundRects.length}  layers ${parsed.symbolLayers.length}\n` +
      `  symbol bbox ${b.width} x ${b.height} -> ${pctW}% width, ${pctH}% height of canvas`
  );
}
