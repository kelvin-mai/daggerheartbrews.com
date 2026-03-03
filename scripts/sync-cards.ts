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
    'reference',
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
    'reference',
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
// Classes & Subclasses
// ---------------------------------------------------------------------------

type ParsedClassFeature = { name: string; description: string; extra?: string };

const NAMED_BULLET_RE = /^_(.+?):_\s*(.*)/;

const renderBulletItem = (text: string): string => {
  const m = text.match(NAMED_BULLET_RE);
  if (m)
    return `<li><strong><em>${stripMd(m[1])}: </em></strong>${stripMd(m[2])}</li>`;
  return `<li>${stripMd(text)}</li>`;
};

const buildClassFeature = (
  name: string,
  rawLines: string[],
): ParsedClassFeature => {
  const lines = rawLines.filter((l) => !l.trimStart().startsWith('> '));
  const raw = lines.join('\n').trim();
  const segments = raw
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const descParts: string[] = [];
  const extraParts: string[] = [];
  let inExtra = false;

  for (const seg of segments) {
    const segLines = seg.split('\n');
    const bulletLines = segLines.filter((l) => l.trim().startsWith('- '));
    const isBulletBlock =
      bulletLines.length > 0 &&
      bulletLines.length === segLines.filter((l) => l.trim()).length;

    if (isBulletBlock) {
      inExtra = true;
      const items = bulletLines
        .map((l) => `        ${renderBulletItem(l.trim().slice(2))}`)
        .join('\n');
      extraParts.push(
        `<ul class="list-disc list-outside pl-4">\n${items}\n        </ul>`,
      );
    } else if (inExtra) {
      extraParts.push(`<p>${stripMd(seg)}</p>`);
    } else {
      descParts.push(seg);
    }
  }

  const description = stripMd(descParts.join(' '));
  const extra =
    extraParts.length > 0
      ? '\n        ' + extraParts.join('\n        ') + '\n        '
      : undefined;

  return { name, description, ...(extra !== undefined ? { extra } : {}) };
};

const CLASS_FEATURE_SECTIONS = new Set([
  'HOPE FEATURE',
  'CLASS FEATURE',
  'CLASS FEATURES',
]);

const parseClassFeatures = (lines: string[]): ParsedClassFeature[] => {
  const features: ParsedClassFeature[] = [];
  let inSection = false;
  let currentName = '';
  let currentLines: string[] = [];

  const flush = () => {
    if (!currentName) return;
    features.push(buildClassFeature(currentName, currentLines));
    currentName = '';
    currentLines = [];
  };

  for (const line of lines) {
    if (line.startsWith('### ')) {
      const heading = line.slice(4).trim();
      if (CLASS_FEATURE_SECTIONS.has(heading)) {
        inSection = true;
      } else {
        flush();
        inSection = false;
      }
      continue;
    }
    if (!inSection) continue;
    const m = line.match(CARD_FEATURE_RE);
    if (m) {
      flush();
      currentName = m[1].trim();
      if (m[2].trim()) currentLines = [m[2].trim()];
    } else if (currentName) {
      currentLines.push(line);
    }
  }
  flush();
  return features;
};

const parseBulletSection = (lines: string[], heading: string): string[] => {
  const idx = lines.findIndex((l) => l.trim() === `### ${heading}`);
  if (idx < 0) return [];
  const end = lines.findIndex((l, i) => i > idx && l.startsWith('### '));
  const slice = end >= 0 ? lines.slice(idx + 1, end) : lines.slice(idx + 1);
  return slice
    .filter((l) => l.trim().startsWith('- '))
    .map((l) => stripMd(l.trim().slice(2)));
};

const parseSubclassNames = (lines: string[]): string[] => {
  const idx = lines.findIndex((l) => l.trim() === '### SUBCLASSES');
  if (idx < 0) return [];
  const end = lines.findIndex((l, i) => i > idx && l.startsWith('### '));
  const slice = end >= 0 ? lines.slice(idx + 1, end) : lines.slice(idx + 1);
  const names: string[] = [];
  for (const line of slice) {
    for (const m of line.matchAll(/\[([^\]]+)\]\([^)]+\)/g)) names.push(m[1]);
  }
  return names;
};

const SUBCLASS_TIER_SECTIONS: Record<
  string,
  'foundation' | 'specialization' | 'mastery'
> = {
  'FOUNDATION FEATURE': 'foundation',
  'FOUNDATION FEATURES': 'foundation',
  'SPECIALIZATION FEATURE': 'specialization',
  'SPECIALIZATION FEATURES': 'specialization',
  'MASTERY FEATURE': 'mastery',
  'MASTERY FEATURES': 'mastery',
};

type ParsedSubclass = {
  name: string;
  description: string;
  trait?: string;
  foundation: ParsedClassFeature[];
  specialization: ParsedClassFeature[];
  mastery: ParsedClassFeature[];
};

const parseSubclassFile = (filepath: string): ParsedSubclass => {
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');
  const name =
    lines
      .find((l) => l.startsWith('# '))
      ?.slice(2)
      .trim() ?? '';

  const firstSection = lines.findIndex((l) => l.startsWith('### '));
  const descLines = (
    firstSection >= 0 ? lines.slice(0, firstSection) : lines
  ).filter((l) => l.trim() && !l.startsWith('#'));
  const description = stripMd(descLines[0]?.trim() ?? '');

  const traitIdx = lines.findIndex((l) => l.trim() === '### SPELLCAST TRAIT');
  let trait: string | undefined;
  if (traitIdx >= 0) {
    const traitLine = lines.slice(traitIdx + 1).find((l) => l.trim());
    if (traitLine) trait = traitLine.trim().toLowerCase();
  }

  const foundation: ParsedClassFeature[] = [];
  const specialization: ParsedClassFeature[] = [];
  const mastery: ParsedClassFeature[] = [];

  let currentTier: 'foundation' | 'specialization' | 'mastery' | null = null;
  let currentName = '';
  let currentLines: string[] = [];

  const flushFeature = () => {
    if (!currentName || !currentTier) return;
    const target =
      currentTier === 'foundation'
        ? foundation
        : currentTier === 'specialization'
          ? specialization
          : mastery;
    target.push(buildClassFeature(currentName, currentLines));
    currentName = '';
    currentLines = [];
  };

  for (const line of lines) {
    if (line.startsWith('### ')) {
      flushFeature();
      currentTier = SUBCLASS_TIER_SECTIONS[line.slice(4).trim()] ?? null;
      continue;
    }
    if (!currentTier) continue;
    const m = line.match(CARD_FEATURE_RE);
    if (m) {
      flushFeature();
      currentName = m[1].trim();
      if (m[2].trim()) currentLines = [m[2].trim()];
    } else if (currentName) {
      currentLines.push(line);
    }
  }
  flushFeature();

  return {
    name,
    description,
    ...(trait !== undefined ? { trait } : {}),
    foundation,
    specialization,
    mastery,
  };
};

type ParsedClass = {
  name: string;
  flavor: string;
  domains: [string, string];
  startEvasion: number;
  startHp: number;
  items: string;
  features: ParsedClassFeature[];
  questions: string[];
  connections: string[];
  subclasses: ParsedSubclass[];
};

const parseClassFile = (filepath: string, subclassDir: string): ParsedClass => {
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');
  const name = (
    lines
      .find((l) => l.startsWith('# '))
      ?.slice(2)
      .trim() ?? ''
  ).toLowerCase();

  const firstSection = lines.findIndex((l) => l.startsWith('---'));
  const flavorLines = (
    firstSection >= 0 ? lines.slice(0, firstSection) : lines
  ).filter((l) => l.trim() && !l.startsWith('#'));
  const flavor = stripMd(flavorLines[0]?.trim() ?? '');

  const domainLine = lines.find((l) => l.includes('**DOMAINS -**')) ?? '';
  const domainMatches = [...domainLine.matchAll(/\[([^\]]+)\]/g)];
  const domains: [string, string] = [
    domainMatches[0]?.[1]?.toLowerCase() ?? '',
    domainMatches[1]?.[1]?.toLowerCase() ?? '',
  ];

  const evasionLine =
    lines.find((l) => l.includes('**STARTING EVASION -**')) ?? '';
  const startEvasion = parseInt(
    evasionLine.match(/\*\*STARTING EVASION -\*\* (\d+)/)?.[1] ?? '0',
  );

  const hpLine =
    lines.find((l) => l.includes('**STARTING HIT POINTS -**')) ?? '';
  const startHp = parseInt(
    hpLine.match(/\*\*STARTING HIT POINTS -\*\* (\d+)/)?.[1] ?? '0',
  );

  const itemLine = lines.find((l) => l.includes('**CLASS ITEMS -**')) ?? '';
  const items = stripMd(
    itemLine.replace(/.*\*\*CLASS ITEMS -\*\*\s*/, '').trim(),
  );

  const features = parseClassFeatures(lines);
  const questions = parseBulletSection(lines, 'BACKGROUND QUESTIONS');
  const connections = parseBulletSection(lines, 'CONNECTIONS');
  const subclassNames = parseSubclassNames(lines);
  const subclasses = subclassNames.map((subName) =>
    parseSubclassFile(path.join(subclassDir, `${subName}.md`)),
  );

  return {
    name,
    flavor,
    domains,
    startEvasion,
    startHp,
    items,
    features,
    questions,
    connections,
    subclasses,
  };
};

// ---------------------------------------------------------------------------
// Class rendering
// ---------------------------------------------------------------------------

const SUBCLASS_ARTISTS: Record<string, string> = {
  troubadour: 'Bear Frymire',
  wordsmith: 'Nikki Dawes',
  'warden-of-the-elements': 'Zoe Badini',
  'warden-of-renewal': 'Ilya Royz',
  stalwart: 'Reiko Murakami',
  vengeance: 'Linda Lithén',
  beastbound: 'Jenny Tan',
  wayfinder: 'Simon Pape',
  nightwalker: 'Juan Salvador Almencion',
  syndicate: 'Jenny Tan',
  'divine-wielder': 'Jenny Tan',
  'winged-sentinel': 'Stephanie Cost',
  'elemental-origin': 'Bear Frymire',
  'primal-origin': 'Laura Galli',
  'call-of-the-brave': 'Mat Wilma',
  'call-of-the-slayer': 'Reiko Murakami',
  'school-of-knowledge': 'Bear Frymire',
  'school-of-war': 'Nikki Dawes',
};

const renderClassFeature = (
  f: ParsedClassFeature,
  indent = '      ',
): string => {
  const lines = [
    `${indent}{`,
    `${indent}  name: '${esc(f.name)}',`,
    `${indent}  description: '${esc(f.description)}',`,
  ];
  if (f.extra !== undefined) {
    const escaped = f.extra.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    lines.push(`${indent}  extra: \`${escaped}\`,`);
  }
  lines.push(`${indent}},`);
  return lines.join('\n');
};

const renderSubclassEntry = (sc: ParsedSubclass, className: string): string => {
  const slug = sc.name.toLowerCase().replace(/\s+/g, '-');
  const image = `${className}-${slug}.jpg`;
  const artist = SUBCLASS_ARTISTS[slug] ?? '';

  const lines = [
    `  {`,
    `    className: '${esc(className)}',`,
    `    name: '${esc(sc.name)}',`,
    `    description: '${esc(sc.description)}',`,
    `    image: '${image}',`,
    `    artist: '${esc(artist)}',`,
  ];
  if (sc.trait !== undefined) lines.push(`    trait: '${esc(sc.trait)}',`);

  lines.push(`    foundation: [`);
  for (const f of sc.foundation) lines.push(renderClassFeature(f, '      '));
  lines.push(`    ],`);

  lines.push(`    specialization: [`);
  for (const f of sc.specialization)
    lines.push(renderClassFeature(f, '      '));
  lines.push(`    ],`);

  lines.push(`    mastery: [`);
  for (const f of sc.mastery) lines.push(renderClassFeature(f, '      '));
  lines.push(`    ],`);

  lines.push(`  },`);
  return lines.join('\n');
};

const renderClass = (cl: ParsedClass): string => {
  const lines = [
    `  {`,
    `    name: '${esc(cl.name)}',`,
    `    flavor: '${esc(cl.flavor)}',`,
    `    domains: ['${esc(cl.domains[0])}', '${esc(cl.domains[1])}'],`,
    `    startEvasion: ${cl.startEvasion},`,
    `    startHp: ${cl.startHp},`,
    `    items: '${esc(cl.items)}',`,
    `    features: [`,
  ];
  for (const f of cl.features) lines.push(renderClassFeature(f));
  lines.push(`    ],`);

  lines.push(`    questions: [`);
  for (const q of cl.questions) lines.push(`      '${esc(q)}',`);
  lines.push(`    ],`);

  lines.push(`    connections: [`);
  for (const c of cl.connections) lines.push(`      '${esc(c)}',`);
  lines.push(`    ],`);

  lines.push(
    `    subclasses: [${cl.subclasses.map((sc) => `'${esc(sc.name)}'`).join(', ')}],`,
  );

  lines.push(`  },`);
  return lines.join('\n');
};

const CLASSES_HEADER = `import type { ClassReference } from '../types';

export const classes: ClassReference[] = [`;

const SUBCLASSES_HEADER = `import type { SubclassReference } from '../types';

export const subclasses: SubclassReference[] = [`;

const syncClasses = () => {
  const classDir = path.join(ROOT, 'srd-source', 'classes');
  const subclassDir = path.join(ROOT, 'srd-source', 'subclasses');
  const classOut = path.join(
    ROOT,
    'src',
    'lib',
    'constants',
    'reference',
    'srd',
    'classes.tsx',
  );
  const subclassOut = path.join(
    ROOT,
    'src',
    'lib',
    'constants',
    'reference',
    'srd',
    'subclasses.ts',
  );

  const items = fs
    .readdirSync(classDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseClassFile(path.join(classDir, f), subclassDir))
    .sort((a, b) => a.name.localeCompare(b.name));

  const classBody = items.map(renderClass).join('\n');
  fs.writeFileSync(classOut, [CLASSES_HEADER, classBody, `];`, ``].join('\n'));
  console.log(
    `Synced ${items.length} classes → ${path.relative(ROOT, classOut)}`,
  );

  const subclassBody = items
    .flatMap((cl) =>
      cl.subclasses.map((sc) => renderSubclassEntry(sc, cl.name)),
    )
    .join('\n');
  fs.writeFileSync(
    subclassOut,
    [SUBCLASSES_HEADER, subclassBody, `];`, ``].join('\n'),
  );
  const subclassCount = items.reduce((n, cl) => n + cl.subclasses.length, 0);
  console.log(
    `Synced ${subclassCount} subclasses → ${path.relative(ROOT, subclassOut)}`,
  );
};

// ---------------------------------------------------------------------------
// Equipment - shared helpers
// ---------------------------------------------------------------------------

const DAMAGE_TYPE_LABELS: Record<string, string> = {
  phy: 'physical',
  mag: 'magical',
};

const parseEquipmentFeature = (lines: string[]): string | undefined => {
  const featIdx = lines.findIndex((l) => l.trim() === '### FEATURE');
  if (featIdx < 0) return undefined;
  let fname = '';
  let fdesc: string[] = [];
  for (const line of lines.slice(featIdx + 1)) {
    const m = line.match(CARD_FEATURE_RE);
    if (m) {
      fname = m[1].trim();
      if (m[2].trim()) fdesc = [m[2].trim()];
    } else if (fname && line.trim()) {
      fdesc.push(line.trim());
    }
  }
  if (!fname) return undefined;
  return `<p><strong><em>${escBt(fname)}:</em></strong> ${escBt(stripMd(fdesc.join(' ')))}</p>`;
};

// ---------------------------------------------------------------------------
// Equipment - Armor
// ---------------------------------------------------------------------------

type ParsedArmor = {
  name: string;
  tier: number;
  thresholds: [number, number];
  score: number;
  feature?: string;
};

const parseArmorFile = (filepath: string): ParsedArmor => {
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');
  const name =
    lines
      .find((l) => l.startsWith('# '))
      ?.slice(2)
      .trim() ?? '';
  const tier = parseInt(
    lines.find((l) => /^\*\*_Tier \d/.test(l))?.match(/Tier (\d+)/)?.[1] ?? '1',
  );
  const threshLine = lines.find((l) => l.includes('Base Thresholds:')) ?? '';
  const threshMatch = threshLine.match(/(\d+)\s*\/\s*(\d+)/);
  const thresholds: [number, number] = threshMatch
    ? [parseInt(threshMatch[1]), parseInt(threshMatch[2])]
    : [0, 0];
  const scoreLine = lines.find((l) => l.includes('Base Score:')) ?? '';
  const score = parseInt(
    scoreLine.match(/Base Score:\*\*\s*(\d+)/)?.[1] ?? '0',
  );
  const feature = parseEquipmentFeature(lines);
  return {
    name,
    tier,
    thresholds,
    score,
    ...(feature !== undefined ? { feature } : {}),
  };
};

const renderArmor = (a: ParsedArmor): string => {
  const lines = [
    `  {`,
    `    type: 'equipment',`,
    `    name: '${esc(a.name)}',`,
    `    subtype: 'Armor',`,
    `    tier: ${a.tier},`,
    `    tierEnabled: true,`,
    `    thresholds: [${a.thresholds[0]}, ${a.thresholds[1]}],`,
    `    thresholdsEnabled: true,`,
    `    armor: ${a.score},`,
    `    armorEnabled: true,`,
  ];
  if (a.feature !== undefined) lines.push(`    text: \`${a.feature}\`,`);
  lines.push(`    credits: '${CREDITS}',`, `  },`);
  return lines.join('\n');
};

const syncArmor = () => {
  const dir = path.join(ROOT, 'srd-source', 'armor');
  const out = path.join(
    ROOT,
    'src',
    'lib',
    'constants',
    'reference',
    'srd',
    'armor.ts',
  );
  const items = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseArmorFile(path.join(dir, f)))
    .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
  const body = items.map(renderArmor).join('\n');
  const output = [
    `import type { CardDetails } from '@/lib/types';`,
    ``,
    `export const armor: CardDetails[] = [`,
    body,
    `];`,
    ``,
  ].join('\n');
  fs.writeFileSync(out, output);
  console.log(`Synced ${items.length} armor → ${path.relative(ROOT, out)}`);
};

// ---------------------------------------------------------------------------
// Equipment - Weapons
// ---------------------------------------------------------------------------

type ParsedWeapon = {
  name: string;
  tier: number;
  role: string;
  damageKind: string;
  trait: string;
  range: string;
  damage: string;
  hands: 1 | 2;
  feature?: string;
};

const parseWeaponFile = (filepath: string): ParsedWeapon => {
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');
  const name =
    lines
      .find((l) => l.startsWith('# '))
      ?.slice(2)
      .trim() ?? '';
  const headerLine = lines.find((l) => /^\*\*_Tier \d/.test(l)) ?? '';
  const tier = parseInt(headerLine.match(/Tier (\d+)/)?.[1] ?? '1');
  const role = /Primary/.test(headerLine) ? 'Primary' : 'Secondary';
  const damageKind = /Magical/.test(headerLine) ? 'Magical' : 'Physical';

  const getBullet = (label: string) =>
    (lines.find((l) => l.includes(`**${label}:**`)) ?? '')
      .replace(`- **${label}:**`, '')
      .trim();

  const trait = getBullet('Trait');
  const range = getBullet('Range');
  const burdenRaw = getBullet('Burden');
  const hands = burdenRaw === 'Two-Handed' ? 2 : 1;

  const damageRaw = getBullet('Damage');
  const damageParts = damageRaw.split(/\s+/);
  const typeKey = damageParts[damageParts.length - 1];
  const amount = damageParts.slice(0, -1).join(' ');
  const damage = `${amount} ${DAMAGE_TYPE_LABELS[typeKey] ?? typeKey}`;

  const feature = parseEquipmentFeature(lines);
  return {
    name,
    tier,
    role,
    damageKind,
    trait,
    range,
    damage,
    hands,
    ...(feature !== undefined ? { feature } : {}),
  };
};

const renderWeapon = (w: ParsedWeapon): string => {
  const subtype = `${w.role} ${w.damageKind} Weapon`;
  const statsLine = `<p><strong>Trait:</strong> ${escBt(w.trait)} | <strong>Range:</strong> ${escBt(w.range)} | <strong>Damage:</strong> ${escBt(w.damage)}</p>`;
  const text =
    w.feature !== undefined ? `${statsLine}\n${w.feature}` : statsLine;
  return [
    `  {`,
    `    type: 'equipment',`,
    `    name: '${esc(w.name)}',`,
    `    subtype: '${esc(subtype)}',`,
    `    tier: ${w.tier},`,
    `    tierEnabled: true,`,
    `    hands: ${w.hands},`,
    `    handsEnabled: true,`,
    `    text: \`${escBt(text)}\`,`,
    `    credits: '${CREDITS}',`,
    `  },`,
  ].join('\n');
};

const syncWeapons = () => {
  const dir = path.join(ROOT, 'srd-source', 'weapons');
  const out = path.join(
    ROOT,
    'src',
    'lib',
    'constants',
    'reference',
    'srd',
    'weapons.ts',
  );
  const items = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseWeaponFile(path.join(dir, f)))
    .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));
  const body = items.map(renderWeapon).join('\n');
  const output = [
    `import type { CardDetails } from '@/lib/types';`,
    ``,
    `export const weapons: CardDetails[] = [`,
    body,
    `];`,
    ``,
  ].join('\n');
  fs.writeFileSync(out, output);
  console.log(`Synced ${items.length} weapons → ${path.relative(ROOT, out)}`);
};

// ---------------------------------------------------------------------------
// Equipment - Consumables & Items
// ---------------------------------------------------------------------------

type ParsedSimpleEquipment = {
  name: string;
  description: string;
};

const parseSimpleEquipmentFile = (filepath: string): ParsedSimpleEquipment => {
  const lines = fs
    .readFileSync(filepath, 'utf-8')
    .replace(/^\uFEFF/, '')
    .split('\n');
  const name =
    lines
      .find((l) => l.startsWith('# '))
      ?.slice(2)
      .trim() ?? '';
  const description = stripMd(
    lines
      .filter(
        (l) =>
          l.trim() &&
          !l.startsWith('#') &&
          !/^\*+_?[A-Za-z\s]+_?\*+$/.test(l.trim()),
      )
      .join(' ')
      .trim(),
  );
  return { name, description };
};

const renderSimpleEquipment = (
  item: ParsedSimpleEquipment,
  subtype: string,
): string =>
  [
    `  {`,
    `    type: 'equipment',`,
    `    name: '${esc(item.name)}',`,
    `    subtype: '${subtype}',`,
    `    text: \`<p>${escBt(item.description)}</p>\`,`,
    `    credits: '${CREDITS}',`,
    `  },`,
  ].join('\n');

const syncSimpleEquipment = (
  sourceDir: string,
  outFile: string,
  exportName: string,
  subtype: string,
) => {
  const dir = path.join(ROOT, 'srd-source', sourceDir);
  const out = path.join(
    ROOT,
    'src',
    'lib',
    'constants',
    'reference',
    'srd',
    outFile,
  );
  const items = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseSimpleEquipmentFile(path.join(dir, f)))
    .sort((a, b) => a.name.localeCompare(b.name));
  const body = items
    .map((item) => renderSimpleEquipment(item, subtype))
    .join('\n');
  const output = [
    `import type { CardDetails } from '@/lib/types';`,
    ``,
    `export const ${exportName}: CardDetails[] = [`,
    body,
    `];`,
    ``,
  ].join('\n');
  fs.writeFileSync(out, output);
  console.log(
    `Synced ${items.length} ${exportName} → ${path.relative(ROOT, out)}`,
  );
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const TARGETS: Record<string, () => void> = {
  ancestries: syncAncestries,
  communities: syncCommunities,
  classes: syncClasses,
  armor: syncArmor,
  weapons: syncWeapons,
  consumables: () =>
    syncSimpleEquipment(
      'consumables',
      'consumables.ts',
      'consumables',
      'Consumable',
    ),
  items: () => syncSimpleEquipment('items', 'items.ts', 'items', 'Item'),
};

const target = process.argv[2];

if (!target) {
  console.log(`Usage: tsx scripts/sync-cards.ts <type>

Types:
  ancestries    Sync ancestry card data
  communities   Sync community card data
  classes       Sync class and subclass data
  armor         Sync armor card data
  weapons       Sync weapon card data
  consumables   Sync consumable card data
  items         Sync item card data`);
  process.exit(0);
}

if (!(target in TARGETS)) {
  console.error(`Unknown type: ${target}`);
  console.error(`Valid types: ${Object.keys(TARGETS).join(', ')}`);
  process.exit(1);
}

TARGETS[target]();
