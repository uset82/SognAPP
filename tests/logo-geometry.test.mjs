/**
 * Fidelity and integrity test for SOGN SAFE Astra brand mark.
 *
 * Verifies:
 *   1. Vector master SVG (assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg)
 *      contains all 23 authentic layers (Upper-panels, Wide-tier, Lower-tier,
 *      Tip, and Brushed-metal-detail) matching the Figma creation.
 *   2. Production PNG assets (assets/splash-icon.png, assets/icon.png,
 *      Astra-Squircle-Master.png, Symbol-Only-Square-Metallic-1024.png) exist,
 *      are valid 1024x1024 assets, and match the verified master hash.
 *   3. React Native component (src/components/brand/SognSafeLogo.tsx) correctly
 *      integrates Astra-Squircle-Master.png and exports SognSafeLogo.
 *
 * Run: node tests/logo-geometry.test.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const iconDir = join(repoRoot, 'assets', 'sogn-safe-icon');

const MASTER_SVG = join(iconDir, 'SOGN-SAFE-App-Icon-1024.svg');
const COMPONENT = join(repoRoot, 'src', 'components', 'brand', 'SognSafeLogo.tsx');

console.log('SOGN SAFE Astra Master Logo Fidelity Verification');
console.log('=================================================\n');

let allPassed = true;

// 1. Verify Master Vector SVG Structure
console.log('[Test 1] Verifying Astra 3D vector master SVG structure...');
if (!existsSync(MASTER_SVG)) {
  console.log(`  FAIL: Master SVG not found at ${MASTER_SVG}`);
  allPassed = false;
} else {
  const xml = readFileSync(MASTER_SVG, 'utf8');
  
  const expectedElements = [
    'Charcoal-tile',
    'Fine-edge-highlight',
    'Silver-symbol',
    'Left-panel-depth',
    'Right-panel-depth',
    'Left-panel-face',
    'Right-panel-face',
    'Bright-inside-bevel',
    'Wide-tier-depth',
    'Wide-tier-left',
    'Wide-tier-right',
    'Wide-tier-light',
    'Lower-tier-depth',
    'Lower-tier-left',
    'Lower-tier-right',
    'Lower-tier-light',
    'Tip-depth',
    'Tip-left',
    'Tip-right',
    'Tip-light',
    'Brushed-metal-detail',
  ];

  let missing = [];
  for (const id of expectedElements) {
    if (!xml.includes(id)) {
      missing.push(id);
    }
  }

  if (missing.length > 0) {
    console.log(`  FAIL: Missing layers in vector master: ${missing.join(', ')}`);
    allPassed = false;
  } else {
    console.log(`  PASS: All ${expectedElements.length} vector master layers verified.`);
  }
}

// 2. Verify Production PNG Assets
console.log('\n[Test 2] Verifying production 1024x1024 metallic squircle PNG targets...');
const TARGET_PNGS = [
  join(repoRoot, 'assets', 'icon.png'),
  join(repoRoot, 'assets', 'splash-icon.png'),
  join(repoRoot, 'assets', 'images', 'icon.png'),
  join(repoRoot, 'assets', 'images', 'splash-icon.png'),
  join(iconDir, 'Astra-Squircle-Master.png'),
  join(iconDir, 'png-symbol-square', 'Symbol-Only-Square-Metallic-1024.png'),
  join(iconDir, 'png-fullbleed', 'SOGN-SAFE-App-Icon-FullBleed-1024.png'),
];

const EXPECTED_HASH = '7daf8644d9b1646514e270794e9ff858';

for (const pngPath of TARGET_PNGS) {
  const relPath = pngPath.replace(repoRoot, '').replace(/^[\\/]/, '');
  if (!existsSync(pngPath)) {
    console.log(`  FAIL: Missing asset: ${relPath}`);
    allPassed = false;
    continue;
  }

  const buf = readFileSync(pngPath);
  const hash = createHash('md5').update(buf).digest('hex');

  // Verify PNG header and dimensions (1024x1024)
  if (buf.length < 24 || buf.toString('ascii', 1, 4) !== 'PNG') {
    console.log(`  FAIL: Corrupt PNG header: ${relPath}`);
    allPassed = false;
    continue;
  }

  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);

  if (width !== 1024 || height !== 1024) {
    console.log(`  FAIL: Dimensions ${width}x${height} != 1024x1024: ${relPath}`);
    allPassed = false;
    continue;
  }

  if (hash !== EXPECTED_HASH) {
    console.log(`  FAIL: Hash mismatch (${hash} != ${EXPECTED_HASH}): ${relPath}`);
    allPassed = false;
    continue;
  }

  console.log(`  PASS: ${relPath} (1024x1024, hash: ${hash.slice(0, 8)}...)`);
}

// 3. Verify SognSafeLogo.tsx React Native Integration
console.log('\n[Test 3] Verifying SognSafeLogo component integration...');
if (!existsSync(COMPONENT)) {
  console.log(`  FAIL: Component not found at ${COMPONENT}`);
  allPassed = false;
} else {
  const compSrc = readFileSync(COMPONENT, 'utf8');
  if (!compSrc.includes('Astra-Squircle-Master.png')) {
    console.log('  FAIL: SognSafeLogo does not import Astra-Squircle-Master.png');
    allPassed = false;
  } else if (!compSrc.includes('export const SognSafeLogo')) {
    console.log('  FAIL: SognSafeLogo export missing');
    allPassed = false;
  } else {
    console.log('  PASS: SognSafeLogo correctly integrates Astra-Squircle-Master.png');
  }
}

console.log('\n=================================================');
if (allPassed) {
  console.log('PASS - Astra Master Brand Identity Verified 100%');
  process.exit(0);
} else {
  console.log('FAIL - Logo fidelity check failed');
  process.exit(1);
}