/**
 * Syncs SRD reference data from srd-source/ markdown into TypeScript constants.
 *
 * Usage:
 *   pnpm tsx scripts/sync-adversaries.ts environments
 *   pnpm tsx scripts/sync-adversaries.ts adversaries
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

type ParsedFeature = {
  name: string;
  type: string;
  description: string;
  extra?: string;
  flavor?: string;
};

// ---------------------------------------------------------------------------
// Shared markdown helpers
// ---------------------------------------------------------------------------

const stripMd = (text: string): string =>
  text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/_([^_]+)_/g, '$1');

/**
 * Finds the last _..._  containing a '?' and treats it as the flavor
 * question. Returns the text (unwrapped) and the source with that span
 * removed. Returns undefined flavor when no match exists.
 */
const extractFlavor = (raw: string): { flavor?: string; body: string } => {
  const re = /_([^_\n]+\?[^_\n]*)_/g;
  let last: { index: number; len: number; text: string } | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    last = { index: m.index, len: m[0].length, text: m[1].trim() };
  }
  if (!last) return { body: raw.trim() };
  const body = (
    raw.slice(0, last.index) + raw.slice(last.index + last.len)
  ).trim();
  return { flavor: last.text, body };
};

/**
 * Converts a feature's body lines into description / extra / flavor.
 *
 * - The last _...?_ anywhere in the text is the flavor.
 * - Paragraphs before the first bullet block become the description.
 * - Bullet blocks and any prose after them go into extra as <ul>/<p>.
 */
const buildFeature = (
  name: string,
  type: string,
  rawLines: string[],
): ParsedFeature => {
  const raw = rawLines.join('\n').trim();
  const { flavor, body } = extractFlavor(raw);

  const segments = body
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const descParts: string[] = [];
  const extraParts: string[] = [];
  let inExtra = false;

  for (const seg of segments) {
    const lines = seg.split('\n');
    const bulletLines = lines.filter((l) => l.trim().startsWith('- '));
    const isBulletBlock =
      bulletLines.length > 0 &&
      bulletLines.length === lines.filter((l) => l.trim()).length;

    if (isBulletBlock) {
      inExtra = true;
      const items = bulletLines
        .map((l) => `        <li>${stripMd(l.trim().slice(2))}</li>`)
        .join('\n');
      extraParts.push(
        `<ul class="list-outside list-disc pl-4">\n${items}\n        </ul>`,
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

  return {
    name,
    type,
    description,
    ...(extra !== undefined ? { extra } : {}),
    ...(flavor !== undefined ? { flavor } : {}),
  };
};

const FEATURE_HEADER_RE = /^\*\*_(.+?) - (.+?):(?:.*?)_\*\*\s*(.*)/;

const parseFeatures = (lines: string[]): ParsedFeature[] => {
  const features: ParsedFeature[] = [];
  let currentName = '';
  let currentType = '';
  let currentLines: string[] = [];

  const flush = () => {
    if (!currentName) return;
    features.push(buildFeature(currentName, currentType, currentLines));
  };

  for (const line of lines) {
    const m = line.match(FEATURE_HEADER_RE);
    if (m) {
      flush();
      currentName = m[1].trim();
      currentType = m[2].split(':')[0].trim().toLowerCase();
      currentLines = m[3] ? [m[3]] : [];
    } else if (currentName) {
      currentLines.push(line);
    }
  }
  flush();
  return features;
};

// ---------------------------------------------------------------------------
// Shared TypeScript code-generation helpers
// ---------------------------------------------------------------------------

const esc = (s: string): string =>
  s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const renderFeature = (f: ParsedFeature): string => {
  const lines = [
    `      {`,
    `        name: '${esc(f.name)}',`,
    `        type: '${esc(f.type)}',`,
    `        description: '${esc(f.description)}',`,
  ];
  if (f.extra !== undefined) {
    const escaped = f.extra.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    lines.push(`        extra: \`${escaped}\`,`);
  }
  if (f.flavor !== undefined) {
    lines.push(`        flavor: '${esc(f.flavor)}',`);
  }
  lines.push(`      },`);
  return lines.join('\n');
};

// Shared file header (imports + PreAdversaryDetails type).
const SHARED_HEADER = `import type {
  AdversaryDetails,
  AdversaryFeature,
} from '@/lib/types/adversary-creation';
import { capitalize } from '@/lib/utils';

type PreAdversaryDetails = Omit<AdversaryDetails, 'text' | 'type'> & {
  features: (AdversaryFeature & { extra?: string })[];
};`;

// ---------------------------------------------------------------------------
// Environments
// ---------------------------------------------------------------------------

type ParsedEnvironment = {
  name: string;
  tier: number;
  subtype: string;
  description: string;
  subDescription: string;
  difficulty: string;
  potential?: string;
  features: ParsedFeature[];
};

const parseEnvironmentFile = (filepath: string): ParsedEnvironment => {
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');

  const name =
    lines
      .find((l) => l.startsWith('# '))
      ?.slice(2)
      .trim() ?? '';

  const tierLine = lines.find((l) => /^\*\*_Tier \d/.test(l)) ?? '';
  const tierMatch = tierLine.match(/\*\*_Tier (\d+) (.+?)\._\*\* _(.+?)_/);
  const tier = tierMatch ? parseInt(tierMatch[1]) : 1;
  const subtype = tierMatch ? tierMatch[2] : '';
  const description = tierMatch ? tierMatch[3] : '';

  let subDescription = '';
  let difficulty = '';
  let potential: string | undefined;

  for (const line of lines) {
    if (line.startsWith('- **Impulses:**'))
      subDescription = line.replace('- **Impulses:**', '').trim();
    else if (line.startsWith('- **Difficulty:**'))
      difficulty = line.replace('- **Difficulty:**', '').trim();
    else if (line.startsWith('- **Potential Adversaries:**')) {
      const val = line.replace('- **Potential Adversaries:**', '').trim();
      if (val && val !== 'Any') potential = val;
    }
  }

  const featIdx = lines.findIndex((l) => l.trim() === '### FEATURES');
  const features = parseFeatures(featIdx >= 0 ? lines.slice(featIdx + 1) : []);

  return {
    name,
    tier,
    subtype,
    description,
    subDescription,
    difficulty,
    potential,
    features,
  };
};

const renderEnvironment = (env: ParsedEnvironment): string => {
  const lines = [
    `  {`,
    `    name: '${esc(env.name)}',`,
    `    tier: ${env.tier},`,
    `    subtype: '${esc(env.subtype)}',`,
    `    description: '${esc(env.description)}',`,
    `    subDescription: '${esc(env.subDescription)}',`,
    `    difficulty: '${esc(env.difficulty)}',`,
  ];
  if (env.potential !== undefined)
    lines.push(`    potential: '${esc(env.potential)}',`);
  lines.push(`    features: [`);
  for (const f of env.features) lines.push(renderFeature(f));
  lines.push(`    ],`, `  },`);
  return lines.join('\n');
};

// prettier-ignore
const ENV_FOOTER = `export const environments: AdversaryDetails[] = preEnvironments.map(
  (environment) => ({
    ...environment,
    type: 'environment',
    text: \`\${environment.features
      .map(
        (feat) =>
          \`<p><strong><em>\${capitalize(feat.name)} - \${capitalize(feat.type)}: </em></strong> \${feat.description}</p>
      \${feat.extra ? feat.extra : ''}
      \${feat.flavor ? \`<p><em>\${feat.flavor}</em></p>\` : ''}\`,
      )
      .join('')}\`,
  }),
);
`;

const syncEnvironments = () => {
  const dir = path.join(ROOT, 'srd-source', 'environments');
  const out = path.join(
    ROOT,
    'src',
    'lib',
    'constants',
    'srd',
    'environments.ts',
  );

  const items = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseEnvironmentFile(path.join(dir, f)))
    .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));

  const body = items.map(renderEnvironment).join('\n');
  const output = [
    SHARED_HEADER,
    '',
    `const preEnvironments: PreAdversaryDetails[] = [`,
    body,
    `];`,
    '',
    ENV_FOOTER,
  ].join('\n');

  fs.writeFileSync(out, output);
  console.log(
    `Synced ${items.length} environments → ${path.relative(ROOT, out)}`,
  );
};

// ---------------------------------------------------------------------------
// Adversaries
// ---------------------------------------------------------------------------

type ParsedAdversary = {
  name: string;
  tier: number;
  subtype: string;
  description: string;
  subDescription: string;
  difficulty: string;
  thresholds?: [number, number];
  hp: number;
  stress: number;
  attack: string;
  weapon: string;
  distance: string;
  damageAmount: string;
  damageType: string;
  experience?: string;
  features: ParsedFeature[];
};

const DAMAGE_TYPE: Record<string, string> = { phy: 'physical', mag: 'magic' };

const parseAdversaryFile = (filepath: string): ParsedAdversary => {
  const lines = fs.readFileSync(filepath, 'utf-8').split('\n');

  const name =
    lines
      .find((l) => l.startsWith('# '))
      ?.slice(2)
      .trim() ?? '';

  const tierLine = lines.find((l) => /^\*\*_Tier \d/.test(l)) ?? '';
  const tierMatch = tierLine.match(/\*\*_Tier (\d+) (.+?)\._\*\* _(.+?)_/);
  const tier = tierMatch ? parseInt(tierMatch[1]) : 1;
  const subtype = tierMatch ? tierMatch[2] : '';
  const description = tierMatch ? tierMatch[3] : '';

  let subDescription = '';
  let difficulty = '';
  let thresholds: [number, number] | undefined;
  let hp = 0;
  let stress = 0;
  let attack = '';
  let weapon = '';
  let distance = '';
  let damageAmount = '';
  let damageType = '';
  let experience: string | undefined;

  for (const line of lines) {
    if (line.startsWith('- **Motives & Tactics:**')) {
      subDescription = line.replace('- **Motives & Tactics:**', '').trim();
    } else if (line.startsWith('- **Difficulty:**')) {
      // "14 | **Thresholds:** 9/17 | **HP:** 7 | **Stress:** 2"
      const m = line.match(
        /\*\*Difficulty:\*\* ([^|]+)\|\s*\*\*Thresholds:\*\* ([^|]+)\|\s*\*\*HP:\*\* ([^|]+)\|\s*\*\*Stress:\*\* (.+)/,
      );
      if (m) {
        difficulty = m[1].trim();
        const thresh = m[2].trim();
        if (thresh !== 'None') {
          const [lo, hi] = thresh.split('/').map(Number);
          thresholds = [lo, hi];
        }
        hp = parseInt(m[3]);
        stress = parseInt(m[4]);
      }
    } else if (line.startsWith('- **ATK:**')) {
      // "+1 | **Claws:** Melee | 1d8+3 phy"
      const m = line.match(
        /\*\*ATK:\*\* ([^|]+)\|\s*\*\*(.+?):\*\* ([^|]+)\|\s*(.+)/,
      );
      if (m) {
        attack = m[1].trim();
        weapon = m[2].trim();
        distance = m[3].trim();
        const dmg = m[4].trim().split(/\s+/);
        damageType = DAMAGE_TYPE[dmg[dmg.length - 1]] ?? dmg[dmg.length - 1];
        damageAmount = dmg.slice(0, -1).join(' ');
      }
    } else if (line.startsWith('- **Experience:**')) {
      experience = line.replace('- **Experience:**', '').trim();
    }
  }

  const featIdx = lines.findIndex((l) => l.trim() === '### FEATURES');
  const features = parseFeatures(featIdx >= 0 ? lines.slice(featIdx + 1) : []);

  return {
    name,
    tier,
    subtype,
    description,
    subDescription,
    difficulty,
    thresholds,
    hp,
    stress,
    attack,
    weapon,
    distance,
    damageAmount,
    damageType,
    experience,
    features,
  };
};

const renderAdversary = (adv: ParsedAdversary): string => {
  const lines = [
    `  {`,
    `    name: '${esc(adv.name)}',`,
    `    tier: ${adv.tier},`,
    `    subtype: '${esc(adv.subtype)}',`,
    `    description: '${esc(adv.description)}',`,
    `    subDescription: '${esc(adv.subDescription)}',`,
    `    difficulty: '${esc(adv.difficulty)}',`,
  ];
  if (adv.thresholds)
    lines.push(`    thresholds: [${adv.thresholds[0]}, ${adv.thresholds[1]}],`);
  lines.push(
    `    hp: ${adv.hp},`,
    `    stress: ${adv.stress},`,
    `    attack: '${esc(adv.attack)}',`,
    `    weapon: '${esc(adv.weapon)}',`,
    `    distance: '${esc(adv.distance)}',`,
    `    damageAmount: '${esc(adv.damageAmount)}',`,
    `    damageType: '${esc(adv.damageType)}',`,
  );
  if (adv.experience !== undefined)
    lines.push(`    experience: '${esc(adv.experience)}',`);
  lines.push(`    features: [`);
  for (const f of adv.features) lines.push(renderFeature(f));
  lines.push(`    ],`, `  },`);
  return lines.join('\n');
};

// prettier-ignore
const ADV_FOOTER = `export const adversaries: AdversaryDetails[] = preAdversaries.map(
  (adversary) => ({
    ...adversary,
    type: 'adversary',
    text: \`\${adversary.features
      .map(
        (feat) =>
          \`<p><strong><em>\${capitalize(feat.name)} - \${capitalize(feat.type)}: </em></strong> \${feat.description}</p>
      \${feat.extra ? feat.extra : ''}
      \${feat.flavor ? \`<p><em>\${feat.flavor}</em></p>\` : ''}\`,
      )
      .join('')}\`,
  }),
);
`;

const syncAdversaries = () => {
  const dir = path.join(ROOT, 'srd-source', 'adversaries');
  const out = path.join(
    ROOT,
    'src',
    'lib',
    'constants',
    'srd',
    'adversaries.ts',
  );

  const items = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parseAdversaryFile(path.join(dir, f)))
    .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));

  const body = items.map(renderAdversary).join('\n');
  const output = [
    SHARED_HEADER,
    '',
    `const preAdversaries: PreAdversaryDetails[] = [`,
    body,
    `];`,
    '',
    ADV_FOOTER,
  ].join('\n');

  fs.writeFileSync(out, output);
  console.log(
    `Synced ${items.length} adversaries → ${path.relative(ROOT, out)}`,
  );
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const TARGETS: Record<string, () => void> = {
  environments: syncEnvironments,
  adversaries: syncAdversaries,
};

const target = process.argv[2];

if (!target || !(target in TARGETS)) {
  console.error(
    `Usage: tsx scripts/sync-adversaries.ts <${Object.keys(TARGETS).join(' | ')}>`,
  );
  process.exit(1);
}

TARGETS[target]();
