import { CardDetails } from '@/lib/types';
import { capitalize } from '@/lib/utils';

type Feature = {
  name: string;
  description: string;
  extra?: string;
};

type PreBeastform = {
  name: string;
  tier: number;
  traitBonuses?: [string, string];
  weaponTrait?: string;
  distance?: string;
  damage?: string;
  damageType?: string;
  advantage?: string;
  examples: string;
  features: Feature[];
};

const preBeastforms: PreBeastform[] = [
  {
    name: 'Agile Scout',
    tier: 1,
    traitBonuses: ['Agility +1', 'Evasion +2'],
    weaponTrait: 'agility',
    distance: 'melee',
    damage: 'd4',
    damageType: 'physical',
    advantage: 'deceive, locate, sneak',
    examples: 'Fox, Mouse, Weasel, etc.',
    features: [
      {
        name: 'Agile',
        description:
          'Your movement is silent, and you can spend a Hope to move up to Far  range without rolling.',
      },
      {
        name: 'Fragile',
        description:
          'When you take Major or greater damage, you drop out of Beastform',
      },
    ],
  },
  {
    name: 'Household Friend',
    tier: 1,
    examples: 'Cat, Dog, Rabbit, etc.',
    traitBonuses: ['Instinct +1', 'Evasion +2'],
    distance: 'Melee',
    weaponTrait: 'Instinct',
    damage: 'd6',
    damageType: 'physical',
    advantage: 'climb, locate, protect',
    features: [
      {
        name: 'Companion',
        description:
          'When you Hlep an Ally, you can  roll a d8 as your advantage die.',
      },
      {
        name: 'Fragile',
        description:
          'When you take Major or greater damage, you drop out of Beastform',
      },
    ],
  },
  {
    name: 'Nimble Grazer',
    tier: 1,
    examples: 'Deer, Gazelle, Goat',
    traitBonuses: ['Agility +1', 'Evasion +3'],
    distance: 'Melee',
    weaponTrait: 'Agility',
    damage: 'd6',
    damageType: 'physical',
    advantage: 'leap, sneak, sprint',
    features: [
      {
        name: 'Elusive Prey',
        description:
          'When an attack roll against you would succeed, you can mark a Stress and roll a d4. Add the result to your Evasion against this atack.',
      },
      {
        name: 'Fragile',
        description:
          'When you take Major or greater damage, you drop out of Beastform',
      },
    ],
  },
  {
    name: 'Pack Predator',
    tier: 1,
    examples: 'Coyote, Hyena, Wolf, etc',
    traitBonuses: ['Strength +2', 'Evasion +1'],
    distance: 'Melee',
    weaponTrait: 'Strength',
    damage: 'd8+2',
    damageType: 'physical',
    advantage: 'attack, sprint, track',
    features: [
      {
        name: 'Hobbling Strike',
        description:
          'When you succeed on an attack against a target within Melee range, you can mark a Stress to make the target temporarily Vulnerable',
      },
      {
        name: 'Pack Hunting',
        description:
          'When you succeed on an attack against the sametarget as an ally who acts immediately before you, add a d8 to your damage roll.',
      },
    ],
  },
  {
    name: 'Aquatic Scout',
    tier: 1,
    examples: 'Eel, Fish, Octopus, etc.',
    traitBonuses: ['Agility +1', 'Evasion +2'],
    distance: 'Melee',
    weaponTrait: 'Agility',
    damage: 'd4',
    damageType: 'physical',
    advantage: 'navigate, sneak, swim',
    features: [
      {
        name: 'Aquatic',
        description: 'You can breath and move naturally underwater',
      },
      {
        name: 'Fragile',
        description:
          'When you take Major or greater damage, you drop out of Beastform',
      },
    ],
  },
  {
    name: 'Stalking Arachnid',
    tier: 1,
    examples: 'Tarantula, Wolf Spider, etc',
    traitBonuses: ['Finesse +1', 'Evasion +2'],
    distance: 'Melee',
    weaponTrait: 'Finesse',
    damage: 'd6+1',
    damageType: 'physical',
    advantage: 'attack, climb, sneak',
    features: [
      {
        name: 'Venomus Bite',
        description:
          'When you succeed on an attack against a target within Melee range, the target becomes temporarily Poisoned. A Poisoned creature takes 1d10 direct physical damage each time they act.',
      },
      {
        name: 'Webslinger',
        description:
          'You can create a strong web material useful for both  adventuring and battle. The web is resilient enough to support one creature. You can temporarily Restrain a target within Close range by succeeding on a Finesse Roll against them.',
      },
    ],
  },
  {
    name: 'Armored Sentry',
    tier: 2,
    examples: 'Armodilo, Pangolin, Turtle, etc.',
    traitBonuses: ['Strength +1', 'Evasion +1'],
    distance: 'Melee',
    weaponTrait: 'Strength',
    damage: 'd8+2',
    damageType: 'physical',
    advantage: 'dig, locate, protect',
    features: [
      {
        name: 'Armored Shell',
        description:
          'Your hardened exterior gives you resistance to physical damage. Additionally, mark an Armor Slot to retract into your shell. While in your shell, physical damage is reduced by a number equal to your Armor Score (after applying resistance), but you can’t perform other actions without leaving this form.',
      },
      {
        name: 'Cannonball',
        description:
          "Mark a Stress to allow an ally to throw or launch you at an adversary. To do so, the ally makes an attack roll using Agility or Strength (their choice) against a target within Close range. On a success, the adversary takes d12+2 physical damage using the thrower's Proficiency. You can spend a Hope to target an additional adversary within Very Close range of the first. The second target takes half the damage dealt to the first target.",
      },
    ],
  },
  {
    name: 'Powerful Beast',
    tier: 2,
    examples: 'Bear, Bull, Moose, etc',
    traitBonuses: ['Strength +1', 'Evasion +3'],
    distance: 'Melee',
    weaponTrait: 'strength',
    damage: 'd10+4',
    damageType: 'physical',
    advantage: 'navgitae, protect, scare',
    features: [
      {
        name: 'Rampage',
        description:
          'When you roll a 1 on a damage die, you can roll a d10 and add the result to the damage roll. Addiitonally, before you make an attack roll, you can mark a Stress to gain a +1 bonus to your Proficiency for that attack.',
      },
      {
        name: 'Thick Hide',
        description: 'You gain a +2 bonus to your damage thresholds.',
      },
    ],
  },
  {
    name: 'Mighty Strider',
    tier: 2,
    examples: 'Camel, Horse, Zebra, etc',
    traitBonuses: ['Agility +1', 'Evasion +2'],
    distance: 'Melee',
    weaponTrait: 'agility',
    damage: 'd8+1',
    damageType: 'physical',
    advantage: 'leap, navigate, sprint',
    features: [
      {
        name: 'Carrier',
        description:
          'You can carry up to two willing allies with you when you move.',
      },
      {
        name: 'Trample',
        description:
          'Mark a Stress to move up to Close range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take d8+1 physical damage using your Proficiency andare temporarily Vulnerable.',
      },
    ],
  },
  {
    name: 'Striking Serpent',
    tier: 2,
    examples: 'Cobra, Rattlesnake, Viper, etc',
    traitBonuses: ['Finesse +1', 'Evasion +2'],
    distance: 'Very Close',
    weaponTrait: 'Finesse',
    damage: 'd8+4',
    damageType: 'physical',
    advantage: 'climb, deceive, sprint',
    features: [
      {
        name: 'Venomous Strike',
        description:
          'Make an attack against any number of targets within Very Close range. On a success, a target is temporarily Poisoned. A Poisoned creature takes a 1d10 physical direct damage each time they act.',
      },
      {
        name: 'Warning Hiss',
        description:
          'Mark a Stress to force any number of targets within Melee range to move back to Very Close range.',
      },
    ],
  },
  {
    name: 'Pouncing Predator',
    tier: 2,
    examples: 'Cheetah, Lion, Panther, etc',
    traitBonuses: ['Instinct +1', 'Evasion +3'],
    distance: 'melee',
    weaponTrait: 'Instinct',
    damage: 'd8+6',
    damageType: 'physical',
    advantage: 'attack, climb, sneak',
    features: [
      {
        name: 'Fleet',
        description: 'Spend a Hope to move up to Far range without rolling.',
      },
      {
        name: 'Takedown',
        description:
          'Mark a Stress to move into Melee range of a target and make an attack roll against them. On a success, you gain a +2 bonus to your Profiency for this attack and the target must mark a Stress.',
      },
    ],
  },
  {
    name: 'Winged Beast',
    tier: 2,
    examples: 'Hawk, Owl, Raven, etc',
    traitBonuses: ['Finesse +1', 'Evasion +3'],
    distance: 'melee',
    weaponTrait: 'finesse',
    damage: 'd4+2',
    damageType: 'physical',
    advantage: 'deceive, locate, scare',
    features: [
      {
        name: "Bird's-Eye View",
        description:
          'You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.',
      },
      {
        name: 'Hollow Bones',
        description: 'You gain a -2 penalty to your damage thresholds.',
      },
    ],
  },
  {
    name: 'Great Predator',
    tier: 3,
    examples: 'Dire Wolf, Velociraptor, Sabertooth Tiger, etc',
    traitBonuses: ['Strength +2', 'Evasionn +2'],
    distance: 'melee',
    weaponTrait: 'strength',
    damage: 'd12+8',
    damageType: 'physical',
    advantage: 'attack, sneak, sprint',
    features: [
      {
        name: 'Carrier',
        description:
          'You can carry up to two willing allies with you when you move.',
      },
      {
        name: 'Vicious Maul',
        description:
          'When you succeed on an attack against a target, you can spend a Hope to make them temporarily Vulnerable and gain a +1 bonus to your Proficiency for this attack.',
      },
    ],
  },
  {
    name: 'Mighty Lizard',
    tier: 3,
    examples: 'Aligator, Crocodile, Gila Monster, etc',
    traitBonuses: ['Instinct +2', 'Evasion +1'],
    distance: 'melee',
    weaponTrait: 'instinct',
    damage: 'd10+7',
    damageType: 'physical',
    advantage: 'attack, sneak, track',
    features: [
      {
        name: 'Physical Defense',
        description: 'You gain a +3 bonus to your damage thresholds',
      },
      {
        name: 'Snapping Strike',
        description:
          'when you succeed on an attack against a target within Melee range, you can spend a Hope to clamp that opponent in yoru jaws, making them temporarily Restrained and Vulnerabl to clamp that opponent in yoru jaws, making them temporarily Restrained and Vulnerable.',
      },
    ],
  },
  {
    name: 'Great Winged Beast',
    tier: 3,
    examples: 'Giant Eagle, Falcon, etc.',
    traitBonuses: ['Finesse + 2', 'Evasion +3'],
    distance: 'melee',
    weaponTrait: 'finesse',
    damage: 'd8+6',
    damageType: 'physical',
    advantage: 'deceive, distract, locate',
    features: [
      {
        name: "Bird's-Eye View",
        description:
          'You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.',
      },
      {
        name: 'Carrier',
        description:
          'You can carry up to two willing allies with you when you move.',
      },
    ],
  },
  {
    name: 'Aquatic Predator',
    tier: 3,
    examples: 'Dolphin, Orca, Shark, etc',
    traitBonuses: ['Agility +2', 'Evasion +4'],
    distance: 'melee',
    weaponTrait: 'agility',
    damage: 'd10+6',
    damageType: 'physical',
    advantage: 'attack, swim, track',
    features: [
      {
        name: 'Aquatic',
        description: 'You can breathe and move naturally underwater.',
      },
      {
        name: 'Vicious Maul',
        description:
          'When you succeed on an attack against a target, you can spend a Hope to make them Vulnerable and gain a +1 bonus to your Proficiency for this attack.',
      },
    ],
  },
  {
    name: 'Legendary Beast',
    tier: 3,
    examples: 'Upgraded Tier 1 Options',
    features: [
      {
        name: 'Evolved',
        description:
          "Pick a Tier 1 Beastform option and become a larger and more powerful verison of that creature. While you're in this form, you retain all traits and features from the original form andgain the following bonuses:",
        extra: `<ul class="list-outside list-disc pl-4">
      <li>A +6 bonus to damage rolls</li>
      <li>A +1 bonus to trait used by this form</li>
      <li>A +2 bonus to evasion</li>
      </ul>`,
      },
    ],
  },
  {
    name: 'Legendary Hybrid',
    tier: 3,
    examples: 'Griffon, Sphinx, etc',
    traitBonuses: ['Strength +2', 'Evasion +3'],
    distance: 'melee',
    weaponTrait: 'Strength',
    damage: 'd10+8',
    damageType: 'magical',
    features: [
      {
        name: 'Hybrid Features',
        description:
          'To transform into this creature, mark an additional Stress. Choose any two Beastform options from Tiers 1-2. Choose a total of four advantages andtwo features from those options.',
      },
    ],
  },
  {
    name: 'Massive Behemoth',
    tier: 4,
    examples: 'Elephant, Mammoth, Rhinoceros, etc',
    traitBonuses: ['Strength +3', 'Evasion +1'],
    distance: 'Melee',
    weaponTrait: 'Strength',
    damage: 'd12+12',
    damageType: 'physical',
    advantage: 'locate, protect, scare, sprint',
    features: [
      {
        name: 'Carrier',
        description:
          'You can carry up to four willing allies with you when you move.',
      },
      {
        name: 'Demolish',
        description:
          'Spend a Hope to move up to Far range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take d8+10 physical damage using your Proficiency andare temporarily Vulnerable.',
      },
      {
        name: 'Undaunted',
        description: 'You gain a +2 bonus to all your damage thresholds.',
      },
    ],
  },
  {
    name: 'Terrible Lizard',
    tier: 4,
    examples: 'Brachiosaurus, Tyrannosaurus, etc',
    traitBonuses: ['Strength +3', 'Evasion +2'],
    distance: 'Melee',
    weaponTrait: 'Strength',
    damage: 'd12+10',
    damageType: 'physical',
    advantage: 'attack, deceive, scare, track',
    features: [
      {
        name: 'Devastating Strikes',
        description:
          'When you deal Severe damage to a target within Melee range, you can mark a Stress to force themto mark an additional Hit Point.',
      },
      {
        name: 'Massive Stride',
        description:
          "You can move up to Far range without rolling. You ignore rough terrain (at the GM's discretion) due to your size.",
      },
    ],
  },
  {
    name: 'Mythic Aerial Hunter',
    tier: 4,
    examples: 'Dragon, Pterodactyl, Roc, Wyvern, etc',
    traitBonuses: ['Finesse +3', 'Evasion +4'],
    distance: 'melee',
    weaponTrait: 'Finesse',
    damage: 'd10+11',
    damageType: 'physical',
    advantage: 'attack, deceive, locate, navigate',
    features: [
      {
        name: 'Carrier',
        description:
          'You can carry up to three willing allies with you when you move.',
      },
      {
        name: 'Deadly Raptor',
        description:
          'You can fly at will andmove up to Far range as part of your action. When you move in a straight line into Melee range of a target from at least Close range and make an attack against that target in the same action, you can reroll all damage dice that rolled a result lower than your Proficiency.',
      },
    ],
  },
  {
    name: 'Epic Aquatic Beast',
    tier: 4,
    traitBonuses: ['Agility +3', 'Evasion +3'],
    weaponTrait: 'agility',
    distance: 'melee',
    damage: 'd10+10',
    damageType: 'physical',
    advantage: 'locate, protect, scare, track',
    examples: 'Giant Squid, Whale, etc.',
    features: [
      {
        name: 'Ocean Master',
        description:
          'You can breath and move naturally underwater. When you succeeed on an attack against a target within Melee range, you can temporarily Restrain them.',
      },
      {
        name: 'Unyielding',
        description:
          'When you would mark an Armor Slot, roll a d6. On a result of 5 or higher, reduce the severity by one threshold without maring an Armor Slot.',
      },
    ],
  },
  {
    name: 'Mythic Hybrid',
    tier: 4,
    examples: 'Chimera, Cockatrice, Manticore, etc',
    traitBonuses: ['Strengt +3', 'Evasion +2'],
    distance: 'melee',
    weaponTrait: 'strength',
    damage: 'd12+10',
    damageType: 'physical',
    features: [
      {
        name: 'Hybrid Features',
        description:
          'To transform into this creature, mark 2 additional Stress. Choose any three Beastfom options from Tiers 1-3. Choose a total of five advantages and three features from those options.',
      },
    ],
  },
];

export const beastforms: CardDetails[] = preBeastforms.map((beastform) => ({
  name: beastform.name,
  tier: beastform.tier,
  subtype: 'druid',
  subtitle: 'Beastform',
  type: 'subclass',
  domainPrimary: 'sage',
  domainPrimaryColor: '#0e854d',
  domainSecondary: 'arcana',
  domainSecondaryColor: '#664295',
  text: `${beastform.traitBonuses ? `<p style='text-align: center'><em>${beastform.traitBonuses[0]}</em> | <em>${beastform.traitBonuses[1]}</em></p>` : ''}
${beastform.weaponTrait && beastform.damage && beastform.damageType && beastform.distance ? `<p style='text-align: center'><strong>${capitalize(beastform.weaponTrait)} ${capitalize(beastform.distance)}</strong> - ${beastform.damage} (${capitalize(beastform.damageType)})</p>` : ''}
${beastform.advantage ? `<p><strong>Gain advantage on:</strong> ${beastform.advantage}</p>` : ''}
${beastform.features
  .map(
    (feat) => `<p><strong><em>${feat.name}</em></strong> ${feat.description}</p>
${feat.extra ? feat.extra : ''}
`,
  )
  .join('')}
<p style='text-align: center'>(${beastform.examples})</p>
`,
  credits: 'Daggerheart™ Compatible. Terms at Daggerheart.com',
}));
