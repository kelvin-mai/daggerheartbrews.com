import type { AdversaryFeature } from '@/lib/types';

export const exampleFeatures: AdversaryFeature[] = [
  {
    name: 'Haymaker',
    type: 'action',
    description:
      'Make an attack against a target within Very Close range. On a success, deal X direct physical damage.',
  },
  {
    name: 'Shredding Strike',
    type: 'action',
    description:
      "Make an attack against a target within Very Close range. On a success, deal X physical damage and the target must mark an Armor Slot without gaining it's benefit (they can still use armor to reduce the damage)",
  },
  {
    name: 'More Where That Came From',
    type: 'action',
    description: 'Summon three Jagged Knife Lackeys, who appear at Far range.',
  },
  {
    name: 'Explosion',
    type: 'action',
    description:
      'Spend a Fear to erupt in a fiery explosion. Make an attack against all targets within Close range. Targets the adversary succeeds against take 1d8 magic damage and are knocked back to Far range.',
  },
  {
    name: 'Heavy Hitter',
    type: 'reaction',
    description:
      'When this adversary deals damage with a standard attack, you can spenda Fear to gain a +X bonus to the damage roll.',
  },
  {
    name: 'Team-Up',
    type: 'reaction',
    description:
      'When another adversary within Very Close range of this adversary deals X damage to a creature, you can mark a Stress to make a standard attack against that same creature. On a success, combine the damage.',
  },
  {
    name: 'Momentum',
    type: 'reaction',
    description:
      'When this adversary makes a successful attack against a PC, you gain a Fear.',
  },
  {
    name: 'Horde (X)',
    type: 'passive',
    description:
      'When the Horde has marked half or more of their HP, their standard attack deals X damage instead.',
  },
  {
    name: 'Minion (X)',
    type: 'passive',
    description:
      'This adversary is defeated when they take any damage. For every X damage a PC deals to this adversary, defeat an additional Minion within range the attack would succeed against.',
  },
  {
    name: 'Relentless (X)',
    type: 'passive',
    description:
      'This adversary can be spotlighted up to X times per GM turn. Spend Fear as usual to spotlight them.',
  },
  {
    name: 'Slow',
    type: 'passive',
    description:
      "When you spotlight this adversary and they don't have a token on their stat block, they can't act yet. Place a token on their stat block, clear the token and they can act.",
  },
  {
    name: 'Arcane Form',
    type: 'passive',
    description: 'This adversary is resistant to magic damage.',
  },
  {
    name: 'Armored Carapace',
    type: 'passive',
    description: 'When this adversary takes physical damage, reduce it by X.',
  },
];
