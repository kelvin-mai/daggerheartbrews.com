/**
 * Syncs SRD card data from srd-source/ markdown into TypeScript constants.
 *
 * Usage:
 *   pnpm tsx scripts/sync-cards.ts ancestries
 *   pnpm tsx scripts/sync-cards.ts communities
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CREDITS = 'Daggerheart\u2122 Compatible. Terms at Daggerheart.com';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const stripMd = (text: string): string =>
  text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/_([^_]+)_/g, '$1');

/** Escape for single-quoted TS strings. */
const esc = (s: string): string =>
  s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

/** Escape for template-literal TS strings. */
const escBt = (s: string): string =>
  s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const firstSentence = (text: string): string => {
  const i = text.indexOf('. ');
  return i >= 0 ? text.slice(0, i + 1) : text;
};

// ---------------------------------------------------------------------------
// Feature parsing (card format: **_Name:_** description)
// ---------------------------------------------------------------------------

type ParsedFeature = { name: string; description: string };

const CARD_FEATURE_RE = /^\*\*_(.+?):_\*\*\s*(.*)/;

const parseFeatures = (lines: string[]): ParsedFeature[] => {
  const features: ParsedFeature[] = [];
  let name = '';
  let descParts: string[] = [];

  const flush = () => {
    if (!name) return;
    features.push({ name, description: stripMd(descParts.join(' ').trim()) });
    name = '';
    descParts = [];
  };

  for (const line of lines) {
    const m = line.match(CARD_FEATURE_RE);
    if (m) {
      flush();
      name = m[1].trim();
      if (m[2].trim()) descParts = [m[2].trim()];
    } else if (name && line.trim()) {
      descParts.push(line.trim());
    }
  }
  flush();
  return features;
};

const renderFeatures = (features: ParsedFeature[]): string =>
  features
    .map(
      (f) =>
        `    <p><strong><em>${escBt(f.name)}:</em></strong> ${escBt(f.description)}</p>`,
    )
    .join('\n');

// ---------------------------------------------------------------------------
// Ancestries
// ---------------------------------------------------------------------------

const ANCESTRY_ARTISTS: Record<string, string> = {
  clank: 'Mat Wilma',
  drakona: 'Mat Wilma',
  dwarf: 'Mat Wilma',
  elf: 'Mat Wilma',
  faerie: 'Anthony Jones',
  faun: 'Jessketchin',
  firbolg: 'Anthony Jones',
  fungril: 'Anthony Jones',
  galapa: 'Jessketchin',
  giant: 'Juan Salvador Almencio',
  goblin: 'Anthony Jones',
  halfling: 'Anthony Jones',
  human: 'Fernanda Suarez',
  infernis: 'Fernanda Suarez',
  katari: 'Hendry Iwanaga',
  orc: 'Simon Pape',
  ribbet: 'Leesha Hannigan',
  simiah: 'Jessketchin',
};

type ParsedAncestry = {
  slug: string;
  name: string;
  description: string;
  features: ParsedFeature[];
};

const parseAncestryFile = (filepath: string): ParsedAncestry => {
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');
  const slug = path.basename(filepath, '.md').toLowerCase();
  const name =
    lines
      .find((l) => l.startsWith('# '))
      ?.slice(2)
      .trim() ?? '';

  const featIdx = lines.findIndex((l) => l.trim() === '### ANCESTRY FEATURES');
  const descLines = (featIdx >= 0 ? lines.slice(0, featIdx) : lines).filter(
    (l) => l.trim() && !l.startsWith('#'),
  );
  const description = stripMd(firstSentence(descLines[0]?.trim() ?? ''));
  const features = parseFeatures(featIdx >= 0 ? lines.slice(featIdx + 1) : []);

  return { slug, name, description, features };
};

const renderAncestry = (a: ParsedAncestry): string => {
  const artist = ANCESTRY_ARTISTS[a.slug] ?? '';
  const featureHtml = renderFeatures(a.features);
  return [
    `  {`,
    `    type: 'ancestry',`,
    `    name: '${esc(a.name)}',`,
    `    image: '/assets/images/srd/ancestry/${a.slug}.jpg',`,
    `    text: \``,
    `    <p><em>${escBt(a.description)}</em></p>`,
    featureHtml,
    `  \`,`,
    `    artist: '${esc(artist)}',`,
    `    credits: '${CREDITS}',`,
    `  },`,
  ].join('\n');
};

const syncAncestries = () => {
  const dir = path.join(ROOT, 'srd-source', 'ancestries');
  const out = path.join(
    ROOT,
    'src',
    'lib',
    'constants',
    'srd',
    'ancestries.ts',
  );

  const items = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseAncestryFile(path.join(dir, f)))
    .sort((a, b) => a.name.localeCompare(b.name));

  const body = items.map(renderAncestry).join('\n');
  const output = [
    `import type { CardDetails } from '@/lib/types';`,
    ``,
    `export const ancestries: CardDetails[] = [`,
    body,
    `];`,
    ``,
  ].join('\n');

  fs.writeFileSync(out, output);
  console.log(
    `Synced ${items.length} ancestries → ${path.relative(ROOT, out)}`,
  );
};

// ---------------------------------------------------------------------------
// Communities
// ---------------------------------------------------------------------------

const COMMUNITY_ARTISTS: Record<string, string> = {
  highborne: 'Julia Metzger',
  loreborne: 'Juan Gutierrez',
  orderborne: 'Rafater',
  ridgeborne: 'Daarken',
  seaborne: 'Sam Key',
  slyborne: 'Paul Scott Canavan',
  underborne: 'Irina Nordsol',
  wanderborne: 'Paul Scott Canavan',
  wildborne: 'Andreas Rocha',
};

type ParsedCommunity = {
  slug: string;
  name: string;
  description: string;
  features: ParsedFeature[];
};

const parseCommunitFile = (filepath: string): ParsedCommunity => {
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');
  const slug = path.basename(filepath, '.md').toLowerCase();
  const name =
    lines
      .find((l) => l.startsWith('# '))
      ?.slice(2)
      .trim() ?? '';

  const featIdx = lines.findIndex((l) => l.trim() === '### COMMUNITY FEATURE');
  // Exclude headings and standalone italic lines (characteristics: "_Adj, adj..._")
  const descLines = (featIdx >= 0 ? lines.slice(0, featIdx) : lines).filter(
    (l) => l.trim() && !l.startsWith('#') && !/^_[^_]+_$/.test(l.trim()),
  );
  const description = stripMd(firstSentence(descLines[0]?.trim() ?? ''));
  const features = parseFeatures(featIdx >= 0 ? lines.slice(featIdx + 1) : []);

  return { slug, name, description, features };
};

const renderCommunity = (c: ParsedCommunity): string => {
  const artist = COMMUNITY_ARTISTS[c.slug] ?? '';
  const featureHtml = renderFeatures(c.features);
  return [
    `  {`,
    `    type: 'community',`,
    `    name: '${esc(c.name)}',`,
    `    image: '/assets/images/srd/community/${c.slug}.jpg',`,
    `    text: \``,
    `    <p><em>${escBt(c.description)}</em></p>`,
    featureHtml,
    `  \`,`,
    `    artist: '${esc(artist)}',`,
    `    credits: '${CREDITS}',`,
    `  },`,
  ].join('\n');
};

const syncCommunities = () => {
  const dir = path.join(ROOT, 'srd-source', 'communities');
  const out = path.join(
    ROOT,
    'src',
    'lib',
    'constants',
    'srd',
    'communities.ts',
  );

  const items = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseCommunitFile(path.join(dir, f)))
    .sort((a, b) => a.name.localeCompare(b.name));

  const body = items.map(renderCommunity).join('\n');
  const output = [
    `import type { CardDetails } from '@/lib/types';`,
    ``,
    `export const communities: CardDetails[] = [`,
    body,
    `];`,
    ``,
  ].join('\n');

  fs.writeFileSync(out, output);
  console.log(
    `Synced ${items.length} communities → ${path.relative(ROOT, out)}`,
  );
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const TARGETS: Record<string, () => void> = {
  ancestries: syncAncestries,
  communities: syncCommunities,
};

const target = process.argv[2];

if (!target || !(target in TARGETS)) {
  console.error(
    `Usage: tsx scripts/sync-cards.ts <${Object.keys(TARGETS).join(' | ')}>`,
  );
  process.exit(1);
}

TARGETS[target]();
