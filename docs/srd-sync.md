# SRD Sync Scripts

This document explains how the SRD reference data is sourced and how to keep it up to date.

## Source Data

SRD content is stored as markdown files in the `srd-source/` directory, which is a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) pointing to [seansbox/daggerheart-srd](https://github.com/seansbox/daggerheart-srd). That repository is a structured markdown conversion of the Daggerheart System Reference Document maintained by [seansbox](https://github.com/seansbox).

The sync scripts in `scripts/` parse those markdown files and generate TypeScript constants under `src/lib/constants/reference/srd/`.

## Initializing the Submodule

When you first clone the repo, the `srd-source/` directory will be empty. Initialize and populate it with:

```bash
git submodule update --init
```

## Pulling SRD Updates

When the upstream `daggerheart-srd` repository publishes new content, pull it into your local submodule:

```bash
git submodule update --remote srd-source
```

After pulling, commit the updated submodule pointer:

```bash
git add srd-source
git commit -m "update srd-source to latest"
```

Then re-run the relevant sync scripts to regenerate the TypeScript constants (see below).

## Sync Scripts

Two scripts handle syncing. Both accept a target argument and write generated files directly to `src/lib/constants/reference/srd/`.

### `scripts/sync-adversaries.ts`

Syncs adversary and environment data.

| Target         | Output file                                       | Source directory           |
| -------------- | ------------------------------------------------- | -------------------------- |
| `environments` | `src/lib/constants/reference/srd/environments.ts` | `srd-source/environments/` |
| `adversaries`  | `src/lib/constants/reference/srd/adversaries.ts`  | `srd-source/adversaries/`  |

### `scripts/sync-cards.ts`

Syncs card data for ancestries, communities, classes (including subclasses), and equipment.

| Target        | Output file                                      | Source directory                                 |
| ------------- | ------------------------------------------------ | ------------------------------------------------ |
| `ancestries`  | `src/lib/constants/reference/srd/ancestries.ts`  | `srd-source/ancestries/`                         |
| `communities` | `src/lib/constants/reference/srd/communities.ts` | `srd-source/communities/`                        |
| `classes`     | `src/lib/constants/reference/srd/classes.tsx`    | `srd-source/classes/` + `srd-source/subclasses/` |
| `armor`       | `src/lib/constants/reference/srd/armor.ts`       | `srd-source/armor/`                              |
| `weapons`     | `src/lib/constants/reference/srd/weapons.ts`     | `srd-source/weapons/`                            |
| `consumables` | `src/lib/constants/reference/srd/consumables.ts` | `srd-source/consumables/`                        |
| `items`       | `src/lib/constants/reference/srd/items.ts`       | `srd-source/items/`                              |

## NPM Scripts

Two scripts are available. Pass the target type as an argument:

```bash
pnpm sync:reference:adversaries environments   # environments
pnpm sync:reference:adversaries adversaries    # adversaries

pnpm sync:reference:cards ancestries           # ancestries
pnpm sync:reference:cards communities          # communities
pnpm sync:reference:cards classes              # classes + subclasses
pnpm sync:reference:cards armor                # armor
pnpm sync:reference:cards weapons              # weapons
pnpm sync:reference:cards consumables          # consumables
pnpm sync:reference:cards items                # items
```

## MDX Additional Content

Some classes have supplementary prose that doesn't fit the card data structure (e.g. the Druid's Beastform Options, the Beastbound Ranger Companion rules). This content lives as MDX files in `content/srd/` and is rendered at runtime using `next-mdx-remote`:

| File                                    | Rendered on                                       |
| --------------------------------------- | ------------------------------------------------- |
| `content/srd/classes/druid.mdx`         | `/reference/classes/druid`                        |
| `content/srd/subclasses/beastbound.mdx` | `/reference/classes/ranger` (Beastbound subclass) |

These files are edited manually. Add a new file matching the class or subclass slug and it will be picked up automatically — no code changes required.
