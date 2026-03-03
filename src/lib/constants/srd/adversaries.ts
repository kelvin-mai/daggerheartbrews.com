import type {
  AdversaryDetails,
  AdversaryFeature,
} from '@/lib/types/adversary-creation';
import { capitalize } from '@/lib/utils';

type PreAdversaryDetails = Omit<AdversaryDetails, 'text' | 'type'> & {
  features: (AdversaryFeature & { extra?: string })[];
};

const preAdversaries: PreAdversaryDetails[] = [
  {
    name: 'Acid Burrower',
    tier: 1,
    subtype: 'Solo',
    description: 'A horse-sized insect with digging claws and acidic blood.',
    subDescription: 'Burrow, drag away, feed, reposition',
    difficulty: '14',
    thresholds: [8, 15],
    hp: 8,
    stress: 3,
    attack: '+3',
    weapon: 'Claws',
    distance: 'Very Close',
    damageAmount: '1d12+2',
    damageType: 'physical',
    experience: 'Tremor Sense +2',
    features: [
      {
        name: 'Relentless (3)',
        type: 'passive',
        description:
          'The Burrower can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Earth Eruption',
        type: 'action',
        description:
          'Mark a Stress to have the Burrower burst out of the ground. All creatures within Very Close range must succeed on an Agility Reaction Roll or be knocked over, making them Vulnerable until they next act.',
      },
      {
        name: 'Spit Acid',
        type: 'action',
        description:
          "Make an attack against all targets in front of the Burrower within Close range. Targets the Burrower succeeds against take 2d6 physical damage and must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP and you gain a Fear.",
      },
      {
        name: 'Acid Bath',
        type: 'reaction',
        description:
          'When the Burrower takes Severe damage, all creatures within Close range are bathed in their acidic blood, taking 1d10 physical damage. This splash covers the ground within Very Close range with blood, and all creatures other than the Burrower who move through it take 1d6 physical damage.',
      },
    ],
  },
  {
    name: 'Archer Guard',
    tier: 1,
    subtype: 'Ranged',
    description:
      "A tall guard bearing a longbow and quiver with arrows fletched in the settlement's colors.",
    subDescription: 'Arrest, close gates, make it through the day, pin down',
    difficulty: '10',
    thresholds: [4, 8],
    hp: 3,
    stress: 2,
    attack: '+1',
    weapon: 'Longbow',
    distance: 'Far',
    damageAmount: '1d8+3',
    damageType: 'physical',
    experience: 'Local Knowledge +3',
    features: [
      {
        name: 'Hobbling Shot',
        type: 'action',
        description:
          'Make an attack against a target within Far range. On a success, mark a Stress to deal 1d12+3 physical damage. If the target marks HP from this attack, they have disadvantage on Agility Rolls until they clear at least 1 HP.',
      },
    ],
  },
  {
    name: 'Bear',
    tier: 1,
    subtype: 'Bruiser',
    description: 'A large bear with thick fur and powerful claws.',
    subDescription: 'Climb, defend territory, pummel, track',
    difficulty: '14',
    thresholds: [9, 17],
    hp: 7,
    stress: 2,
    attack: '+1',
    weapon: 'Claws',
    distance: 'Melee',
    damageAmount: '1d8+3',
    damageType: 'physical',
    experience: 'Ambusher +3, Keen Senses +2',
    features: [
      {
        name: 'Overwhelming Force',
        type: 'passive',
        description:
          "Targets who mark HP from the Bear's standard attack are knocked back to Very Close range.",
      },
      {
        name: 'Bite',
        type: 'action',
        description:
          'Mark a Stress to make an attack against a target within Melee range. On a success, deal 3d4+10 physical damage and the target is Restrained until they break free with a successful Strength Roll.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Bear makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Bladed Guard',
    tier: 1,
    subtype: 'Standard',
    description:
      "An armored guard bearing a sword and shield painted in the settlement's colors.",
    subDescription: 'Arrest, close gates, make it through the day, pin down',
    difficulty: '12',
    thresholds: [5, 9],
    hp: 5,
    stress: 2,
    attack: '+1',
    weapon: 'Longsword',
    distance: 'Melee',
    damageAmount: '1d6+1',
    damageType: 'physical',
    experience: 'Local Knowledge +3',
    features: [
      {
        name: 'Shield Wall',
        type: 'passive',
        description:
          'A creature who tries to move within Very Close range of the Guard must succeed on an Agility Roll. If additional Bladed Guards are standing in a line alongside the first, and each is within Melee range of another guard in the line, the Difficulty increases by the total number of guards in that line.',
      },
      {
        name: 'Detain',
        type: 'action',
        description:
          'Make an attack against a target within Very Close range. On a success, mark a Stress to Restrain the target until they break free with a successful attack, Finesse Roll, or Strength Roll.',
      },
    ],
  },
  {
    name: 'Brawny Zombie',
    tier: 1,
    subtype: 'Bruiser',
    description: 'A large corpse, decay-bloated and angry.',
    subDescription: 'Crush, destroy, hail debris, slam',
    difficulty: '10',
    thresholds: [8, 15],
    hp: 7,
    stress: 4,
    attack: '+2',
    weapon: 'Slam',
    distance: 'Very Close',
    damageAmount: '1d12+3',
    damageType: 'physical',
    experience: 'Collateral Damage +2, Throw +4',
    features: [
      {
        name: 'Slow',
        type: 'passive',
        description:
          "When you spotlight the Zombie and they don't have a token on their stat block, they can't act yet. Place a token on their stat block and describe what they're preparing to do. When you spotlight the Zombie and they have a token on their stat block, clear the token and they can act.",
      },
      {
        name: 'Rend Asunder',
        type: 'action',
        description:
          'Make a standard attack with advantage against a target the Zombie has Restrained. On a success, the attack deals direct damage.',
      },
      {
        name: 'Rip and Tear',
        type: 'reaction',
        description:
          'When the Zombies makes a successful standard attack, you can mark a Stress to temporarily Restrain the target and force them to mark 2 Stress.',
      },
    ],
  },
  {
    name: 'Cave Ogre',
    tier: 1,
    subtype: 'Solo',
    description: 'A massive humanoid who sees all sapient life as food.',
    subDescription: 'Bite off heads, feast, rip limbs, stomp, throw enemies',
    difficulty: '13',
    thresholds: [8, 15],
    hp: 8,
    stress: 3,
    attack: '+1',
    weapon: 'Club',
    distance: 'Very Close',
    damageAmount: '1d10+2',
    damageType: 'physical',
    experience: 'Throw +2',
    features: [
      {
        name: 'Ramp Up',
        type: 'passive',
        description:
          'You must spend a Fear to spotlight the Ogre. While spotlighted, they can make their standard attack against all targets within range.',
      },
      {
        name: 'Bone Breaker',
        type: 'passive',
        description: "The Ogre's attacks deal direct damage.",
      },
      {
        name: 'Hail of Boulders',
        type: 'action',
        description:
          'Mark a Stress to pick up heavy objects and throw them at all targets in front of the Ogre within Far range. Make an attack against these targets. Targets the Ogre succeeds against take 1d10+2 physical damage. If they succeed against more than one target, you gain a Fear.',
      },
      {
        name: 'Rampaging Fury',
        type: 'reaction',
        description:
          'When the Ogre marks 2 or more HP, they can rampage. Move the Ogre to a point within Close range and deal 2d6+3 direct physical damage to all targets in their path.',
      },
    ],
  },
  {
    name: 'Construct',
    tier: 1,
    subtype: 'Solo',
    description:
      'A roughly humanoid being of stone and steel, assembled and animated by magic.',
    subDescription:
      'Destroy environment, serve creator, smash target, trample groups',
    difficulty: '13',
    thresholds: [7, 15],
    hp: 9,
    stress: 4,
    attack: '+4',
    weapon: 'Fist Slam',
    distance: 'Melee',
    damageAmount: '1d20',
    damageType: 'physical',
    features: [
      {
        name: 'Relentless (2)',
        type: 'passive',
        description:
          'The Construct can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Weak Structure',
        type: 'passive',
        description:
          'When the Construct marks HP from physical damage, they must mark an additional HP.',
      },
      {
        name: 'Trample',
        type: 'action',
        description:
          "Mark a Stress to make an attack against all targets in the Construct's path when they move. Targets the Construct succeeds against take 1d8 physical damage.",
      },
      {
        name: 'Overload',
        type: 'reaction',
        description:
          "Before rolling damage for the Construct's attack, you can mark a Stress to gain a +10 bonus to the damage roll. The Construct can then take the spotlight again.",
      },
      {
        name: 'Death Quake',
        type: 'reaction',
        description:
          'When the Construct marks their last HP, the magic powering them ruptures in an explosion of force. Make an attack with advantage against all targets within Very Close range. Targets the Construct succeeds against take 1d12+2 magic damage.',
      },
    ],
  },
  {
    name: 'Courtier',
    tier: 1,
    subtype: 'Social',
    description: 'An ambitious and ostentatiously dressed socialite.',
    subDescription: 'Discredit, gain favor, maneuver, scheme',
    difficulty: '12',
    thresholds: [4, 8],
    hp: 3,
    stress: 4,
    attack: '-4',
    weapon: 'Daggers',
    distance: 'Melee',
    damageAmount: '1d4+2',
    damageType: 'physical',
    experience: 'Socialite +3',
    features: [
      {
        name: 'Mockery',
        type: 'action',
        description:
          'Mark a Stress to say something mocking and force a target within Close range to make a Presence Reaction Roll (14) to see if they can save face. On a failure, the target must mark 2 Stress and is Vulnerable until the scene ends.',
      },
      {
        name: 'Scapegoat',
        type: 'action',
        description:
          'Spend a Fear and target a PC. The Courtier convinces a crowd or prominent individual that the target is the cause of their current conflict or misfortune.',
      },
    ],
  },
  {
    name: 'Deeproot Defender',
    tier: 1,
    subtype: 'Bruiser',
    description: 'A burly vegetable-person with grasping vines.',
    subDescription: 'Ambush, grab, protect, pummel',
    difficulty: '10',
    thresholds: [8, 14],
    hp: 7,
    stress: 3,
    attack: '+2',
    weapon: 'Vines',
    distance: 'Close',
    damageAmount: '1d8+3',
    damageType: 'physical',
    experience: 'Huge +3',
    features: [
      {
        name: 'Ground Slam',
        type: 'action',
        description:
          'Slam the ground, knocking all targets within Very Close range back to Far range. Each target knocked back this way must mark a Stress.',
      },
      {
        name: 'Grab and Drag',
        type: 'action',
        description:
          'Make an attack against a target within Close range. On a success, spend a Fear to pull them into Melee range, deal 1d6+2 physical damage, and Restrain them until the Defender takes Severe damage.',
      },
    ],
  },
  {
    name: 'Dire Wolf',
    tier: 1,
    subtype: 'Skulk',
    description: 'A large wolf with menacing teeth, seldom encountered alone.',
    subDescription: 'Defend territory, harry, protect pack, surround, trail',
    difficulty: '12',
    thresholds: [5, 9],
    hp: 4,
    stress: 3,
    attack: '+2',
    weapon: 'Claws',
    distance: 'Melee',
    damageAmount: '1d6+2',
    damageType: 'physical',
    experience: 'Keen Senses +3',
    features: [
      {
        name: 'Pack Tactics',
        type: 'passive',
        description:
          'If the Wolf makes a successful standard attack and another Dire Wolf is within Melee range of the target, deal 1d6+5 physical damage instead of their standard damage and you gain a Fear.',
      },
      {
        name: 'Hobbling Strike',
        type: 'action',
        description:
          'Mark a Stress to make an attack against a target within Melee range. On a success, deal 3d4+10 direct physical damage and make them Vulnerable until they clear at least 1 HP.',
      },
    ],
  },
  {
    name: 'Giant Mosquitoes',
    tier: 1,
    subtype: 'Horde (5/HP)',
    description:
      'Dozens of fist-sized mosquitoes, flying together for protection.',
    subDescription: 'Fly away, harass, steal blood',
    difficulty: '10',
    thresholds: [5, 9],
    hp: 6,
    stress: 3,
    attack: '-2',
    weapon: 'Proboscis',
    distance: 'Melee',
    damageAmount: '1d8+3',
    damageType: 'physical',
    experience: 'Camouflage +2',
    features: [
      {
        name: 'Horde (1d4+1)',
        type: 'passive',
        description:
          'When the Mosquitoes have marked half or more of their HP, their standard attack deals 1d4+1 physical damage instead.',
      },
      {
        name: 'Flying',
        type: 'passive',
        description:
          'While flying, the Mosquitoes have a +2 bonus to their Difficulty.',
      },
      {
        name: 'Bloodsucker',
        type: 'reaction',
        description:
          "When the Mosquitoes' attack causes a target to mark HP, you can mark a Stress to force the target to mark an additional HP.",
      },
    ],
  },
  {
    name: 'Giant Rat',
    tier: 1,
    subtype: 'Minion',
    description: 'A cat-sized rodent skilled at scavenging and survival.',
    subDescription: 'Burrow, hunger, scavenge, wear down',
    difficulty: '10',
    hp: 1,
    stress: 1,
    attack: '-4',
    weapon: 'Claws',
    distance: 'Melee',
    damageAmount: '1',
    damageType: 'physical',
    experience: 'Keen Senses +3',
    features: [
      {
        name: 'Minion (3)',
        type: 'passive',
        description:
          'The Rat is defeated when they take any damage. For every 3 damage a PC deals to the Rat, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Giant Rats within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 1 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Giant Scorpion',
    tier: 1,
    subtype: 'Bruiser',
    description:
      'A human-sized arachnid with tearing claws and a stinging tail.',
    subDescription: 'Ambush, feed, grapple, poison',
    difficulty: '13',
    thresholds: [7, 13],
    hp: 6,
    stress: 3,
    attack: '+1',
    weapon: 'Pincers',
    distance: 'Melee',
    damageAmount: '1d12+2',
    damageType: 'physical',
    experience: 'Camouflage +2',
    features: [
      {
        name: 'Double Strike',
        type: 'action',
        description:
          'Mark a Stress to make a standard attack against two targets within Melee range.',
      },
      {
        name: 'Venomous Stinger',
        type: 'action',
        description:
          'Make an attack against a target within Very Close range. On a success, spend a Fear to deal 1d4+4 physical damage and Poison them until their next rest or they succeed on a Knowledge Roll (16). While Poisoned, the target must roll a d6 before they make an action roll. On a result of 4 or lower, they must mark a Stress.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Scorpion makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Glass Snake',
    tier: 1,
    subtype: 'Standard',
    description:
      'A clear serpent with a massive head that leaves behind a glass shard trail wherever they go.',
    subDescription: 'Climb, feed, keep distance, scare',
    difficulty: '14',
    thresholds: [6, 10],
    hp: 5,
    stress: 3,
    attack: '+2',
    weapon: 'Glass Fangs',
    distance: 'Very Close',
    damageAmount: '1d8+2',
    damageType: 'physical',
    features: [
      {
        name: 'Armor-Shredding Shards',
        type: 'passive',
        description:
          "After a successful attack against the Snake within Melee range, the attacker must mark an Armor Slot. If they can't mark an Armor Slot, they must mark an HP.",
      },
      {
        name: 'Spinning Serpent',
        type: 'action',
        description:
          'Mark a Stress to make an attack against all targets within Very Close range. Targets the Snake succeeds against take 1d6+1 physical damage.',
      },
      {
        name: 'Spitter',
        type: 'action',
        description:
          'Spend a Fear to introduce a d6 Spitter Die. When the Snake is in the spotlight, roll this die. On a result of 5 or higher, all targets in front of the Snake within Far range must succeed on an Agility Reaction Roll or take 1d4 physical damage. The Snake can take the spotlight a second time this GM turn.',
      },
    ],
  },
  {
    name: 'Green Ooze',
    tier: 1,
    subtype: 'Skulk',
    description: 'A moving mound of translucent green slime.',
    subDescription: 'Camouflage, consume and multiply, creep up, envelop',
    difficulty: '8',
    thresholds: [5, 10],
    hp: 5,
    stress: 2,
    attack: '+1',
    weapon: 'Ooze Appendage',
    distance: 'Melee',
    damageAmount: '1d6+1',
    damageType: 'magic',
    experience: 'Camouflage +3',
    features: [
      {
        name: 'Slow',
        type: 'passive',
        description:
          "When you spotlight the Ooze and they don't have a token on their stat block, they can't act yet. Place a token on their stat block and describe what they're preparing to do. When you spotlight the Ooze and they have a token on their stat block, clear the token and they can act.",
      },
      {
        name: 'Acidic Form',
        type: 'passive',
        description:
          "When the Ooze makes a successful attack, the target must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP.",
      },
      {
        name: 'Envelop',
        type: 'action',
        description:
          'Make a standard attack against a target within Melee range. On a success, the Ooze envelops them and the target must mark 2 Stress. The target must mark an additional Stress when they make an action roll. If the Ooze takes Severe damage, the target is freed.',
      },
      {
        name: 'Split',
        type: 'reaction',
        description:
          'When the Ooze has 3 or more HP marked, you can spend a Fear to split them into two Tiny Green Oozes (with no marked HP or Stress). Immediately spotlight both of them.',
      },
    ],
  },
  {
    name: 'Harrier',
    tier: 1,
    subtype: 'Standard',
    description: 'A nimble fighter armed with javelins.',
    subDescription: 'Flank, harry, kite, profit',
    difficulty: '12',
    thresholds: [5, 9],
    hp: 3,
    stress: 3,
    attack: '+1',
    weapon: 'Javelin',
    distance: 'Close',
    damageAmount: '1d6+2',
    damageType: 'physical',
    experience: 'Camouflage +2',
    features: [
      {
        name: 'Maintain Distance',
        type: 'passive',
        description:
          'After making a standard attack, the Harrier can move anywhere within Far range.',
      },
      {
        name: 'Fall Back',
        type: 'reaction',
        description:
          'When a creature moves into Melee range to make an attack, you can mark a Stress before the attack roll to move anywhere within Close range and make an attack against that creature. On a success, deal 1d10+2 physical damage.',
      },
    ],
  },
  {
    name: 'Head Guard',
    tier: 1,
    subtype: 'Leader',
    description:
      'A seasoned guard with a mace, a whistle, and a bellowing voice.',
    subDescription: 'Arrest, close gates, pin down, seek glory',
    difficulty: '15',
    thresholds: [7, 13],
    hp: 7,
    stress: 3,
    attack: '+4',
    weapon: 'Mace',
    distance: 'Melee',
    damageAmount: '1d10+4',
    damageType: 'physical',
    experience: 'Commander +2, Local Knowledge +2',
    features: [
      {
        name: 'Rally Guards',
        type: 'action',
        description:
          'Spend 2 Fear to spotlight the Head Guard and up to 2d4 allies within Far range.',
      },
      {
        name: 'On My Signal',
        type: 'reaction',
        description:
          'When the Head Guard is in the spotlight for the first time, activate the countdown. It ticks down when a PC makes an attack roll. When it triggers, all Archer Guards within Far range make a standard attack with advantage against the nearest target within their range. If any attacks succeed on the same target, combine their damage.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Head Guard makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Jagged Knife Bandit',
    tier: 1,
    subtype: 'Standard',
    description:
      "A cunning criminal in a cloak bearing one of the gang's iconic knives.",
    subDescription: 'Escape, profit, steal, throw smoke',
    difficulty: '12',
    thresholds: [8, 14],
    hp: 5,
    stress: 3,
    attack: '+1',
    weapon: 'Daggers',
    distance: 'Melee',
    damageAmount: '1d8+1',
    damageType: 'physical',
    experience: 'Thief +2',
    features: [
      {
        name: 'Climber',
        type: 'passive',
        description: 'The Bandit climbs just as easily as they run.',
      },
      {
        name: 'From Above',
        type: 'passive',
        description:
          'When the Bandit succeeds on a standard attack from above a target, they deal 1d10+1 physical damage instead of their standard damage.',
      },
    ],
  },
  {
    name: 'Jagged Knife Hexer',
    tier: 1,
    subtype: 'Support',
    description:
      'A staff-wielding bandit in a cloak adorned with magical paraphernalia, using curses to vex their foes.',
    subDescription: 'Command, hex, profit',
    difficulty: '13',
    thresholds: [5, 9],
    hp: 4,
    stress: 4,
    attack: '+2',
    weapon: 'Staff',
    distance: 'Far',
    damageAmount: '1d6+2',
    damageType: 'magic',
    experience: 'Magical Knowledge +2',
    features: [
      {
        name: 'Curse',
        type: 'action',
        description:
          'Choose a target within Far range and temporarily Curse them. While the target is Cursed, you can mark a Stress when that target rolls with Hope to make the roll be with Fear instead.',
      },
      {
        name: 'Chaotic Flux',
        type: 'action',
        description:
          'Make an attack against up to three targets within Very Close range. Mark a Stress to deal 2d6+3 magic damage to targets the Hexer succeeded against.',
      },
    ],
  },
  {
    name: 'Jagged Knife Kneebreaker',
    tier: 1,
    subtype: 'Bruiser',
    description: 'An imposing brawler carrying a large club.',
    subDescription: 'Grapple, intimidate, profit, steal',
    difficulty: '12',
    thresholds: [7, 14],
    hp: 7,
    stress: 4,
    attack: '-3',
    weapon: 'Club',
    distance: 'Melee',
    damageAmount: '1d4+6',
    damageType: 'physical',
    experience: 'Thief +2, Unveiled Threats +3',
    features: [
      {
        name: "I've Got 'Em",
        type: 'passive',
        description:
          'Creatures Restrained by the Kneebreaker take double damage from attacks by other adversaries.',
      },
      {
        name: 'Hold Them Down',
        type: 'action',
        description:
          'Make an attack against a target within Melee range. On a success, the target takes no damage but is Restrained and Vulnerable. The target can break free, clearing both conditions, with a successful Strength Roll or is freed automatically if the Kneebreaker takes Major or greater damage.',
      },
    ],
  },
  {
    name: 'Jagged Knife Lackey',
    tier: 1,
    subtype: 'Minion',
    description:
      'A thief with simple clothes and small daggers, eager to prove themselves.',
    subDescription: 'Escape, profit, throw smoke',
    difficulty: '9',
    hp: 1,
    stress: 1,
    attack: '-2',
    weapon: 'Daggers',
    distance: 'Melee',
    damageAmount: '2',
    damageType: 'physical',
    experience: 'Thief +2',
    features: [
      {
        name: 'Minion (3)',
        type: 'passive',
        description:
          'The Lackey is defeated when they take any damage. For every 3 damage a PC deals to the Lackey, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Jagged Knife Lackeys within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 2 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Jagged Knife Lieutenant',
    tier: 1,
    subtype: 'Leader',
    description:
      'A seasoned bandit in quality leathers with a strong voice and cunning eyes.',
    subDescription: 'Bully, command, profit, reinforce',
    difficulty: '13',
    thresholds: [7, 14],
    hp: 6,
    stress: 3,
    attack: '+2',
    weapon: 'Javelin',
    distance: 'Close',
    damageAmount: '1d8+3',
    damageType: 'physical',
    experience: 'Local Knowledge +2',
    features: [
      {
        name: 'Tactician',
        type: 'action',
        description:
          'When you spotlight the Lieutenant, mark a Stress to also spotlight two allies within Close range.',
      },
      {
        name: 'More Where That Came From',
        type: 'action',
        description:
          'Summon three Jagged Knife Lackeys, who appear at Far range.',
      },
      {
        name: 'Coup de Grace',
        type: 'action',
        description:
          'Spend a Fear to make an attack against a Vulnerable target within Close range. On a success, deal 2d6+12 physical damage and the target must mark a Stress.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Lieutenant makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Jagged Knife Shadow',
    tier: 1,
    subtype: 'Skulk',
    description:
      'A nimble scoundrel bearing a wicked knife and utilizing shadow magic to isolate targets.',
    subDescription: 'Ambush, conceal, divide, profit',
    difficulty: '12',
    thresholds: [4, 8],
    hp: 3,
    stress: 3,
    attack: '+1',
    weapon: 'Daggers',
    distance: 'Melee',
    damageAmount: '1d4+4',
    damageType: 'physical',
    experience: 'Intrusion +3',
    features: [
      {
        name: 'Backstab',
        type: 'passive',
        description:
          'When the Shadow succeeds on a standard attack that has advantage, they deal 1d6+6 physical damage instead of their standard damage.',
      },
      {
        name: 'Cloaked',
        type: 'action',
        description:
          "Become Hidden until after the Shadow's next attack. Attacks made while Hidden from this feature have advantage.",
      },
    ],
  },
  {
    name: 'Jagged Knife Sniper',
    tier: 1,
    subtype: 'Ranged',
    description: 'A lanky bandit striking from cover with a shortbow.',
    subDescription: 'Ambush, hide, profit, reposition',
    difficulty: '13',
    thresholds: [4, 7],
    hp: 3,
    stress: 2,
    attack: '-1',
    weapon: 'Shortbow',
    distance: 'Far',
    damageAmount: '1d10+2',
    damageType: 'physical',
    experience: 'Stealth +2',
    features: [
      {
        name: 'Unseen Strike',
        type: 'passive',
        description:
          'If the Sniper is Hidden when they make a successful standard attack against a target, they deal 1d10+4 physical damage instead of their standard damage.',
      },
    ],
  },
  {
    name: 'Merchant',
    tier: 1,
    subtype: 'Social',
    description: 'A finely dressed trader with a keen eye for financial gain.',
    subDescription:
      'Buy low and sell high, create demand, inflate prices, seek profit',
    difficulty: '12',
    thresholds: [4, 8],
    hp: 3,
    stress: 3,
    attack: '-4',
    weapon: 'Club',
    distance: 'Melee',
    damageAmount: '1d4+1',
    damageType: 'physical',
    experience: 'Shrewd Negotiator +3',
    features: [
      {
        name: 'Preferential Treatment',
        type: 'passive',
        description:
          'A PC who succeeds on a Presence Roll against the Merchant gains a discount on purchases. A PC who fails on a Presence Roll against the Merchant must pay more and has disadvantage on future Presence Rolls against the Merchant.',
      },
      {
        name: 'The Runaround',
        type: 'passive',
        description:
          'When a PC rolls a 14 or lower on a Presence Roll made against the Merchant, they must mark a Stress.',
      },
    ],
  },
  {
    name: 'Minor Chaos Elemental',
    tier: 1,
    subtype: 'Solo',
    description: 'A coruscating mass of uncontrollable magic.',
    subDescription: 'Confound, destabilize, transmogrify',
    difficulty: '14',
    thresholds: [7, 14],
    hp: 7,
    stress: 3,
    attack: '+3',
    weapon: 'Warp Blast',
    distance: 'Close',
    damageAmount: '1d12+6',
    damageType: 'magic',
    features: [
      {
        name: 'Arcane Form',
        type: 'passive',
        description: 'The Elemental is resistant to magic damage.',
      },
      {
        name: 'Sickening Flux',
        type: 'action',
        description:
          'Mark a HP to force all targets within Close range to mark a Stress and become Vulnerable until their next rest or they clear a HP.',
      },
      {
        name: 'Remake Reality',
        type: 'action',
        description:
          'Spend a Fear to transform the area within Very Close range into a different biome. All targets within this area take 2d6+3 direct magic damage.',
      },
      {
        name: 'Magical reflection',
        type: 'reaction',
        description:
          'When the Elemental takes damage from an attack within Close range, deal an amount of damage to the attacker equal to half the damage they dealt.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Elemental makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Minor Demon',
    tier: 1,
    subtype: 'Solo',
    description:
      'A crimson-hued creature from the Circles Below, consumed by rage against all mortals.',
    subDescription: 'Act erratically, corral targets, relish pain, torment',
    difficulty: '14',
    thresholds: [8, 15],
    hp: 8,
    stress: 4,
    attack: '+3',
    weapon: 'Claws',
    distance: 'Melee',
    damageAmount: '1d8+6',
    damageType: 'physical',
    features: [
      {
        name: 'Relentless (2)',
        type: 'passive',
        description:
          'The Demon can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'All Must Fall',
        type: 'passive',
        description:
          'When a PC rolls a failure with Fear while within Close range of the Demon, they lose a Hope.',
      },
      {
        name: 'Hellfire',
        type: 'action',
        description:
          'Spend a Fear to rain down hellfire within Far range. All targets within the area must make an Agility Reaction Roll. Targets who fail take 1d20+3 magic damage. Targets who succeed take half damage.',
      },
      {
        name: 'Reaper',
        type: 'reaction',
        description:
          "Before rolling damage for the Demon's attack, you can mark a Stress to gain a bonus to the damage roll equal to the Demon's current number of marked HP.",
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Demon makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Minor Fire Elemental',
    tier: 1,
    subtype: 'Solo',
    description: 'A living flame the size of a large bonfire.',
    subDescription: 'Encircle enemies, grow in size, intimidate, start fires',
    difficulty: '13',
    thresholds: [7, 15],
    hp: 9,
    stress: 3,
    attack: '+3',
    weapon: 'Elemental Blast',
    distance: 'Far',
    damageAmount: '1d10+4',
    damageType: 'magic',
    features: [
      {
        name: 'Relentless (2)',
        type: 'passive',
        description:
          'The Elemental can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Scorched Earth',
        type: 'action',
        description:
          'Mark a Stress to choose a point within Far range. The ground within Very Close range of that point immediately bursts into flames. All creatures within this area must make an Agility Reaction Roll. Targets who fail take 2d8 magic damage from the flames. Targets who succeed take half damage.',
      },
      {
        name: 'Explosion',
        type: 'action',
        description:
          'Spend a Fear to erupt in a fiery explosion. Make an attack against all targets within Close range. Targets the Elemental succeeds against take 1d8 magic damage and are knocked back to Far range.',
      },
      {
        name: 'Consume Kindling',
        type: 'reaction',
        description:
          'Three times per scene, when the Elemental moves onto objects that are highly flammable, consume them to clear a HP or a Stress.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Elemental makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Minor Treant',
    tier: 1,
    subtype: 'Minion',
    description: 'An ambulatory sapling rising up to defend their forest.',
    subDescription: 'Crush, overwhelm, protect',
    difficulty: '10',
    hp: 1,
    stress: 1,
    attack: '-2',
    weapon: 'Clawed Branch',
    distance: 'Melee',
    damageAmount: '4',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (5)',
        type: 'passive',
        description:
          'The Treant is defeated when they take any damage. For every 5 damage a PC deals to the Treant, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Minor Treants within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 4 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'OUTER REALMS CORRUPTER',
    tier: 1,
    subtype: '',
    description: '',
    subDescription: '',
    difficulty: '',
    hp: 0,
    stress: 0,
    attack: '',
    weapon: '',
    distance: '',
    damageAmount: '',
    damageType: '',
    features: [],
  },
  {
    name: 'Patchwork Zombie Hulk',
    tier: 1,
    subtype: 'Solo',
    description:
      'A towering gestalt of corpses moving as one, with torso-sized limbs and fists as large as a grown halfling.',
    subDescription: 'Absorb corpses, flail, hunger, terrify',
    difficulty: '13',
    thresholds: [8, 15],
    hp: 10,
    stress: 3,
    attack: '+4',
    weapon: 'Too Many Arms',
    distance: 'Very Close',
    damageAmount: '1d20',
    damageType: 'physical',
    experience: 'Intimidation +2, Tear Things Apart +2',
    features: [
      {
        name: 'Destructible',
        type: 'passive',
        description:
          'When the Zombie takes Major or greater damage, they mark an additional HP.',
      },
      {
        name: 'Flailing Limbs',
        type: 'passive',
        description:
          'When the Zombie makes a standard attack, they can attack all targets within Very Close range.',
      },
      {
        name: 'Another for the Pile',
        type: 'action',
        description:
          'When the Zombie is within Very Close range of a corpse, they can incorporate it into themselves, clearing a HP and a Stress.',
      },
      {
        name: 'Tormented Screams',
        type: 'action',
        description:
          'Mark a Stress to cause all PCs within Far range to make a Presence Reaction Roll (13). Targets who fail lose a Hope and you gain a Fear for each. Targets who succeed must mark a Stress.',
      },
    ],
  },
  {
    name: 'Petty Noble',
    tier: 1,
    subtype: 'Social',
    description:
      'A richly dressed and adorned aristocrat brimming with hubris.',
    subDescription: 'Abuse power, gather resources, mobilize minions',
    difficulty: '14',
    thresholds: [6, 10],
    hp: 3,
    stress: 5,
    attack: '-3',
    weapon: 'Rapier',
    distance: 'Melee',
    damageAmount: '1d6+1',
    damageType: 'physical',
    experience: 'Aristocrat +3',
    features: [
      {
        name: 'My Land, My Rules',
        type: 'passive',
        description:
          'All social actions made against the Noble on their land have disadvantage.',
      },
      {
        name: 'Guards, Seize Them!',
        type: 'action',
        description:
          "Once per scene, mark a Stress to summon 1d4 Bladed Guards, who appear at Far range to enforce the Noble's will.",
      },
      {
        name: 'Exile',
        type: 'action',
        description:
          "Spend a Fear and target a PC. The Noble proclaims that the target and their allies are exiled from the noble's territory. While exiled, the target and their allies have disadvantage during social situations within the Noble's domain.",
      },
    ],
  },
  {
    name: 'Pirate Captain',
    tier: 1,
    subtype: 'Leader',
    description:
      'A charismatic sea dog with an impressive hat, eager to raid and plunder.',
    subDescription: "Command, make 'em walk the plank, plunder, raid",
    difficulty: '14',
    thresholds: [7, 14],
    hp: 7,
    stress: 5,
    attack: '+4',
    weapon: 'Cutlass',
    distance: 'Melee',
    damageAmount: '1d12+2',
    damageType: 'physical',
    experience: 'Commander +2, Sailor +3',
    features: [
      {
        name: 'Swashbuckler',
        type: 'passive',
        description:
          'When the Captain marks 2 or fewer HP from an attack within Melee range, the attacker must mark a Stress.',
      },
      {
        name: 'Reinforcements',
        type: 'action',
        description:
          'Once per scene, mark a Stress to summon a Pirate Raiders Horde, which appears at Far range.',
      },
      {
        name: 'No Quarter',
        type: 'action',
        description:
          'Spend a Fear to choose a target who has three or more Pirates within Melee range of them. The Captain leads the Pirates in hurling threats and promises of a watery grave. The target must make a Presence Reaction Roll. On a failure, the target marks 1d4+1 Stress. On a success, they must mark a Stress.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Captain makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Pirate Raiders',
    tier: 1,
    subtype: 'Horde (3/HP)',
    description: 'Seafaring scoundrels moving in a ravaging pack.',
    subDescription: 'Gang up, plunder, raid',
    difficulty: '12',
    thresholds: [5, 11],
    hp: 4,
    stress: 3,
    attack: '+1',
    weapon: 'Cutlass',
    distance: 'Melee',
    damageAmount: '1d8+2',
    damageType: 'physical',
    experience: 'Sailor +3',
    features: [
      {
        name: 'Horde (1d4+1)',
        type: 'passive',
        description:
          'When the Raiders have marked half or more of their HP, their standard attack deals 1d4+1 physical damage instead.',
      },
      {
        name: 'Swashbuckler',
        type: 'passive',
        description:
          'When the Raiders mark 2 or fewer HP from an attack within Melee range, the attacker must mark a Stress.',
      },
    ],
  },
  {
    name: 'Pirate Tough',
    tier: 1,
    subtype: 'Bruiser',
    description:
      'A thickly muscled and tattooed pirate with melon-sized fists.',
    subDescription: 'Plunder, raid, smash, terrorize',
    difficulty: '13',
    thresholds: [8, 15],
    hp: 5,
    stress: 3,
    attack: '+1',
    weapon: 'Massive Fists',
    distance: 'Melee',
    damageAmount: '2d6',
    damageType: 'physical',
    experience: 'Sailor +2',
    features: [
      {
        name: 'Swashbuckler',
        type: 'passive',
        description:
          'When the Tough marks 2 or fewer HP from an attack within Melee range, the attacker must mark a Stress.',
      },
      {
        name: 'Clear the Decks',
        type: 'action',
        description:
          'Make an attack against a target within Very Close range. On a success, mark a Stress to move into Melee range of the target, dealing 3d4 physical damage and knocking the target back to Close range.',
      },
    ],
  },
  {
    name: 'Red Ooze',
    tier: 1,
    subtype: 'Skulk',
    description: 'A moving mound of translucent flaming red slime.',
    subDescription: 'Camouflage, consume and multiply, ignite, start fires',
    difficulty: '10',
    thresholds: [6, 11],
    hp: 5,
    stress: 3,
    attack: '+1',
    weapon: 'Ooze Appendage',
    distance: 'Melee',
    damageAmount: '1d8+3',
    damageType: 'magic',
    experience: 'Camouflage +3',
    features: [
      {
        name: 'Creeping Fire',
        type: 'passive',
        description:
          'The Ooze can only move within Very Close range as their normal movement. They light any flammable object they touch on fire.',
      },
      {
        name: 'Ignite',
        type: 'action',
        description:
          "Make an attack against a target within Very Close range. On a success, the target takes 1d8 magic damage and is Ignited until they're extinguished with a successful Finesse Roll (14). While Ignited, the target takes 1d4 magic damage when they make an action roll.",
      },
      {
        name: 'Split',
        type: 'reaction',
        description:
          'When the Ooze has 3 or more HP marked, you can spend a Fear to split them into two Tiny Red Oozes (with no marked HP or Stress). Immediately spotlight both of them.',
      },
    ],
  },
  {
    name: 'Rotted Zombie',
    tier: 1,
    subtype: 'Minion',
    description: 'A decaying corpse ambling toward their prey.',
    subDescription: 'Eat flesh, hunger, maul, surround',
    difficulty: '8',
    hp: 1,
    stress: 1,
    attack: '-3',
    weapon: 'Bite',
    distance: 'Melee',
    damageAmount: '2',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (3)',
        type: 'passive',
        description:
          'The Zombie is defeated when they take any damage. For every 3 damage a PC deals to the Zombie, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Rotted Zombies within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 2 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Sellsword',
    tier: 1,
    subtype: 'Minion',
    description: 'An armed mercenary testing their luck.',
    subDescription: 'Charge, lacerate, overwhelm, profit',
    difficulty: '10',
    hp: 1,
    stress: 1,
    attack: '+3',
    weapon: 'Longsword',
    distance: 'Melee',
    damageAmount: '3',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (4)',
        type: 'passive',
        description:
          'The Sellsword is defeated when they take any damage. For every 4 damage a PC deals to the Sellsword, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Sellswords within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 3 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Shambling Zombie',
    tier: 1,
    subtype: 'Standard',
    description:
      'An animated corpse that moves shakily, driven only by hunger.',
    subDescription: 'Devour, hungry, mob enemy, shred flesh',
    difficulty: '10',
    thresholds: [4, 6],
    hp: 4,
    stress: 1,
    attack: '+0',
    weapon: 'Bite',
    distance: 'Melee',
    damageAmount: '1d6+1',
    damageType: 'physical',
    features: [
      {
        name: 'Too Many to Handle',
        type: 'passive',
        description:
          'When the Zombie is within Melee range of a creature and at least one other Zombie is within Close range, all attacks against that creature have advantage.',
      },
      {
        name: 'Horrifying',
        type: 'passive',
        description:
          "Targets who mark HP from the Zombie's attacks must also mark a Stress.",
      },
    ],
  },
  {
    name: 'Skeleton Archer',
    tier: 1,
    subtype: 'Ranged',
    description: 'A fragile skeleton with a shortbow and arrows.',
    subDescription: 'Perforate distracted targets, play dead, steal skin',
    difficulty: '9',
    thresholds: [4, 7],
    hp: 3,
    stress: 2,
    attack: '+2',
    weapon: 'Shortbow',
    distance: 'Far',
    damageAmount: '1d8+1',
    damageType: 'physical',
    features: [
      {
        name: 'Opportunist',
        type: 'passive',
        description:
          'When two or more adversaries are within Very Close range of a creature, all damage the Archer deals to that creature is doubled.',
      },
      {
        name: 'Deadly Shot',
        type: 'action',
        description:
          'Make an attack against a Vulnerable target within Far range. On a success, mark a Stress to deal 3d4+8 physical damage.',
      },
    ],
  },
  {
    name: 'Skeleton Dredge',
    tier: 1,
    subtype: 'Minion',
    description: 'A clattering pile of bones.',
    subDescription: 'Fall apart, overwhelm, play dead, steal skin',
    difficulty: '8',
    hp: 1,
    stress: 1,
    attack: '-1',
    weapon: 'Bone Claws',
    distance: 'Melee',
    damageAmount: '1',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (4)',
        type: 'passive',
        description:
          'The Dredge is defeated when they take any damage. For every 4 damage a PC deals to the Dredge, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Dredges within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 1 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Skeleton Knight',
    tier: 1,
    subtype: 'Bruiser',
    description: 'A large armored skeleton with a huge blade.',
    subDescription: 'Cut down the living, steal skin, wreak havoc',
    difficulty: '13',
    thresholds: [7, 13],
    hp: 5,
    stress: 2,
    attack: '+2',
    weapon: 'Rusty Greatsword',
    distance: 'Melee',
    damageAmount: '1d10+2',
    damageType: 'physical',
    features: [
      {
        name: 'Terrifying',
        type: 'passive',
        description:
          'When the Knight makes a successful attack, all PCs within Close range lose a Hope and you gain a Fear.',
      },
      {
        name: 'Cut to the Bone',
        type: 'action',
        description:
          'Mark a Stress to make an attack against all targets within Very Close range. Targets the Knight succeeds against take 1d8+2 physical damage and must mark a Stress.',
      },
      {
        name: 'Dig Two Graves',
        type: 'reaction',
        description:
          'When the Knight is defeated, they make an attack against a target within Very Close range (prioritizing the creature who killed them). On a success, the target takes 1d4+8 physical damage and loses 1d4 Hope.',
      },
    ],
  },
  {
    name: 'Skeleton Warrior',
    tier: 1,
    subtype: 'Standard',
    description: 'A dirt-covered skeleton armed with a rusted blade.',
    subDescription: 'Feign death, gang up, steal skin',
    difficulty: '10',
    thresholds: [4, 8],
    hp: 3,
    stress: 2,
    attack: '+0',
    weapon: 'Sword',
    distance: 'Melee',
    damageAmount: '1d6+2',
    damageType: 'physical',
    features: [
      {
        name: 'Only Bones',
        type: 'passive',
        description: 'The Warrior is resistant to physical damage.',
      },
      {
        name: "Won't Stay Dead",
        type: 'reaction',
        description:
          'When the Warrior is defeated, you can spotlight them and roll a d6. On a result of 6, if there are other adversaries on the battlefield, the Warrior re-forms with no marked HP.',
      },
    ],
  },
  {
    name: 'Spellblade',
    tier: 1,
    subtype: 'Leader',
    description: 'A mercenary combining swordplay and magic to deadly effect.',
    subDescription: 'Blast, command, endure',
    difficulty: '14',
    thresholds: [8, 14],
    hp: 6,
    stress: 3,
    attack: '+3',
    weapon: 'Empowered Longsword',
    distance: 'Melee',
    damageAmount: '1d8+4',
    damageType: 'phy/mag',
    experience: 'Magical Knowledge +2',
    features: [
      {
        name: 'Arcane Steel',
        type: 'passive',
        description:
          "Damage dealt by the Spellblade's standard attack is considered both physical and magic.",
      },
      {
        name: 'Suppressing Blast',
        type: 'action',
        description:
          'Mark a Stress and target a group within Far range. All targets must succeed on an Agility Reaction Roll or take 1d8+2 magic damage. You gain a Fear for each target who marked HP from this attack.',
      },
      {
        name: 'Move as a Unit',
        type: 'action',
        description:
          'Spend 2 Fear to spotlight up to five allies within Far range.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Spellblade makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Swarm of Rats',
    tier: 1,
    subtype: 'Horde (/HP)',
    description:
      'A skittering mass of ordinary rodents moving as one like a ravenous wave.',
    subDescription: 'Consume, obscure, swarm',
    difficulty: '10',
    thresholds: [6, 10],
    hp: 6,
    stress: 2,
    attack: '-3',
    weapon: 'Claws',
    distance: 'Melee',
    damageAmount: '1d8+2',
    damageType: 'physical',
    features: [
      {
        name: 'Horde (1d4+1)',
        type: 'passive',
        description:
          'When the Swarm has marked half or more of their HP, their standard attack deals 1d4+1 physical damage instead.',
      },
      {
        name: 'In Your Face',
        type: 'passive',
        description:
          'All targets within Melee range have disadvantage on attacks against targets other than the Swarm.',
      },
    ],
  },
  {
    name: 'Sylvan Soldier',
    tier: 1,
    subtype: 'Standard',
    description: 'A faerie warrior adorned in armor made of leaves and bark.',
    subDescription: 'Ambush, hide, overwhelm, protect, trail',
    difficulty: '11',
    thresholds: [6, 11],
    hp: 4,
    stress: 2,
    attack: '+0',
    weapon: 'Scythe',
    distance: 'Melee',
    damageAmount: '1d8+1',
    damageType: 'physical',
    experience: 'Tracker +2',
    features: [
      {
        name: 'Pack Tactics',
        type: 'passive',
        description:
          'If the Soldier makes a standard attack and another Sylvan Soldier is within Melee range of the target, deal 1d8+5 physical damage instead of their standard damage.',
      },
      {
        name: 'Forest Control',
        type: 'action',
        description:
          'Spend a Fear to pull down a tree within Close range. A creature hit by the tree must succeed on an Agility Reaction Roll (15) or take 1d10 physical damage.',
      },
      {
        name: 'Blend In',
        type: 'reaction',
        description:
          "When the Soldier makes a successful attack, you can mark a Stress to become Hidden until the Soldier's next attack or a PC succeeds on an Instinct Roll (14) to find them.",
      },
    ],
  },
  {
    name: 'Tangle Bramble',
    tier: 1,
    subtype: 'Minion',
    description: 'An animate, blood-drinking tumbleweed.',
    subDescription: 'Combine, drain, entangle',
    difficulty: '11',
    hp: 1,
    stress: 1,
    attack: '-1',
    weapon: 'Thorns',
    distance: 'Melee',
    damageAmount: '2',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (4)',
        type: 'passive',
        description:
          'The Bramble is defeated when they take any damage. For every 4 damage a PC deals to the Tangle Bramble, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Tangle Brambles within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 2 physical damage each. Combine this damage.',
      },
      {
        name: 'Drain and Multiply',
        type: 'reaction',
        description:
          "When an attack from the Bramble causes a target to mark HP and there are three or more Tangle Bramble Minions within Close range, you can combine the Minions into a Tangle Bramble Swarm Horde. The Horde's HP is equal to the number of Minions combined.",
      },
    ],
  },
  {
    name: 'Tangle Bramble Swarm',
    tier: 1,
    subtype: 'Horde (3/HP)',
    description:
      'A cluster of animate, blood-drinking tumbleweeds, each the size of a large gourd.',
    subDescription: 'Digest, entangle, immobilize',
    difficulty: '12',
    thresholds: [6, 11],
    hp: 6,
    stress: 3,
    attack: '+0',
    weapon: 'Thorns',
    distance: 'Melee',
    damageAmount: '1d6+3',
    damageType: 'physical',
    experience: 'Camouflage +2',
    features: [
      {
        name: 'Horde (1d4+2)',
        type: 'passive',
        description:
          'When the Swarm has marked half or more of their HP, their standard attack deals 1d4+2 physical damage instead.',
      },
      {
        name: 'Crush',
        type: 'action',
        description:
          'Mark a Stress to deal 2d6+8 direct physical damage to a target with 3 or more bramble tokens.',
      },
      {
        name: 'Encumber',
        type: 'reaction',
        description:
          'When the Swarm succeeds on an attack, give the target a bramble token. If a target has any bramble tokens, they are Restrained. If a target has 3 or more bramble tokens, they are also Vulnerable. All bramble tokens can be removed by succeeding on a Finesse Roll (12 + the number of bramble tokens) or dealing Major or greater damage to the Swarm. If bramble tokens are removed from a target using a Finesse Roll, a number of Tangle Bramble Minions spawn within Melee range equal to the number of tokens removed.',
      },
    ],
  },
  {
    name: 'Tiny Green Ooze',
    tier: 1,
    subtype: 'Skulk',
    description: 'A small moving mound of translucent green slime.',
    subDescription: 'Camouflage, creep up',
    difficulty: '14',
    thresholds: [4, NaN],
    hp: 2,
    stress: 1,
    attack: '-1',
    weapon: 'Ooze Appendage',
    distance: 'Melee',
    damageAmount: '1d4+1',
    damageType: 'magic',
    features: [
      {
        name: 'Acidic Form',
        type: 'passive',
        description:
          "When the Ooze makes a successful attack, the target must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP.",
      },
    ],
  },
  {
    name: 'Tiny Red Ooze',
    tier: 1,
    subtype: 'Skulk',
    description: 'A small moving mound of translucent flaming red slime',
    subDescription: 'Blaze, Camouflage',
    difficulty: '11',
    thresholds: [5, NaN],
    hp: 2,
    stress: 1,
    attack: '-1',
    weapon: 'Ooze Appendage',
    distance: 'Melee',
    damageAmount: '1d4+2',
    damageType: 'magic',
    features: [
      {
        name: 'Burning',
        type: 'reaction',
        description:
          'When a creature within Melee range deals damage to the Ooze, they take 1d6 direct magic damage.',
      },
    ],
  },
  {
    name: 'Weaponmaster',
    tier: 1,
    subtype: 'Bruiser',
    description: 'A master-at-arms wielding a sword twice their size.',
    subDescription: 'Act first, aim for the weakest, intimidate',
    difficulty: '14',
    thresholds: [8, 15],
    hp: 6,
    stress: 3,
    attack: '+2',
    weapon: 'Claymore',
    distance: 'Very Close',
    damageAmount: '1d12+2',
    damageType: 'physical',
    features: [
      {
        name: 'Goading Strike',
        type: 'action',
        description:
          'Make a standard attack against a target. On a success, mark a Stress to Taunt the target until their next successful attack. The next time the Taunted target attacks, they have disadvantage against targets other than the Weaponmaster.',
      },
      {
        name: 'Adrenaline Burst',
        type: 'action',
        description: 'Once per scene, spend a Fear to clear 2 HP and 2 Stress.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Weaponmaster makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Young Dryad',
    tier: 1,
    subtype: 'Leader',
    description: "An imperious tree-person leading their forest's defenses.",
    subDescription: 'Command, nurture, prune the unwelcome',
    difficulty: '11',
    thresholds: [6, 11],
    hp: 6,
    stress: 2,
    attack: '+0',
    weapon: 'Scythe',
    distance: 'Melee',
    damageAmount: '1d8+5',
    damageType: 'physical',
    experience: 'Leadership +3',
    features: [
      {
        name: 'Voice of the Forest',
        type: 'action',
        description:
          'Mark a Stress to spotlight 1d4 allies within range of a target they can attack without moving. On a success, their attacks deal half damage.',
      },
      {
        name: 'Thorny Cage',
        type: 'action',
        description:
          "Spend a Fear to form a cage around a target within Very Close range and Restrain them until they're freed with a successful Strength Roll. When a creature makes an action roll against the cage, they must mark a Stress.",
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Dryad makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Zombie Pack',
    tier: 1,
    subtype: 'Horde (2/HP)',
    description: 'A group of shambling corpses instinctively moving together.',
    subDescription: 'Consume flesh, hunger, maul',
    difficulty: '8',
    thresholds: [6, 12],
    hp: 6,
    stress: 3,
    attack: '-1',
    weapon: 'Bite',
    distance: 'Melee',
    damageAmount: '1d10+2',
    damageType: 'physical',
    features: [
      {
        name: 'Horde (1d4+2)',
        type: 'passive',
        description:
          'When the Zombies have marked half or more of their HP, their standard attack deals 1d4+2 physical damage instead.',
      },
      {
        name: 'Overwhelm',
        type: 'reaction',
        description:
          'When the Zombies mark HP from an attack within Melee range, you can mark a Stress to make a standard attack against the attacker.',
      },
    ],
  },
  {
    name: 'Apprentice Assassin',
    tier: 2,
    subtype: 'Minion',
    description: 'A young trainee eager to prove themselves.',
    subDescription: 'Act reckless, kill, prove their worth, show off',
    difficulty: '13',
    hp: 1,
    stress: 1,
    attack: '-1',
    weapon: 'Thrown Dagger',
    distance: 'Very Close',
    damageAmount: '4',
    damageType: 'physical',
    experience: 'Intrusion +2',
    features: [
      {
        name: 'Minion (6)',
        type: 'passive',
        description:
          'The Assassin is defeated when they take any damage. For every 6 damage a PC deals to the Assassin, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Apprentice Assassins within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 4 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Archer Squadron',
    tier: 2,
    subtype: 'Horde (2/HP)',
    description: 'A group of trained archers bearing massive bows.',
    subDescription: 'Stick together, survive, volley fire',
    difficulty: '13',
    thresholds: [8, 16],
    hp: 4,
    stress: 3,
    attack: '+0',
    weapon: 'Longbow',
    distance: 'Far',
    damageAmount: '2d6+3',
    damageType: 'physical',
    features: [
      {
        name: 'Horde (1d6+3)',
        type: 'passive',
        description:
          'When the Squadron has marked half or more of their HP, their standard attack deals 1d6+3 physical damage instead.',
      },
      {
        name: 'Focused Volley',
        type: 'action',
        description:
          'Spend a Fear to target a point within Far range. Make an attack with advantage against all targets within Close range of that point. Targets the Squadron succeeds against take 1d10+4 physical damage.',
      },
      {
        name: 'Suppressing Fire',
        type: 'action',
        description:
          'Mark a Stress to target a point within Far range. Until the next roll with Fear, a creature who moves within Close range of that point must make an Agility Reaction Roll. On a failure, they take 2d6+3 physical damage. On a success, they take half damage.',
      },
    ],
  },
  {
    name: 'Assassin Poisoner',
    tier: 2,
    subtype: 'Skulk',
    description: 'A cunning scoundrel skilled in both poisons and ambushing.',
    subDescription: 'Anticipate, get paid, kill, taint food and water',
    difficulty: '14',
    thresholds: [8, 16],
    hp: 4,
    stress: 4,
    attack: '+3',
    weapon: 'Poisoned Throwing Dagger',
    distance: 'Close',
    damageAmount: '2d8+1',
    damageType: 'physical',
    experience: 'Intrusion +2',
    features: [
      {
        name: 'Grindletooth Venom',
        type: 'passive',
        description:
          "Targets who mark HP from the Assassin's attacks are Vulnerable until they clear a HP.",
      },
      {
        name: 'Out of Nowhere',
        type: 'passive',
        description:
          'The Assassin has advantage on attacks if they are Hidden.',
      },
      {
        name: 'Fumigation',
        type: 'action',
        description:
          'Drop a smoke bomb that fills the air within Close range with smoke, Dizzying all targets in this area. Dizzied targets have disadvantage on their next action roll, then clear the condition.',
      },
    ],
  },
  {
    name: 'Battle Box',
    tier: 2,
    subtype: 'Solo',
    description:
      'A cube-shaped construct with a different rune on each of their six sides.',
    subDescription: 'Change tactics, trample foes, wait in disguise',
    difficulty: '15',
    thresholds: [10, 20],
    hp: 8,
    stress: 6,
    attack: '+2',
    weapon: 'Slam',
    distance: 'Melee',
    damageAmount: '2d6+3',
    damageType: 'physical',
    experience: 'Camouflage +2',
    features: [
      {
        name: 'Relentless (2)',
        type: 'passive',
        description:
          'The Box can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Randomized Tactics',
        type: 'action',
        description:
          'Mark a Stress and roll a d6. The Box uses the corresponding move:',
        extra: `
        <ul class="list-outside list-disc pl-4">
        <li>1. Mana Beam. The Box fires a searing beam. Make an attack against a target within Far range. On a success, deal 2d10+2 magic damage.</li>
        <li>2. Fire Jets. The Box shoots into the air, spinning and releasing jets of flame. Make an attack against all targets within Close range. Targets the Box succeeds against take 2d8 physical damage.</li>
        <li>3. Trample. The Box rockets around erratically. Make an attack against all PCs within Close range. Targets the Box succeeds against take 1d6+5 physical damage and are Vulnerable until their next roll with Hope.</li>
        <li>4. Shocking Gas. The Box sprays out a silver gas sparking with lightning. All targets within Close range must succeed on a Finesse Reaction Roll or mark 3 Stress.</li>
        <li>5. Stunning Clap. The Box leaps and their sides clap, creating a small sonic boom. All targets within Very Close range must succeed on a Strength Reaction Roll or become Vulnerable until the cube is defeated.</li>
        <li>6. Psionic Whine. The Box releases a cluster of mechanical bees whose buzz rattles mortal minds. All targets within Close range must succeed on a Presence Reaction Roll or take 2d4+9 direct magic damage.</li>
        </ul>
        `,
      },
      {
        name: 'Overcharge',
        type: 'reaction',
        description:
          "Before rolling damage for the Box's attack, you can mark a Stress to add a d6 to the damage roll. Additionally, you gain a Fear.",
      },
      {
        name: 'Death Quake',
        type: 'reaction',
        description:
          'When the Box marks their last HP, the magic powering them ruptures in an explosion of force. All targets within Close range must succeed on an Instinct Reaction Roll or take 2d8+1 magic damage.',
      },
    ],
  },
  {
    name: 'Chaos Skull',
    tier: 2,
    subtype: 'Ranged',
    description: 'A floating humanoid skull animated by scintillating magic.',
    subDescription: 'Cackle, consume magic, serve creator',
    difficulty: '15',
    thresholds: [8, 16],
    hp: 5,
    stress: 4,
    attack: '+2',
    weapon: 'Energy Blast',
    distance: 'Close',
    damageAmount: '2d8+3',
    damageType: 'magic',
    features: [
      {
        name: 'Levitation',
        type: 'passive',
        description:
          "The Skull levitates several feet off the ground and can't be Restrained.",
      },
      {
        name: 'Wards',
        type: 'passive',
        description: 'The Skull is resistant to magic damage.',
      },
      {
        name: 'Magic Burst',
        type: 'action',
        description:
          'Mark a Stress to make an attack against all targets within Close range. Targets the Skull succeeds against take 2d6+4 magic damage.',
      },
      {
        name: 'Siphon Magic',
        type: 'action',
        description:
          'Spend a Fear to make an attack against a PC with a Spellcast trait within Very Close range. On a success, the target marks 1d4 Stress and the Skull clears that many Stress. Additionally, on a success, the Skull can immediately be spotlighted again.',
      },
    ],
  },
  {
    name: 'Conscript',
    tier: 2,
    subtype: 'Minion',
    description: 'A poorly trained civilian pressed into war.',
    subDescription: 'Follow orders, gang up, survive',
    difficulty: '12',
    hp: 1,
    stress: 1,
    attack: '+0',
    weapon: 'Spears',
    distance: 'Very Close',
    damageAmount: '6',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (6)',
        type: 'passive',
        description:
          'The Conscript is defeated when they take any damage. For every 6 damage a PC deals to the Conscript, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Conscripts within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 6 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Courtesan',
    tier: 2,
    subtype: 'Social',
    description: 'An accomplished manipulator and master of the social arts.',
    subDescription: 'Entice, maneuver, secure patrons',
    difficulty: '13',
    thresholds: [7, 13],
    hp: 3,
    stress: 4,
    attack: '-3',
    weapon: 'Dagger',
    distance: 'Melee',
    damageAmount: '1d4+3',
    damageType: 'physical',
    experience: 'Manipulation +3, Socialite +3',
    features: [
      {
        name: 'Searing Glance',
        type: 'reaction',
        description:
          "When a PC within Close range makes a Presence Roll, you can mark a Stress to cast a gaze toward the aftermath. On the target's failure, they must mark 2 Stress and are Vulnerable until the scene ends or they succeed on a social action against the Courtesan. On the target's success, they must mark a Stress.",
      },
    ],
  },
  {
    name: 'Cult Adept',
    tier: 2,
    subtype: 'Support',
    description: 'An experienced mage wielding shadow and fear.',
    subDescription: 'Curry favor, hinder foes, uncover knowledge',
    difficulty: '14',
    thresholds: [9, 18],
    hp: 4,
    stress: 6,
    attack: '+2',
    weapon: 'Rune-Covered Rod',
    distance: 'Far',
    damageAmount: '2d4+3',
    damageType: 'magic',
    experience: 'Fallen Lore +2, Rituals +2',
    features: [
      {
        name: 'Enervating Blast',
        type: 'action',
        description:
          'Spend a Fear to make a standard attack against a target within range. On a success, the target must mark a Stress.',
      },
      {
        name: 'Shroud of the Fallen',
        type: 'action',
        description:
          'Mark a Stress to wrap an ally within Close range in a shroud of Protection until the Adept marks their last HP. While Protected, the target has resistance to all damage.',
      },
      {
        name: 'Shadow Shackles',
        type: 'action',
        description:
          'Spend a Fear and choose a point within Far range. All targets within Close range of that point are Restrained in smoky chains until they break free with a successful Strength or Instinct Roll. A target Restrained by this feature must spend a Hope to make an action roll.',
      },
      {
        name: 'Fear Is Fuel',
        type: 'reaction',
        description:
          'Twice per scene, when a PC rolls a failure with Fear, clear a Stress.',
      },
    ],
  },
  {
    name: 'Cult Fang',
    tier: 2,
    subtype: 'Skulk',
    description: 'A professional killer-turned-cultist.',
    subDescription: 'Capture sacrifices, isolate prey, rise in the ranks',
    difficulty: '15',
    thresholds: [9, 17],
    hp: 4,
    stress: 4,
    attack: '+2',
    weapon: 'Long Knife',
    distance: 'Melee',
    damageAmount: '2d8+4',
    damageType: 'physical',
    features: [
      {
        name: "Shadow's Embrace",
        type: 'passive',
        description:
          'The Fang can climb and walk on vertical surfaces. Mark a Stress to move from one shadow to another within Far range.',
      },
      {
        name: 'Pick Off the Straggler',
        type: 'action',
        description:
          'Mark a Stress to cause a target within Melee range to make an Instinct Reaction Roll. On a failure, the target must mark 2 Stress and is teleported with the Fang to a shadow within Far range, making them temporarily Vulnerable. On a success, the target must mark a Stress.',
      },
    ],
  },
  {
    name: 'Cult Initiate',
    tier: 2,
    subtype: 'Minion',
    description: 'A low-ranking cultist in simple robes, eager to gain power.',
    subDescription: 'Follow orders, gain power, seek forbidden knowledge',
    difficulty: '13',
    hp: 1,
    stress: 1,
    attack: '+0',
    weapon: 'Ritual Dagger',
    distance: 'Melee',
    damageAmount: '5',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (6)',
        type: 'passive',
        description:
          'The Initiate is defeated when they take any damage. For every 6 damage a PC deals to the Initiate, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Cult Initiates within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 5 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Demonic Hound Pack',
    tier: 2,
    subtype: 'Horde (1/HP)',
    description: 'Unnatural hounds lit from within by hellfire.',
    subDescription: 'Cause fear, consume flesh, please masters',
    difficulty: '15',
    thresholds: [11, 23],
    hp: 6,
    stress: 3,
    attack: '+0',
    weapon: 'Claws and Fangs',
    distance: 'Melee',
    damageAmount: '2d8+2',
    damageType: 'physical',
    experience: 'Scent Tracking +3',
    features: [
      {
        name: 'Horde (2d4+1)',
        type: 'passive',
        description:
          'When the Pack has marked half or more of their HP, their standard attack deals 2d4+1 physical damage instead.',
      },
      {
        name: 'Dreadhowl',
        type: 'action',
        description:
          'Mark a Stress to make all targets within Very Close range lose a Hope. If a target is not able to lose a Hope, they must instead mark 2 Stress.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Pack makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Electric Eels',
    tier: 2,
    subtype: 'Horde (/HP)',
    description: 'A swarm of eels that encircle and electrocute.',
    subDescription: 'Avoid larger predators, shock prey, tear apart',
    difficulty: '14',
    thresholds: [10, 20],
    hp: 5,
    stress: 3,
    attack: '+0',
    weapon: 'Shocking Bite',
    distance: 'Melee',
    damageAmount: '2d6+4',
    damageType: 'physical',
    features: [
      {
        name: 'Horde (2d4+1)',
        type: 'passive',
        description:
          'When the Eels have marked half or more of their HP, their standard attack deals 2d4+1 physical damage instead.',
      },
      {
        name: 'Paralyzing Shock',
        type: 'action',
        description:
          'Mark a Stress to make a standard attack against all targets within Very Close range. You gain a Fear for each target that marks HP.',
      },
    ],
  },
  {
    name: 'Elite Soldier',
    tier: 2,
    subtype: 'Standard',
    description:
      'An armored squire or experienced commoner looking to advance.',
    subDescription: 'Gain glory, keep order, make alliances',
    difficulty: '15',
    thresholds: [9, 18],
    hp: 4,
    stress: 3,
    attack: '+1',
    weapon: 'Spear',
    distance: 'Very Close',
    damageAmount: '2d8+4',
    damageType: 'physical',
    features: [
      {
        name: 'Reinforce',
        type: 'action',
        description:
          'Mark a Stress to move into Melee range of an ally and make a standard attack against a target within Very Close range. On a success, deal 2d10+2 physical damage and the ally can clear a Stress.',
      },
      {
        name: "Vassal's Loyalty",
        type: 'reaction',
        description:
          'When the Soldier is within Very Close range of a knight or other noble who would take damage, you can mark a Stress to move into Melee range of them and take the damage instead.',
      },
    ],
  },
  {
    name: 'Failed Experiment',
    tier: 2,
    subtype: 'Standard',
    description:
      'A magical necromantic experiment gone wrong, leaving them warped and ungainly.',
    subDescription: 'Devour, hunt, track',
    difficulty: '13',
    thresholds: [12, 23],
    hp: 3,
    stress: 3,
    attack: '+1',
    weapon: 'Bite and Claw',
    distance: 'Melee',
    damageAmount: '2d6+5',
    damageType: 'physical',
    experience: 'Copycat +3',
    features: [
      {
        name: 'Warped Fortitude',
        type: 'passive',
        description: 'The Experiment is resistant to physical damage.',
      },
      {
        name: 'Overwhelm',
        type: 'passive',
        description:
          'When a target the Experiment attacks has other adversaries within Very Close range, the Experiment deals double damage.',
      },
      {
        name: 'Lurching Lunge',
        type: 'action',
        description:
          'Mark a Stress to spotlight the Experiment as an additional GM move instead of spending Fear.',
      },
    ],
  },
  {
    name: 'Giant Beastmaster',
    tier: 2,
    subtype: 'Leader',
    description: 'A leather-clad warrior bearing a whip and massive bow.',
    subDescription:
      'Command, make a living, maneuver, pin down, protect companion animals',
    difficulty: '16',
    thresholds: [12, 24],
    hp: 6,
    stress: 5,
    attack: '+2',
    weapon: 'Longbow',
    distance: 'Far',
    damageAmount: '2d8+4',
    damageType: 'physical',
    experience: 'Animal Handling +3',
    features: [
      {
        name: 'Two as One',
        type: 'passive',
        description:
          'When the Beastmaster is spotlighted, you can also spotlight a Tier 1 animal adversary currently under their control.',
      },
      {
        name: 'Pinning Strike',
        type: 'action',
        description:
          'Make a standard attack against a target. On a success, you can mark a Stress to pin them to a nearby surface. The pinned target is Restrained until they break free with a successful Finesse or Strength Roll.',
      },
      {
        name: 'Deadly Companion',
        type: 'action',
        description:
          "Twice per scene, summon a Bear, Dire Wolf, or similar Tier 1 animal adversary under the Beastmaster's control. The adversary appears at Close range and is immediately spotlighted.",
      },
    ],
  },
  {
    name: 'Giant Brawler',
    tier: 2,
    subtype: 'Bruiser',
    description:
      'An especially muscular giant wielding a warhammer larger than a human.',
    subDescription: 'Make a living, overwhelm, slam, topple',
    difficulty: '15',
    thresholds: [14, 28],
    hp: 7,
    stress: 4,
    attack: '+2',
    weapon: 'Warhammer',
    distance: 'Very Close',
    damageAmount: '2d12+3',
    damageType: 'physical',
    experience: 'Intrusion +2',
    features: [
      {
        name: 'Battering Ram',
        type: 'action',
        description:
          'Mark a Stress to have the Brawler charge at an inanimate object within Close range they could feasibly smash (such as a wall, cart, or market stand) and destroy it. All targets within Very Close range of the object must succeed on an Agility Reaction Roll or take 2d4+3 physical damage from the shrapnel.',
      },
      {
        name: 'Bloody Reprisal',
        type: 'reaction',
        description:
          'When the Brawler marks 2 or more HP from an attack within Very Close range, you can make a standard attack against the attacker. On a success, the Brawler deals 2d6+15 physical damage instead of their standard damage.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Brawler makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Giant Eagle',
    tier: 2,
    subtype: 'Skulk',
    description: 'A giant bird of prey with blood-stained talons.',
    subDescription: 'Hunt prey, stay mobile, strike decisively',
    difficulty: '14',
    thresholds: [8, 19],
    hp: 4,
    stress: 4,
    attack: '+1',
    weapon: 'Claws and Beak',
    distance: 'Very Close',
    damageAmount: '2d6+3',
    damageType: 'physical',
    features: [
      {
        name: 'Flight',
        type: 'passive',
        description:
          'While flying, the Eagle gains a +3 bonus to their Difficulty.',
      },
      {
        name: 'Deadly Dive',
        type: 'action',
        description:
          "Mark a Stress to attack a target within Far range. On a success, deal 2d10+2 physical damage and knock the target over, making them Vulnerable until they next act. Take Off- Action: Make an attack against a target within Very Close range. On a success, deal 2d4+3 physical damage and the target must succeed on an Agility Reaction Roll or become temporarily Restrained within the Eagle's massive talons. If the target is Restrained, the Eagle immediately lifts into the air to Very Far range above the battlefield while holding them.",
      },
      {
        name: 'Deadly Drop',
        type: 'action',
        description:
          "While flying, the Eagle can drop a Restrained target they are holding. When dropped, the target is no longer Restrained but starts falling. If their fall isn't prevented during the PCs' next action, the target takes 2d20 physical damage when they land.",
      },
    ],
  },
  {
    name: 'Giant Recruit',
    tier: 2,
    subtype: 'Minion',
    description: 'A giant fighter wearing borrowed armor.',
    subDescription: 'Batter, make a living, overwhelm, terrify',
    difficulty: '13',
    hp: 1,
    stress: 2,
    attack: '+1',
    weapon: 'Warhammer',
    distance: 'Very Close',
    damageAmount: '5',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (7)',
        type: 'passive',
        description:
          'The Recruit is defeated when they take any damage. For every 7 damage a PC deals to the Recruit, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Giant Recruits within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 5 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Gorgon',
    tier: 2,
    subtype: 'Solo',
    description:
      'A snake-headed, scaled humanoid with a gilded bow, enraged that their peace has been disturbed.',
    subDescription: 'Corner, hit-and-run, petrify, seek vengeance',
    difficulty: '15',
    thresholds: [13, 25],
    hp: 9,
    stress: 3,
    attack: '+4',
    weapon: 'Sunsear Shortbow',
    distance: 'Far',
    damageAmount: '2d20+3',
    damageType: 'magic',
    experience: 'Stealth +3',
    features: [
      {
        name: 'Relentless (2)',
        type: 'passive',
        description:
          'The Gorgon can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Sunsear Arrows',
        type: 'passive',
        description:
          "When the Gorgon makes a successful standard attack, the target Glows until the end of the scene and can't become Hidden. Attack rolls made against a Glowing target have advantage.",
      },
      {
        name: 'Crown of Serpents',
        type: 'action',
        description:
          "Make an attack roll against a target within Melee range using the Gorgon's protective snakes. On a success, mark a Stress to deal 2d10+4 physical damage and the target must mark a Stress.",
      },
      {
        name: 'Petrifying Gaze',
        type: 'reaction',
        description:
          'When the Gorgon takes damage from an attack within Close range, you can spend a Fear to force the attacker to make an Instinct Reaction Roll. On a failure, they begin to turn to stone, marking a HP and starting a Petrification Countdown (4). This countdown ticks down when the Gorgon is attacked. When it triggers, the target must make a death move. If the Gorgon is defeated, all petrification countdowns end.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Gorgon makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Juvenile Flickerfly',
    tier: 2,
    subtype: 'Solo',
    description:
      'A horse-sized insect with iridescent scales and crystalline wings moving faster than the eye can see.',
    subDescription: 'Collect shiny things, hunt, swoop',
    difficulty: '14',
    thresholds: [13, 26],
    hp: 10,
    stress: 5,
    attack: '+3',
    weapon: 'Wing Slash',
    distance: 'Very Close',
    damageAmount: '2d10+4',
    damageType: 'physical',
    features: [
      {
        name: 'Relentless (3)',
        type: 'passive',
        description:
          'The Flickerfly can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Peerless Accuracy',
        type: 'passive',
        description:
          "Before the Flickerfly makes an attack, roll a d6. On a result of 4 or higher, the target's Evasion is halved against this attack.",
      },
      {
        name: 'Mind Dance',
        type: 'action',
        description:
          "Mark a Stress to create a magically dazzling display that grapples the minds of nearby foes. All targets within Close range must make an Instinct Reaction Roll. For each target who failed, you gain a Fear and the Flickerfly learns one of the target's fears.",
      },
      {
        name: 'Hallucinatory Breath',
        type: 'reaction',
        description:
          'When the Flickerfly takes damage for the first time, activate the countdown. When it triggers, the Flickerfly breathes hallucinatory gas on all targets in front of them up to Far range. Targets must succeed on an Instinct Reaction Roll or be tormented by fearful hallucinations. Targets whose fears are known to the Flickerfly have disadvantage on this roll. Targets who fail must mark a Stress and lose a Hope.',
      },
    ],
  },
  {
    name: 'Knight of the Realm',
    tier: 2,
    subtype: 'Leader',
    description: 'A decorated soldier with heavy armor and a powerful steed.',
    subDescription: 'Run down, seek glory, show dominance',
    difficulty: '15',
    thresholds: [13, 26],
    hp: 6,
    stress: 4,
    attack: '+4',
    weapon: 'Longsword',
    distance: 'Melee',
    damageAmount: '2d10+4',
    damageType: 'physical',
    experience: 'Ancient Knowledge +3, High Society +2, Tactics +2',
    features: [
      {
        name: 'Chevalier',
        type: 'passive',
        description:
          "While the Knight is on a mount, they gain a +2 bonus to their Difficulty. When they take Severe damage, they're knocked from their mount and lose this benefit until they're next spotlighted.",
      },
      {
        name: 'Heavily Armored',
        type: 'passive',
        description: 'When the Knight takes physical damage, reduce it by 3.',
      },
      {
        name: 'Cavalry Charge',
        type: 'action',
        description:
          'If the Knight is mounted, move up to Far range and make a standard attack against a target. On a success, deal 2d8+4 physical damage and the target must mark a Stress.',
      },
      {
        name: 'For the Realm!',
        type: 'action',
        description:
          'Mark a Stress to spotlight 1d4+1 allies. Attacks they make while spotlighted in this way deal half damage.',
      },
    ],
  },
  {
    name: 'Masked Thief',
    tier: 2,
    subtype: 'Skulk',
    description:
      'A cunning thief with acrobatic skill and a flair for the dramatic.',
    subDescription: 'Evade, hide, pilfer, profit',
    difficulty: '14',
    thresholds: [8, 17],
    hp: 4,
    stress: 5,
    attack: '+3',
    weapon: 'Backsword',
    distance: 'Melee',
    damageAmount: '2d8+3',
    damageType: 'physical',
    experience: 'Acrobatics +3',
    features: [
      {
        name: 'Quick Hands',
        type: 'action',
        description:
          "Make an attack against a target within Melee range. On a success, deal 1d8+2 physical damage and the Thief steals one item or consumable from the target's inventory.",
      },
      {
        name: 'Escape Plan',
        type: 'action',
        description:
          'Mark a Stress to reveal a snare trap set anywhere on the battlefield by the Thief. All targets within Very Close range of the trap must succeed on an Agility Reaction Roll (13) or be pulled off their feet and suspended upside down. A target is Restrained and Vulnerable until they break free, ending both conditions, with a successful Finesse or Strength Roll (13).',
      },
    ],
  },
  {
    name: 'Master Assassin',
    tier: 2,
    subtype: 'Leader',
    description:
      'A seasoned killer with a threatening voice and a deadly blade.',
    subDescription: 'Ambush, get out alive, kill, prepare for all scenarios',
    difficulty: '15',
    thresholds: [12, 25],
    hp: 7,
    stress: 5,
    attack: '+5',
    weapon: 'Serrated Dagger',
    distance: 'Close',
    damageAmount: '2d10+2',
    damageType: 'physical',
    experience: 'Command +3, Intrusion +3',
    features: [
      {
        name: "Won't See It Coming",
        type: 'passive',
        description: "The Assassin deals direct damage while they're Hidden.",
      },
      {
        name: 'Strike as One',
        type: 'action',
        description:
          "Mark a Stress to spotlight a number of other Assassins equal to the Assassin's unmarked Stress.",
      },
      {
        name: 'The Subtle Blade',
        type: 'reaction',
        description:
          'When the Assassin successfully makes a standard attack against a Vulnerable target, you can spend a Fear to deal Severe damage instead of their standard damage.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Assassin makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Merchant Baron',
    tier: 2,
    subtype: 'Social',
    description:
      'An accomplished merchant with a large operation under their command.',
    subDescription: 'Abuse power, gather resources, mobilize minions',
    difficulty: '15',
    thresholds: [9, 19],
    hp: 5,
    stress: 3,
    attack: '-2',
    weapon: 'Rapier',
    distance: 'Melee',
    damageAmount: '1d6+2',
    damageType: 'physical',
    experience: 'Nobility +2, Trade +2',
    features: [
      {
        name: 'Everyone Has a Price',
        type: 'action',
        description:
          'Spend a Fear to offer a target a dangerous bargain for something they want or need. If used on a PC, they must make a Presence Reaction Roll (17). On a failure, they must mark 2 Stress or take the deal.',
      },
      {
        name: 'The Best Muscle Money Can Buy',
        type: 'action',
        description:
          "Once per scene, mark a Stress to summon 1d4+1 Tier 1 adversaries, who appear at Far range, to enforce the Baron's will.",
      },
    ],
  },
  {
    name: 'Minotaur Wrecker',
    tier: 2,
    subtype: 'Bruiser',
    description: 'A massive bull-headed firbolg with a quick temper.',
    subDescription: 'Consume, gore, navigate, overpower, pursue',
    difficulty: '16',
    thresholds: [14, 27],
    hp: 7,
    stress: 5,
    attack: '+2',
    weapon: 'Battleaxe',
    distance: 'Very Close',
    damageAmount: '2d8+5',
    damageType: 'physical',
    experience: 'Navigation +2',
    features: [
      {
        name: 'Ramp Up',
        type: 'passive',
        description:
          'You must spend a Fear to spotlight the Minotaur. While spotlighted, they can make their standard attack against all targets within range.',
      },
      {
        name: 'Charging Bull',
        type: 'action',
        description:
          "Mark a Stress to charge through a group within Close range and make an attack against all targets in the Minotaur's path. Targets the Minotaur succeeds against take 2d6+8 physical damage and are knocked back to Very Far range. If a target is knocked into a solid object or another creature, they take an extra 1d6 damage (combine the damage).",
      },
      {
        name: 'Gore',
        type: 'action',
        description:
          'Make an attack against a target within Very Close range, moving the Minotaur into Melee range of them. On a success, deal 2d8 direct physical damage.',
      },
    ],
  },
  {
    name: 'Mortal Hunter',
    tier: 2,
    subtype: 'Leader',
    description:
      'An undead figure wearing a heavy leather coat, with searching eyes and a casually cruel demeanor.',
    subDescription: 'Devour, hunt, track',
    difficulty: '16',
    thresholds: [15, 27],
    hp: 6,
    stress: 4,
    attack: '+5',
    weapon: 'Tear at Flesh',
    distance: 'Very Close',
    damageAmount: '2d12+1',
    damageType: 'physical',
    experience: 'Bloodhound +3',
    features: [
      {
        name: 'Terrifying',
        type: 'passive',
        description:
          'When the Hunter makes a successful attack, all PCs within Far range lose a Hope and you gain a Fear.',
      },
      {
        name: 'Deathlock',
        type: 'action',
        description:
          'Spend a Fear to curse a target within Very Close range with a necrotic Deathlock until the end of the scene. Attacks made by the Hunter against a Deathlocked target deal direct damage. The Hunter can only maintain one Deathlock at a time.',
      },
      {
        name: 'Inevitable Death',
        type: 'action',
        description:
          'Mark a Stress to spotlight 1d4 allies. Attacks they make while spotlighted in this way deal half damage.',
      },
      {
        name: 'Rampage',
        type: 'reaction',
        description:
          'When the Hunter is in the spotlight for the first time, activate the countdown. When it triggers, move the Hunter in a straight line to a point within Far range and make an attack against all targets in their path. Targets the Hunter succeeds against take 2d8+2 physical damage.',
      },
    ],
  },
  {
    name: 'Royal Advisor',
    tier: 2,
    subtype: 'Social',
    description: 'A high-ranking courtier with the ear of the local nobility.',
    subDescription: 'Curry favor, manufacture evidence, scheme',
    difficulty: '14',
    thresholds: [8, 15],
    hp: 3,
    stress: 3,
    attack: '-3',
    weapon: 'Wand',
    distance: 'Far',
    damageAmount: '1d4+3',
    damageType: 'physical',
    experience: 'Administration +3, Courtier +3',
    features: [
      {
        name: 'Devastating Retort',
        type: 'passive',
        description:
          'A PC who rolls less than 17 on an action roll targeting the Advisor must mark a Stress.',
      },
      {
        name: 'Bend Ears',
        type: 'action',
        description:
          "Mark a Stress to influence an NPC within Melee range with whispered words. That target's opinion on one matter shifts toward the Advisor's preference unless it is in direct opposition to the target's motives.",
      },
      {
        name: 'Scapegoat',
        type: 'action',
        description:
          'Spend a Fear to convince a crowd or notable individual that one person or group is responsible for some problem facing the target. The target becomes hostile to the scapegoat until convinced of their innocence with a successful Presence Roll (17).',
      },
    ],
  },
  {
    name: 'Secret-Keeper',
    tier: 2,
    subtype: 'Leader',
    description:
      'A clandestine leader with a direct channel to the Fallen Gods.',
    subDescription: 'Amass great power, plot, take command',
    difficulty: '16',
    thresholds: [13, 26],
    hp: 7,
    stress: 4,
    attack: '+3',
    weapon: 'Sigil-laden Staff',
    distance: 'Far',
    damageAmount: '2d12',
    damageType: 'magic',
    experience: 'Coercion +2, Fallen Lore +2',
    features: [
      {
        name: 'Seize Your Moment',
        type: 'action',
        description:
          'Spend 2 Fear to spotlight 1d4 allies. Attacks they make while spotlighted in this way deal half damage.',
      },
      {
        name: "Our Master's Will",
        type: 'reaction',
        description:
          'When you spotlight an ally within Far range, mark a Stress to gain a Fear.',
      },
      {
        name: 'Summoning Ritual',
        type: 'reaction',
        description:
          'When the Secret-Keeper is in the spotlight for the first time, activate the countdown. When they mark HP, tick down this countdown by the number of HP marked. When it triggers, summon a Minor Demon who appears at Close range.',
      },
      {
        name: 'Fallen Hounds',
        type: 'reaction',
        description:
          'Once per scene, when the Secret-Keeper marks 2 or more HP, you can mark a Stress to summon a Demonic Hound Pack, which appears at Close range and is immediately spotlighted.',
      },
    ],
  },
  {
    name: 'Shark',
    tier: 2,
    subtype: 'Bruiser',
    description: 'A large aquatic predator, always on the move.',
    subDescription: 'Find the blood, isolate prey, target the weak',
    difficulty: '14',
    thresholds: [14, 28],
    hp: 7,
    stress: 3,
    attack: '+2',
    weapon: 'Toothy Maw',
    distance: 'Very Close',
    damageAmount: '2d12+1',
    damageType: 'physical',
    experience: 'Sense of Smell +3',
    features: [
      {
        name: 'Terrifying',
        type: 'passive',
        description:
          'When the Shark makes a successful attack, all PCs within Far range lose a Hope and you gain a Fear.',
      },
      {
        name: 'Rending Bite',
        type: 'passive',
        description:
          "When the Shark makes a successful attack, the target must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP.",
      },
      {
        name: 'Blood in the Water',
        type: 'reaction',
        description:
          "When a creature within Close range of the Shark marks HP from another creature's attack, you can mark a Stress to immediately spotlight the Shark, moving them into Melee range of the target and making a standard attack.",
      },
    ],
  },
  {
    name: 'Siren',
    tier: 2,
    subtype: 'Skulk',
    description:
      'A half-fish person with shimmering scales and an irresistible voice.',
    subDescription: 'Consume, lure prey, subdue with song',
    difficulty: '14',
    thresholds: [9, 18],
    hp: 5,
    stress: 3,
    attack: '+2',
    weapon: 'Distended Jaw Bite',
    distance: 'Melee',
    damageAmount: '2d6+3',
    damageType: 'physical',
    experience: 'Song Repertoire +3',
    features: [
      {
        name: 'Captive Audience',
        type: 'passive',
        description:
          'If the Siren makes a standard attack against a target Entranced by their song, the attack deals 2d10+1 damage instead of their standard damage.',
      },
      {
        name: 'Enchanting Song',
        type: 'action',
        description:
          "Spend a Fear to sing a song that affects all targets within Close range. Targets must succeed on an Instinct Reaction Roll or become Entranced until they mark 2 Stress. Other Sirens within Close range of the target can mark a Stress to each add a +1 bonus to the Difficulty of the reaction roll. While Entranced, a target can't act and is Vulnerable.",
      },
    ],
  },
  {
    name: 'Spectral Archer',
    tier: 2,
    subtype: 'Ranged',
    description:
      'A ghostly fighter with an ethereal bow, unable to move on while their charge is vulnerable.',
    subDescription:
      'Move through solid objects, stay out of the fray, rehash old battles',
    difficulty: '13',
    thresholds: [6, 14],
    hp: 3,
    stress: 3,
    attack: '+3',
    weapon: 'Longbow',
    distance: 'Far',
    damageAmount: '2d10+2',
    damageType: 'physical',
    experience: 'Ancient Knowledge +2',
    features: [
      {
        name: 'Ghost',
        type: 'passive',
        description:
          'The Archer has resistance to physical damage. Mark a Stress to move up to Close range through solid objects.',
      },
      {
        name: 'Pick Your Target',
        type: 'action',
        description:
          'Spend a Fear to make an attack within Far range against a PC who is within Very Close range of at least two other PCs. On a success, the target takes 2d8+12 physical damage.',
      },
    ],
  },
  {
    name: 'Spectral Captain',
    tier: 2,
    subtype: 'Leader',
    description: 'A ghostly commander leading their troops beyond death.',
    subDescription:
      'Move through solid objects, rally troops, rehash old battles',
    difficulty: '16',
    thresholds: [13, 26],
    hp: 6,
    stress: 4,
    attack: '+3',
    weapon: 'Longbow',
    distance: 'Far',
    damageAmount: '2d10+3',
    damageType: 'physical',
    experience: 'Ancient Knowledge +3',
    features: [
      {
        name: 'Ghost',
        type: 'passive',
        description:
          'The Captain has resistance to physical damage. Mark a Stress to move up to Close range through solid objects.',
      },
      {
        name: 'Unending Battle',
        type: 'action',
        description:
          'Spend 2 Fear to return up to 1d4+1 defeated Spectral allies to the battle at the points where they first appeared (with no marked HP or Stress).',
      },
      {
        name: 'Hold Fast',
        type: 'reaction',
        description:
          "When the Captain's Spectral allies are forced to make a reaction roll, you can mark a Stress to give those allies a +2 bonus to the roll.",
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Captain makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Spectral Guardian',
    tier: 2,
    subtype: 'Standard',
    description: 'A ghostly fighter with spears and swords, anchored by duty.',
    subDescription:
      'Move through solid objects, protect treasure, rehash old battles',
    difficulty: '15',
    thresholds: [7, 15],
    hp: 4,
    stress: 3,
    attack: '+1',
    weapon: 'Spear',
    distance: 'Very Close',
    damageAmount: '2d8+1',
    damageType: 'physical',
    experience: 'Ancient Knowledge +2',
    features: [
      {
        name: 'Ghost',
        type: 'passive',
        description:
          'The Guardian has resistance to physical damage. Mark a Stress to move up to Close range through solid objects.',
      },
      {
        name: 'Grave Blade',
        type: 'action',
        description:
          'Spend a Fear to make an attack against a target within Very Close range. On a success, deal 2d10+6 physical damage and the target must mark a Stress.',
      },
    ],
  },
  {
    name: 'Spy',
    tier: 2,
    subtype: 'Social',
    description:
      'A skilled espionage agent with a knack for being in the right place to overhear secrets.',
    subDescription: 'Cut and run, disguise appearance, eavesdrop',
    difficulty: '15',
    thresholds: [8, 17],
    hp: 4,
    stress: 3,
    attack: '-2',
    weapon: 'Dagger',
    distance: 'Melee',
    damageAmount: '2d6+3',
    damageType: 'physical',
    experience: 'Espionage +3',
    features: [
      {
        name: 'Gathering Secrets',
        type: 'action',
        description:
          'Spend a Fear to describe how the Spy knows a secret about a PC in the scene.',
      },
      {
        name: 'Fly on the Wall',
        type: 'reaction',
        description:
          'When a PC or group is discussing something sensitive, you can mark a Stress to reveal that the Spy is present in the scene, observing them. If the Spy escapes the scene to report their findings, you gain 1d4 Fear.',
      },
    ],
  },
  {
    name: 'Stonewraith',
    tier: 2,
    subtype: 'Skulk',
    description:
      'A prowling hunter, like a slinking mountain lion, with a slate-gray stone body.',
    subDescription: 'Defend territory, isolate prey, stalk',
    difficulty: '13',
    thresholds: [11, 22],
    hp: 6,
    stress: 3,
    attack: '+3',
    weapon: 'Bite and Claws',
    distance: 'Melee',
    damageAmount: '2d8+6',
    damageType: 'physical',
    experience: 'Stonesense +3',
    features: [
      {
        name: 'Stonestrider',
        type: 'passive',
        description:
          'The Stonewraith can move through stone and earth as easily as air. While within stone or earth, they are Hidden and immune to all damage.',
      },
      {
        name: 'Rocky Ambush',
        type: 'action',
        description:
          'While Hidden, mark a Stress to leap into Melee range with a target within Very Close range. The target must succeed on an Agility or Instinct Reaction Roll (15) or take 2d8 physical damage and become temporarily Restrained.',
      },
      {
        name: 'Avalanche Roar',
        type: 'action',
        description:
          'Spend a Fear to roar while within a cave and cause a cave-in. All targets within Close range must succeed on an Agility Reaction Roll (14) or take 2d10 physical damage. The rubble can be cleared with a Progress Countdown (8).',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Stonewraith makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'War Wizard',
    tier: 2,
    subtype: 'Ranged',
    description: 'A battle-hardened mage trained in destructive magic.',
    subDescription: 'Develop new spells, seek power, shatter formations',
    difficulty: '16',
    thresholds: [11, 23],
    hp: 5,
    stress: 6,
    attack: '+4',
    weapon: 'Staff',
    distance: 'Far',
    damageAmount: '2d10+4',
    damageType: 'magic',
    experience: 'Magical Knowledge +2, Strategize +2',
    features: [
      {
        name: 'Battle Teleport',
        type: 'passive',
        description:
          'Before or after making a standard attack, you can mark a Stress to teleport to a location within Far range.',
      },
      {
        name: 'Refresh Warding Sphere',
        type: 'action',
        description:
          'Mark a Stress to refresh the Wizard\'s "Warding Sphere" reaction.',
      },
      {
        name: 'Eruption',
        type: 'action',
        description:
          "Spend a Fear and choose a point within Far range. A Very Close area around that point erupts into impassable terrain. All targets within that area must make an Agility Reaction Roll (14). Targets who fail take 2d10 physical damage and are thrown out of the area. Targets who succeed take half damage and aren't moved.",
      },
      {
        name: 'Arcane Artillery',
        type: 'action',
        description:
          'Spend a Fear to unleash a precise hail of magical blasts. All targets in the scene must make an Agility Reaction Roll. Targets who fail take 2d12 magic damage. Targets who succeed take half damage.',
      },
      {
        name: 'Warding Sphere',
        type: 'reaction',
        description:
          'When the Wizard takes damage from an attack within Close range, deal 2d6 magic damage to the attacker. This reaction can\'t be used again until the Wizard refreshes it with their "Refresh Warding Sphere" action.',
      },
    ],
  },
  {
    name: 'Adult Flickerfly',
    tier: 3,
    subtype: 'Solo',
    description:
      'A winged insect the size of a large house with iridescent scales and wings that move too fast to track.',
    subDescription: 'Collect shiny things, hunt, nest, swoop',
    difficulty: '17',
    thresholds: [20, 35],
    hp: 12,
    stress: 6,
    attack: '+3',
    weapon: 'Wing Slash',
    distance: 'Very Close',
    damageAmount: '3d20',
    damageType: 'physical',
    features: [
      {
        name: 'Relentless (4)',
        type: 'passive',
        description:
          'The Flickerfly can be spotlighted up to four times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Never Misses',
        type: 'passive',
        description:
          "When the Flickerfly makes an attack, the target's Evasion is halved against the attack.",
      },
      {
        name: 'Deadly Flight',
        type: 'passive',
        description:
          'While flying, the Flickerfly can move up to Far range instead of Close range before taking an action.',
      },
      {
        name: 'Whirlwind',
        type: 'action',
        description:
          'Spend a Fear to whirl, making an attack against all targets within Very Close range. Targets the Flickerfly succeeds against take 3d8 direct physical damage.',
      },
      {
        name: 'Mind Dance',
        type: 'action',
        description:
          "Mark a Stress to create a magically dazzling display that grapples the minds of nearby foes. All targets within Close range must make an Instinct Reaction Roll. For each target who failed, you gain a Fear and the Flickerfly learns one of the target's fears.",
      },
      {
        name: 'Hallucinatory Breath',
        type: 'reaction',
        description:
          'When the Flickerfly takes damage for the first time, activate the countdown. When it triggers, the Flickerfly breathes hallucinatory gas on all targets in front of them up to Far range. Targets must make an Instinct Reaction Roll or be tormented by fearful hallucinations. Targets whose fears are known to the Flickerfly have disadvantage on this roll. Targets who fail lose 2 Hope and take 3d8+3 direct magic damage.',
      },
      {
        name: 'Uncanny Reflexes',
        type: 'reaction',
        description:
          'When the Flickerfly takes damage from an attack within Close range, you can mark a Stress to take half damage.',
      },
    ],
  },
  {
    name: 'Demon of Avarice',
    tier: 3,
    subtype: 'Support',
    description:
      'A regal cloaked monstrosity with circular horns adorned with treasure.',
    subDescription: 'Consume, fuel greed, sow dissent',
    difficulty: '17',
    thresholds: [15, 29],
    hp: 6,
    stress: 5,
    attack: '+2',
    weapon: 'Hungry Maw',
    distance: 'Melee',
    damageAmount: '3d6+5',
    damageType: 'magic',
    experience: 'Manipulation +3',
    features: [
      {
        name: 'Money Talks',
        type: 'passive',
        description:
          "Attacks against the Demon are made with disadvantage unless the attacker spends a handful of gold. This Demon starts with a number of handfuls equal to the number of PCs. When a target marks HP from the Demon's standard attack, they can spend a handful of gold instead of marking HP (1 handful per HP). Add a handful of gold to the Demon for each handful of gold spent by PCs on this feature.",
      },
      {
        name: 'Numbers Must Go Up',
        type: 'passive',
        description:
          "Add a bonus to the Demon's attack rolls equal to the number of handfuls of gold they have.",
      },
      {
        name: 'Money Is Time',
        type: 'action',
        description:
          'Spend 3 handfuls of gold (or a Fear) to spotlight 1d4+1 allies.',
      },
    ],
  },
  {
    name: 'Demon of Despair',
    tier: 3,
    subtype: 'Skulk',
    description: 'A cloaked demon-creature with long limbs, seeping shadows.',
    subDescription:
      'Make fear contagious, stick to the shadows, undermine resolve',
    difficulty: '17',
    thresholds: [18, 35],
    hp: 6,
    stress: 5,
    attack: '+3',
    weapon: 'Miasma Bolt',
    distance: 'Far',
    damageAmount: '3d6+1',
    damageType: 'magic',
    experience: 'Manipulation +3',
    features: [
      {
        name: 'Depths of Despair',
        type: 'passive',
        description: 'The Demon deals double damage to PCs with 0 Hope.',
      },
      {
        name: 'Your Struggle Is Pointless',
        type: 'action',
        description:
          'Spend a Fear to weigh down the spirits of all PCs within Far range. All targets affected replace their Hope Die with a d8 until they roll a success with Hope or their next rest.',
      },
      {
        name: 'Your Friends Will Fail You',
        type: 'reaction',
        description:
          'When a PC fails with Fear, you can mark a Stress to cause all other PCs within Close range to lose a Hope.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Demon makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Demon of Hubris',
    tier: 3,
    subtype: 'Leader',
    description:
      'A perfectly beautiful and infinitely cruel demon with a gleaming spear and elegant robes.',
    subDescription: 'Condescend, declare premature victory, prove superiority',
    difficulty: '18',
    thresholds: [18, 36],
    hp: 7,
    stress: 5,
    attack: '+4',
    weapon: 'Perfect Spear',
    distance: 'Very Close',
    damageAmount: '3d10',
    damageType: 'physical',
    experience: 'Manipulation +2',
    features: [
      {
        name: 'Terrifying',
        type: 'passive',
        description:
          'When the Demon makes a successful attack, all PCs within Far range must lose a Hope and you gain a Fear.',
      },
      {
        name: 'Double or Nothing',
        type: 'passive',
        description:
          'When a PC within Far range fails a roll, they can choose to reroll their Fear Die and take the new result. If they still fail, they mark 2 Stress and the Demon clears a Stress.',
      },
      {
        name: 'Unparalleled Skill',
        type: 'action',
        description:
          "Mark a Stress to deal the Demon's standard attack damage to a target within Close range.",
      },
      {
        name: 'The Root of Villainy',
        type: 'action',
        description:
          'Spend a Fear to spotlight two other Demons within Far range.',
      },
      {
        name: 'You Pale in Comparison',
        type: 'reaction',
        description:
          'When a PC fails a roll within Close range of the Demon, they must mark a Stress.',
      },
    ],
  },
  {
    name: 'Demon of Jealousy',
    tier: 3,
    subtype: 'Ranged',
    description: 'A fickle creature of spindly limbs and insatiable desires.',
    subDescription:
      "Join in on others' success, take what belongs to others, hold grudges",
    difficulty: '17',
    thresholds: [17, 30],
    hp: 6,
    stress: 6,
    attack: '+4',
    weapon: 'Psychic Assault',
    distance: 'Far',
    damageAmount: '3d8+3',
    damageType: 'magic',
    experience: 'Manipulation +3',
    features: [
      {
        name: 'Unprotected Mind',
        type: 'passive',
        description: "The Demon's standard attack deals direct damage.",
      },
      {
        name: 'My Turn',
        type: 'reaction',
        description:
          'When the Demon marks HP from an attack, spend a number of Fear equal to the HP marked by the Demon to cause the attacker to mark the same number of HP.',
      },
      {
        name: 'Rivalry',
        type: 'reaction',
        description:
          'When a creature within Close range takes damage from a different adversary, you can mark a Stress to add a d4 to the damage roll.',
      },
      {
        name: "What's Yours Is Mine",
        type: 'reaction',
        description:
          "When a PC takes Severe damage within Very Close range of the Demon, you can spend a Fear to cause the target to make a Finesse Reaction Roll. On a failure, the Demon seizes one item or consumable of their choice from the target's inventory.",
      },
    ],
  },
  {
    name: 'Demon of Wrath',
    tier: 3,
    subtype: 'Bruiser',
    description:
      'A hulking demon with boulder-sized fists, driven by endless rage.',
    subDescription: 'Fuel anger, impress rivals, wreak havoc',
    difficulty: '17',
    thresholds: [22, 40],
    hp: 7,
    stress: 5,
    attack: '+3',
    weapon: 'Fists',
    distance: 'Very Close',
    damageAmount: '3d8+1',
    damageType: 'magic',
    experience: 'Intimidation +2',
    features: [
      {
        name: 'Anger Unrelenting',
        type: 'passive',
        description: "The Demon's attacks deal direct damage.",
      },
      {
        name: 'Battle Lust',
        type: 'action',
        description:
          'Spend a Fear to boil the blood of all PCs within Far range. They use a d20 as their Fear Die until the end of the scene.',
      },
      {
        name: 'Retaliation',
        type: 'reaction',
        description:
          'When the Demon takes damage from an attack within Close range, you can mark a Stress to make a standard attack against the attacker.',
      },
      {
        name: 'Blood and Souls',
        type: 'reaction',
        description:
          'Activate the first time an attack is made within sight of the Demon. It ticks down when a PC takes a violent action. When it triggers, summon 1d4 Minor Demons, who appear at Close range.',
      },
    ],
  },
  {
    name: 'Dire Bat',
    tier: 3,
    subtype: 'Skulk',
    description: 'A wide-winged pet endlessly loyal to their vampire owner.',
    subDescription: 'Dive-bomb, hide, protect leader',
    difficulty: '14',
    thresholds: [16, 30],
    hp: 5,
    stress: 3,
    attack: '+2',
    weapon: 'Claws and Teeth',
    distance: 'Melee',
    damageAmount: '2d6+7',
    damageType: 'physical',
    experience: 'Bloodthirsty +3',
    features: [
      {
        name: 'Flying',
        type: 'passive',
        description:
          'While flying, the Bat gains a +3 bonus to their Difficulty.',
      },
      {
        name: 'Screech',
        type: 'action',
        description:
          'Mark a Stress to send a high-pitch screech out toward all targets in front of the Bat within Far range. Those targets must mark 1d4 Stress.',
      },
      {
        name: 'Guardian',
        type: 'reaction',
        description:
          'When an allied Vampire marks HP, you can mark a Stress to fly into Melee range of the attacker and make an attack with advantage against them. On a success, deal 2d6+2 physical damage.',
      },
    ],
  },
  {
    name: 'Dryad',
    tier: 3,
    subtype: 'Leader',
    description: 'A nature spirit in the form of a humanoid tree.',
    subDescription: 'Command, cultivate, drive out, preserve the forest',
    difficulty: '16',
    thresholds: [24, 38],
    hp: 8,
    stress: 5,
    attack: '+4',
    weapon: 'Deadfall Shortbow',
    distance: 'Far',
    damageAmount: '3d10+1',
    damageType: 'physical',
    experience: 'Forest Knowledge +4',
    features: [
      {
        name: 'Bramble Patch',
        type: 'action',
        description:
          'Mark a Stress to target a point within Far range. Create a patch of thorns that covers an area within Close range of that point. All targets within that area take 2d6+2 physical damage when they act. A target must succeed on a Finesse Roll or deal more than 20 damage to the Dryad with an attack to leave the area.',
      },
      {
        name: 'Grow Saplings',
        type: 'action',
        description:
          'Spend a Fear to grow three Treant Sapling Minions, who appear at Close range and immediately take the spotlight.',
      },
      {
        name: 'We Are All One',
        type: 'reaction',
        description:
          "When an ally dies within Close range, you can spend a Fear to clear 2 HP and 2 Stress as the fallen ally's life force is returned to the forest.",
      },
    ],
  },
  {
    name: 'Elemental Spark',
    tier: 3,
    subtype: 'Minion',
    description: 'A blazing mote of elemental fire.',
    subDescription: 'Blast, consume, gain mass',
    difficulty: '15',
    hp: 1,
    stress: 1,
    attack: '+0',
    weapon: 'Bursts of Fire',
    distance: 'Close',
    damageAmount: '5',
    damageType: 'magic',
    features: [
      {
        name: 'Minion (9)',
        type: 'passive',
        description:
          'The Elemental is defeated when they take any damage. For every 9 damage a PC deals to the Elemental, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Elemental Sparks within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 5 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Greater Earth Elemental',
    tier: 3,
    subtype: 'Bruiser',
    description:
      'A living landslide of boulders and dust, as large as a house.',
    subDescription: 'Avalanche, knock over, pummel',
    difficulty: '17',
    thresholds: [22, 40],
    hp: 10,
    stress: 4,
    attack: '+7',
    weapon: 'Boulder Fist',
    distance: 'Very Close',
    damageAmount: '3d10+1',
    damageType: 'physical',
    features: [
      {
        name: 'Slow',
        type: 'passive',
        description:
          "When you spotlight the Elemental and they don't have a token on their stat block, they can't act yet. Place a token on their stat block and describe what they're preparing to do. When you spotlight the Elemental and they have a token on their stat block, clear the token and they can act.",
      },
      {
        name: 'Crushing Blows',
        type: 'passive',
        description:
          "When the Elemental makes a successful attack, the target must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP.",
      },
      {
        name: 'Immovable Object',
        type: 'passive',
        description:
          'An attack that would move the Elemental moves them two fewer ranges (for example, Far becomes Very Close). When the Elemental takes physical damage, reduce it by 7.',
      },
      {
        name: 'Rockslide',
        type: 'action',
        description:
          'Mark a Stress to create a rockslide that buries the land in front of Elemental within Close range with rockfall. All targets in this area must make an Agility Reaction Roll (19). Targets who fail take 2d12+5 physical damage and become Vulnerable until their next roll with Hope. Targets who succeed take half damage.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Elemental makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Greater Water Elemental',
    tier: 3,
    subtype: 'Support',
    description: 'A huge living wave that crashes down upon enemies.',
    subDescription: 'Deluge, disperse, drown',
    difficulty: '17',
    thresholds: [17, 34],
    hp: 5,
    stress: 5,
    attack: '+3',
    weapon: 'Crashing Wave',
    distance: 'Very Close',
    damageAmount: '3d4+1',
    damageType: 'magic',
    features: [
      {
        name: 'Water Jet',
        type: 'action',
        description:
          "Mark a Stress to attack a target within Very Close range. On a success, deal 2d4+7 physical damage and the target's next action has disadvantage. On a failure, the target must mark a Stress.",
      },
      {
        name: 'Drowning Embrace',
        type: 'action',
        description:
          'Spend a Fear to make an attack against all targets within Very Close range. Targets the Elemental succeeds against become Restrained and Vulnerable as they begin drowning. A target can break free, ending both conditions, with a successful Strength or Instinct Roll.',
      },
      {
        name: 'High Tide',
        type: 'reaction',
        description:
          'When the Elemental makes a successful standard attack, you can mark a Stress to knock the target back to Close range.',
      },
    ],
  },
  {
    name: 'Head Vampire',
    tier: 3,
    subtype: 'Leader',
    description: 'A captivating undead dressed in aristocratic finery.',
    subDescription: 'Create thralls, charm, command, fly, intimidate',
    difficulty: '17',
    thresholds: [22, 42],
    hp: 6,
    stress: 6,
    attack: '+5',
    weapon: 'Rapier',
    distance: 'Melee',
    damageAmount: '2d20+4',
    damageType: 'physical',
    experience: 'Aristocrat +3',
    features: [
      {
        name: 'Terrifying',
        type: 'passive',
        description:
          'When the Vampire makes a successful attack, all PCs within Far range lose a Hope and you gain a Fear.',
      },
      {
        name: 'Look into My Eyes',
        type: 'passive',
        description:
          'A creature who moves into Melee range of the Vampire must make an Instinct Reaction Roll. On a failure, you gain 1d4 Fear.',
      },
      {
        name: 'Feed on Followers',
        type: 'action',
        description:
          'When the Vampire is within Melee range of an ally, they can cause the ally to mark a HP. The Vampire then clears a HP.',
      },
      {
        name: 'The Hunt Is On',
        type: 'action',
        description:
          'Spend 2 Fear to summon 1d4 Vampires, who appear at Far range and immediately take the spotlight.',
      },
      {
        name: 'Lifesuck',
        type: 'reaction',
        description:
          'When the Vampire is spotlighted, roll a d8. On a result of 6 or higher, all targets within Very Close range must mark a HP.',
      },
    ],
  },
  {
    name: 'Huge Green Ooze',
    tier: 3,
    subtype: 'Skulk',
    description: 'A translucent green mound of acid taller than most humans.',
    subDescription: 'Camouflage, creep up, envelop, multiply',
    difficulty: '15',
    thresholds: [15, 30],
    hp: 7,
    stress: 4,
    attack: '+3',
    weapon: 'Ooze Appendage',
    distance: 'Melee',
    damageAmount: '3d8+1',
    damageType: 'magic',
    experience: 'Blend In +3',
    features: [
      {
        name: 'Slow',
        type: 'passive',
        description:
          "When you spotlight the Ooze and they don't have a token on their stat block, they can't act yet. Place a token on their stat block and describe what they're preparing to do. When you spotlight the Ooze and they have a token on their stat block, clear the token and they can act.",
      },
      {
        name: 'Acidic Form',
        type: 'passive',
        description:
          "When the Ooze makes a successful attack, the target must mark an Armor Slot without receiving its benefits (they can still use armor to reduce the damage). If they can't mark an Armor Slot, they must mark an additional HP.",
      },
      {
        name: 'Envelop',
        type: 'action',
        description:
          'Make an attack against a target within Melee range. On a success, the Ooze Envelops them and the target must mark 2 Stress. While Enveloped, the target must mark an additional Stress every time they make an action roll. When the Ooze takes Severe damage, all Enveloped targets are freed and the condition is cleared.',
      },
      {
        name: 'Split',
        type: 'reaction',
        description:
          'When the Ooze has 4 or more HP marked, you can spend a Fear to split them into two Green Oozes (with no marked HP or Stress). Immediately spotlight both of them.',
      },
    ],
  },
  {
    name: 'Hydra',
    tier: 3,
    subtype: 'Solo',
    description:
      'A quadrupedal scaled beast with multiple long-necked heads, each filled with menacing fangs.',
    subDescription: 'Devour, regenerate, terrify',
    difficulty: '18',
    thresholds: [19, 35],
    hp: 10,
    stress: 5,
    attack: '+3',
    weapon: 'Bite',
    distance: 'Close',
    damageAmount: '2d12+2',
    damageType: 'physical',
    features: [
      {
        name: 'Many-Headed Menace',
        type: 'passive',
        description:
          'The Hydra begins with three heads and can have up to five. When the Hydra takes Major or greater damage, they lose a head.',
      },
      {
        name: 'Relentless (X)',
        type: 'passive',
        description:
          "The Hydra can be spotlighted X times per GM turn, where X is the Hydra's number of heads. Spend Fear as usual to spotlight them.",
      },
      {
        name: 'Regeneration',
        type: 'action',
        description:
          'If the Hydra has any marked HP, spend a Fear to clear a HP and grow two heads.',
      },
      {
        name: 'Terrifying Chorus',
        type: 'action',
        description: 'All PCs within Far range lose 2 Hope.',
      },
      {
        name: 'Magical Weakness',
        type: 'reaction',
        description:
          "When the Hydra takes magic damage, they become Dazed until the next roll with Fear. While Dazed, they can't use their Regeneration action but are immune to magic damage.",
      },
    ],
  },
  {
    name: 'Monarch',
    tier: 3,
    subtype: 'Social',
    description:
      'The sovereign ruler of a nation, wreathed in the privilege of tradition and wielding unmatched power in their domain.',
    subDescription: 'Control vassals, destroy rivals, forge a legacy',
    difficulty: '16',
    thresholds: [16, 32],
    hp: 6,
    stress: 5,
    attack: '+0',
    weapon: 'Warhammer',
    distance: 'Melee',
    damageAmount: '3d6+3',
    damageType: 'physical',
    experience: 'History +3, Nobility +3',
    features: [
      {
        name: 'Execute Them!',
        type: 'action',
        description:
          'Spend a Fear per PC in the party to have the group condemned for crimes real or imagined. A PC who succeeds on a Presence Roll can demand trial by combat or another special form of trial.',
      },
      {
        name: 'Crownsguard',
        type: 'action',
        description:
          "Once per scene, mark a Stress to summon six Tier 3 Minions, who appear at Close range to enforce the Monarch's will.",
      },
      {
        name: 'Casus Belli',
        type: 'reaction',
        description:
          "Spend a Fear to activate after the Monarch's desire for war is first revealed. When it triggers, the Monarch has a reason to rally the nation to war and the support to act on that reason. You gain 1d4 Fear.",
      },
    ],
  },
  {
    name: 'Oak Treant',
    tier: 3,
    subtype: 'Bruiser',
    description: 'A sturdy animate old-growth tree.',
    subDescription:
      'Hide in plain sight, preserve the forest, root down, swing branches',
    difficulty: '17',
    thresholds: [22, 40],
    hp: 7,
    stress: 4,
    attack: '+2',
    weapon: 'Branch',
    distance: 'Very Close',
    damageAmount: '3d8+2',
    damageType: 'physical',
    experience: 'Forest Knowledge +3',
    features: [
      {
        name: 'Just a Tree',
        type: 'passive',
        description:
          'Before they make their first attack in a fight or after they become Hidden, the Treant is indistinguishable from other trees until they next act or a PC succeeds on an Instinct Roll to identify them.',
      },
      {
        name: 'Seed Barrage',
        type: 'action',
        description:
          'Mark a Stress and make an attack against up to three targets within Close range, pummeling them with giant acorns. Targets the Treant succeeds against take 2d10+5 physical damage.',
      },
      {
        name: 'Take Root',
        type: 'action',
        description:
          'Mark a Stress to Root the Treant in place. The Treant is Restrained while Rooted, and can end this effect instead of moving while they are spotlighted. While Rooted, the Treant has resistance to physical damage.',
      },
    ],
  },
  {
    name: 'Stag Knight',
    tier: 3,
    subtype: 'Standard',
    description:
      'A knight with huge, majestic antlers wearing armor made of dangerous thorns.',
    subDescription: 'Isolate, maneuver, protect the forest, weed the unwelcome',
    difficulty: '17',
    thresholds: [19, 36],
    hp: 7,
    stress: 5,
    attack: '+3',
    weapon: 'Bramble Sword',
    distance: 'Melee',
    damageAmount: '3d8+3',
    damageType: 'physical',
    experience: 'Forest Knowledge +3',
    features: [
      {
        name: 'From Above',
        type: 'passive',
        description:
          'When the Knight succeeds on a standard attack from above a target, they deal 3d12+3 physical damage instead of their standard damage.',
      },
      {
        name: 'Blade of the Forest',
        type: 'action',
        description:
          "Spend a Fear to make an attack against all targets within Very Close range. Targets the Knight succeeds against take physical damage equal to 3d4 + the target's Major threshold.",
      },
      {
        name: 'Thorny Armor',
        type: 'reaction',
        description:
          'When the Knight takes damage from an attack within Melee range, you can mark a Stress to deal 1d10+5 physical damage to the attacker.',
      },
    ],
  },
  {
    name: 'Treant Sapling',
    tier: 3,
    subtype: 'Minion',
    description: 'A small, sentient tree sapling.',
    subDescription: 'Blend in, preserve the forest, pummel, surround',
    difficulty: '14',
    hp: 1,
    stress: 1,
    attack: '+0',
    weapon: 'Branches',
    distance: 'Melee',
    damageAmount: '8',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (6)',
        type: 'passive',
        description:
          'The Sapling is defeated when they take any damage. For every 6 damage a PC deals to the Sapling, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Treant Saplings within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 8 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Vampire',
    tier: 3,
    subtype: 'Standard',
    description:
      "An intelligent undead with blood-stained lips and a predator's smile.",
    subDescription: 'Bite, charm, deceive, feed, intimidate',
    difficulty: '16',
    thresholds: [18, 35],
    hp: 5,
    stress: 4,
    attack: '+3',
    weapon: 'Rapier',
    distance: 'Melee',
    damageAmount: '3d8',
    damageType: 'physical',
    experience: 'Nocturnal Hunter +3',
    features: [
      {
        name: 'Draining Bite',
        type: 'action',
        description:
          'Make an attack against a target within Melee range. On a success, deal 5d4 physical damage. A target who marks HP from this attack loses a Hope and must mark a Stress. The Vampire then clears a HP.',
      },
      {
        name: 'Mistform',
        type: 'reaction',
        description:
          'When the Vampire takes physical damage, you can spend a Fear to take half damage.',
      },
    ],
  },
  {
    name: 'Vault Guardian Gaoler',
    tier: 3,
    subtype: 'Support',
    description:
      'A boxy, dust-covered construct with thick metallic swinging doors on their torso.',
    subDescription: 'Carry away, entrap, protect, pummel',
    difficulty: '16',
    thresholds: [19, 33],
    hp: 5,
    stress: 3,
    attack: '+2',
    weapon: 'Body Bash',
    distance: 'Very Close',
    damageAmount: '3d6+2',
    damageType: 'physical',
    features: [
      {
        name: 'Blocking Shield',
        type: 'passive',
        description:
          'Creatures within Melee range of the Gaoler have disadvantage on attack rolls against them. Creatures trapped inside the Gaoler are immune to this feature.',
      },
      {
        name: 'Lock Up',
        type: 'action',
        description:
          'Mark a Stress to make an attack against a target within Very Close range. On a success, the target is Restrained within the Gaoler until freed with a successful Strength Roll (18). While Restrained, the target can only attack the Gaoler.',
      },
    ],
  },
  {
    name: 'Vault Guardian Sentinel',
    tier: 3,
    subtype: 'Bruiser',
    description:
      'A dust-covered golden construct with boxy limbs and a huge mace for a hand.',
    subDescription: 'Destroy at any cost, expunge, protect',
    difficulty: '17',
    thresholds: [21, 40],
    hp: 6,
    stress: 3,
    attack: '+3',
    weapon: 'Charged Mace',
    distance: 'Very Close',
    damageAmount: '2d12+1',
    damageType: 'physical',
    features: [
      {
        name: 'Kinetic Slam',
        type: 'passive',
        description:
          "Targets who take damage from the Sentinel's standard attack are knocked back to Very Close range.",
      },
      {
        name: 'Box In',
        type: 'action',
        description:
          "Mark a Stress to choose a target within Very Close range to focus on. That target has disadvantage on attack rolls when they're within Very Close range of the Sentinel. The Sentinel can only focus on one target at a time.",
      },
      {
        name: 'Mana Bolt',
        type: 'action',
        description:
          "Spend a Fear to lob explosive magic at a point within Far range. All targets within Very Close range of that point must make an Agility Reaction Roll. Targets who fail take 2d8+20 magic damage and are knocked back to Close range. Targets who succeed take half damage and aren't knocked back.",
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Sentinel makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Vault Guardian Turret',
    tier: 3,
    subtype: 'Ranged',
    description:
      'A massive living turret with reinforced armor and twelve pistondriven mechanical legs.',
    subDescription: 'Concentrate fire, lock down, mark, protect',
    difficulty: '16',
    thresholds: [20, 32],
    hp: 5,
    stress: 4,
    attack: '+3',
    weapon: 'Magitech Cannon',
    distance: 'Far',
    damageAmount: '3d10+3',
    damageType: 'magic',
    features: [
      {
        name: 'Slow Firing',
        type: 'passive',
        description:
          "When you spotlight the Turret and they don't have a token on their stat block, they can't make a standard attack. Place a token on their stat block and describe what they're preparing to do. When you spotlight the Turret and they have a token on their stat block, clear the token and they can attack.",
      },
      {
        name: 'Mark Target',
        type: 'action',
        description:
          'Spend a Fear to Mark a target within Far range until the Turret is destroyed or the Marked target becomes Hidden. While the target is Marked, their Evasion is halved.',
      },
      {
        name: 'Concentrate Fire',
        type: 'reaction',
        description:
          "When another adversary deals damage to a target within Far range of the Turret, you can mark a Stress to add the Turret's standard attack damage to the damage roll.",
      },
      {
        name: 'Detonation',
        type: 'reaction',
        description:
          'When the Turret is destroyed, they explode. All targets within Close range must make an Agility Reaction Roll. Targets who fail take 3d20 physical damage. Targets who succeed take half damage.',
      },
    ],
  },
  {
    name: 'Young Ice Dragon',
    tier: 3,
    subtype: 'Solo',
    description:
      'A glacier-blue dragon with four powerful limbs and frost-tinged wings.',
    subDescription:
      'Avalanche, defend lair, fly, freeze, defend what is mine, maul',
    difficulty: '18',
    thresholds: [21, 41],
    hp: 10,
    stress: 6,
    attack: '+7',
    weapon: 'Bite and Claws',
    distance: 'Close',
    damageAmount: '4d10',
    damageType: 'physical',
    experience: 'Protect What Is Mine +3',
    features: [
      {
        name: 'Relentless (3)',
        type: 'passive',
        description:
          'The Dragon can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Rend and Crush',
        type: 'passive',
        description:
          "If a target damaged by the Dragon doesn't mark an Armor Slot to reduce the damage, they must mark a Stress.",
      },
      {
        name: 'No Hope',
        type: 'passive',
        description:
          'When a PC rolls with Fear while within Far range of the Dragon, they lose a Hope.',
      },
      {
        name: 'Blizzard Breath',
        type: 'action',
        description:
          'Spend 2 Fear to release an icy whorl in front of the Dragon within Close range. All targets in this area must make an Agility Reaction Roll. Targets who fail take 4d6+5 magic damage and are Restrained by ice until they break free with a successful Strength Roll. Targets who succeed must mark 2 Stress or take half damage.',
      },
      {
        name: 'Avalanche',
        type: 'action',
        description:
          'Spend a Fear to have the Dragon unleash a huge downfall of snow and ice, covering all other creatures within Far range. All targets within this area must succeed on an Instinct Reaction Roll or be buried in snow and rocks, becoming Vulnerable until they dig themselves out from the debris. For each PC that fails the reaction roll, you gain a Fear.',
      },
      {
        name: 'Frozen Scales',
        type: 'reaction',
        description:
          'When a creature makes a successful attack against the Dragon from within Very Close range, they must mark a Stress and become Chilled until their next rest or they clear a Stress. While they are Chilled, they have disadvantage on attack rolls.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Dragon makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Arch-Necromancer',
    tier: 4,
    subtype: 'Leader',
    description: 'A decaying mage adorned in dark, tattered robes.',
    subDescription: 'Corrupt, decay, flee to fight another day, resurrect',
    difficulty: '21',
    thresholds: [33, 66],
    hp: 9,
    stress: 8,
    attack: '+6',
    weapon: 'Necrotic Blast',
    distance: 'Far',
    damageAmount: '4d12+8',
    damageType: 'magic',
    experience: 'Forbidden Knowledge +3, Wisdom of Centuries +3',
    features: [
      {
        name: 'Dance of Death',
        type: 'action',
        description:
          'Mark a Stress to spotlight 1d4 allies. Attacks they make while spotlighted in this way deal half damage, or full damage if you spend a Fear.',
      },
      {
        name: 'Beam of Decay',
        type: 'action',
        description:
          'Mark 2 Stress to cause all targets within Far range to make a Strength Reaction Roll. Targets who fail take 2d20+12 magic damage and you gain a Fear. Targets who succeed take half damage. A target who marks 2 or more HP must also mark 2 Stress and becomes Vulnerable until they roll with Hope.',
      },
      {
        name: 'Open the Gates of Death',
        type: 'action',
        description:
          'Spend a Fear to summon a Zombie Legion, which appears at Close range and immediately takes the spotlight.',
      },
      {
        name: 'Not Today, My Dears',
        type: 'reaction',
        description:
          'When the Necromancer has marked 7 or more of their HP, you can spend a Fear to have them teleport away to a safe location to recover. A PC who succeeds on an Instinct Roll can trace the teleportation magic to their destination.',
      },
      {
        name: 'Your Life Is Mine',
        type: 'reaction',
        description:
          'When the Necromancer has marked 6 or more of their HP, activate the countdown. When it triggers, deal 2d10+6 direct magic damage to a target within Close range. The Necromancer then clears a number of Stress or HP equal to the number of HP marked by the target from this attack.',
      },
    ],
  },
  {
    name: 'Fallen Shock Troop',
    tier: 4,
    subtype: 'Minion',
    description: "A cursed soul bound to the Fallen's will.",
    subDescription: 'Crush, dominate, earn relief, punish',
    difficulty: '18',
    hp: 1,
    stress: 1,
    attack: '+2',
    weapon: 'Cursed Axe',
    distance: 'Very Close',
    damageAmount: '12',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (12)',
        type: 'passive',
        description:
          'The Shock Troop is defeated when they take any damage. For every 12 damage a PC deals to the Shock Troop, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Aura of Doom',
        type: 'passive',
        description:
          'When a PC marks HP from an attack by the Shock Troop, they lose a Hope.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Fallen Shock Troops within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 12 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Fallen Sorcerer',
    tier: 4,
    subtype: 'Support',
    description: 'A powerful mage bound by the bargains they made in life.',
    subDescription: 'Acquire, dishearten, dominate, torment',
    difficulty: '19',
    thresholds: [26, 42],
    hp: 6,
    stress: 5,
    attack: '+4',
    weapon: 'Corrupted Staff',
    distance: 'Far',
    damageAmount: '4d6+10',
    damageType: 'magic',
    experience: 'Ancient Knowledge +2',
    features: [
      {
        name: 'Conflagration',
        type: 'action',
        description:
          'Spend a Fear to unleash an all-consuming firestorm and make an attack against all targets within Close range. Targets the Sorcerer succeeds against take 2d10+6 direct magic damage.',
      },
      {
        name: 'Nightmare Tableau',
        type: 'action',
        description:
          'Mark a Stress to trap a target within Far range in a powerful illusion of their worst fears. While trapped, the target is Restrained and Vulnerable until they break free, ending both conditions, with a successful Instinct Roll.',
      },
      {
        name: 'Slippery',
        type: 'reaction',
        description:
          'When the Sorcerer takes damage from an attack, they can teleport up to Far range.',
      },
      {
        name: 'Shackles of Guilt',
        type: 'reaction',
        description:
          'When the Sorcerer is in the spotlight for the first time, activate the countdown. When it triggers, all targets within Far range become Vulnerable and must mark a Stress as they relive their greatest regrets. A target can break free from their regret with a successful Presence or Strength Roll. When a PC fails to break free, they lose a Hope.',
      },
    ],
  },
  {
    name: 'Fallen Warlord: Realm-Breaker',
    tier: 4,
    subtype: 'Solo',
    description:
      "A Fallen God, wreathed in rage and resentment, bearing millennia of experience in breaking heroes' spirits.",
    subDescription: 'Corrupt, dominate, punish, break the weak',
    difficulty: '20',
    thresholds: [36, 66],
    hp: 8,
    stress: 5,
    attack: '+7',
    weapon: 'Barbed Whip',
    distance: 'Close',
    damageAmount: '4d8+7',
    damageType: 'physical',
    experience: 'Conquest +3, History +2, Intimidation +3',
    features: [
      {
        name: 'Relentless (2)',
        type: 'passive',
        description:
          'The Realm-Breaker can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Firespite Plate Armor',
        type: 'passive',
        description: 'When the Realm-Breaker takes damage, reduce it by 2d10.',
      },
      {
        name: 'Tormenting Lash',
        type: 'action',
        description:
          'Mark a Stress to make a standard attack against all targets within Very Close range. When a target uses armor to reduce damage from this attack, they must mark 2 Armor Slots.',
      },
      {
        name: 'All-Consuming Rage',
        type: 'reaction',
        description:
          'When the Realm-Breaker is in the spotlight for the first time, activate the countdown. When it triggers, create a torrent of incarnate rage that rends flesh from bone. All targets within Far range must make a Presence Reaction Roll. Targets who fail take 2d6+10 direct magic damage. Targets who succeed take half damage. For each HP marked from this damage, summon a Fallen Shock Troop within Very Close range of the target who marked that HP. If the countdown ever decreases its maximum value to 0, the Realm-Breaker marks their remaining HP and all targets within Far range must mark all remaining HP and make a death move.',
      },
      {
        name: 'Doombringer',
        type: 'reaction',
        description:
          'When a target marks HP from an attack by the Realm-Breaker, all PCs within Far range of the target must lose a Hope.',
      },
      {
        name: 'I Have Never Known Defeat (Phase Change)',
        type: 'reaction',
        description:
          'When the Realm-Breaker marks their last HP, replace them with the Undefeated Champion and immediately spotlight them.',
      },
    ],
  },
  {
    name: 'Fallen Warlord: Undefeated Champion',
    tier: 4,
    subtype: 'Solo',
    description: 'That which only the most feared have a chance to fear.',
    subDescription:
      'Dispatch merciless death, punish the defiant, secure victory at any cost',
    difficulty: '18',
    thresholds: [35, 58],
    hp: 11,
    stress: 5,
    attack: '+8',
    weapon: 'Heart-Shattering Sword',
    distance: 'Very Close',
    damageAmount: '4d12+13',
    damageType: 'physical',
    experience: 'Conquest +3, History +2, Intimidation +3',
    features: [
      {
        name: 'Relentless (3)',
        type: 'passive',
        description:
          'The Undefeated Champion can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Faltering Armor',
        type: 'passive',
        description:
          'When the Undefeated Champion takes damage, reduce it by 1d10.',
      },
      {
        name: 'Shattering Strike',
        type: 'action',
        description:
          'Mark a Stress to make a standard attack against all targets within Very Close range. PCs the Champion succeeds against lose a number of Hope equal to the HP they marked from this attack.',
      },
      {
        name: 'Endless Legions',
        type: 'action',
        description:
          'Spend a Fear to summon a number of Fallen Shock Troops equal to twice the number of PCs. The Shock Troops appear at Far range.',
      },
      {
        name: 'Circle of Defilement',
        type: 'reaction',
        description:
          'When the Undefeated Champion is in the spotlight for the first time, activate the countdown. When it triggers, activate a magical circle covering an area within Far range of the Champion. A target within that area is Vulnerable until they leave the circle. The circle can be removed by dealing Severe damage to the Undefeated Champion.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Undefeated Champion makes a successful attack against a PC, you gain a Fear.',
      },
      {
        name: 'Doombringer',
        type: 'reaction',
        description:
          'When a target marks HP from an attack by the Undefeated Champion, all PCs within Far range of the target lose a Hope.',
      },
    ],
  },
  {
    name: 'Hallowed Archer',
    tier: 4,
    subtype: 'Ranged',
    description: 'Spirit soldiers with sanctified bows.',
    subDescription: 'Focus fire, obey, reposition, volley',
    difficulty: '19',
    thresholds: [25, 45],
    hp: 3,
    stress: 2,
    attack: '+4',
    weapon: 'Sanctified Longbow',
    distance: 'Far',
    damageAmount: '4d8+8',
    damageType: 'physical',
    features: [
      {
        name: 'Punish the Guilty',
        type: 'passive',
        description:
          'The Archer deals double damage to targets marked Guilty by a High Seraph.',
      },
      {
        name: 'Divine Volley',
        type: 'action',
        description:
          'Mark a Stress to make a standard attack against up to three targets.',
      },
    ],
  },
  {
    name: 'Hallowed Soldier',
    tier: 4,
    subtype: 'Minion',
    description: 'Souls of the faithful, lifted up with divine weaponry.',
    subDescription: 'Obey, outmaneuver, punish, swarm',
    difficulty: '18',
    hp: 1,
    stress: 2,
    attack: '+2',
    weapon: 'Sword and Shield',
    distance: 'Melee',
    damageAmount: '10',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (13)',
        type: 'passive',
        description:
          'The Soldier is defeated when they take any damage. For every 13 damage a PC deals to the Soldier, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Divine Flight',
        type: 'passive',
        description:
          'While the Soldier is flying, spend a Fear to move up to Far range instead of Close range before taking an action.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Hallowed Soldiers within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 10 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'High Seraph',
    tier: 4,
    subtype: 'Leader',
    description:
      "A divine champion, head of a hallowed host of warriors who enforce their god's will.",
    subDescription: 'Enforce dogma, fly, pronounce judgment, smite',
    difficulty: '20',
    thresholds: [37, 70],
    hp: 7,
    stress: 5,
    attack: '+8',
    weapon: 'Holy Sword',
    distance: 'Very Close',
    damageAmount: '4d10+10',
    damageType: 'physical',
    experience: 'Divine Knowledge +3',
    features: [
      {
        name: 'Relentless (3)',
        type: 'passive',
        description:
          'The Seraph can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Divine Flight',
        type: 'passive',
        description:
          'While the Seraph is flying, spend a Fear to move up to Far range instead of Close range before taking an action.',
      },
      {
        name: 'Judgment',
        type: 'action',
        description:
          "Spend a Fear to make a target Guilty in the eyes of the Seraph's god until the Seraph is defeated. While Guilty, the target doesn't gain Hope on a result with Hope. When the Seraph succeeds on a standard attack against a Guilty target, they deal Severe damage instead of their standard damage. The Seraph can only mark one target at a time.",
      },
      {
        name: 'God Rays',
        type: 'action',
        description:
          'Mark a Stress to reflect a sliver of divinity as a searing beam of light that hits up to twenty targets within Very Far range. Targets must make a Presence Reaction Roll, with disadvantage if they are marked Guilty. Targets who fail take 4d6+12 magic damage. Targets who succeed take half damage.',
      },
      {
        name: 'We Are One',
        type: 'action',
        description:
          'Once per scene, spend a Fear to spotlight all other adversaries within Far range. Attacks they make while spotlighted in this way deal half damage.',
      },
    ],
  },
  {
    name: 'Kraken',
    tier: 4,
    subtype: 'Solo',
    description:
      'A legendary beast of the sea, bigger than the largest galleon, with sucker-laden tentacles and a terrifying maw.',
    subDescription: 'Consume, crush, drown, grapple',
    difficulty: '20',
    thresholds: [35, 70],
    hp: 11,
    stress: 8,
    attack: '+7',
    weapon: 'Tentacles',
    distance: 'Close',
    damageAmount: '4d12+10',
    damageType: 'physical',
    experience: 'Swimming +3',
    features: [
      {
        name: 'Relentless (3)',
        type: 'passive',
        description:
          'The Kraken can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Many Tentacles',
        type: 'passive',
        description:
          'While the Kraken has 7 or fewer marked HP, they can make their standard attack against two targets within range.',
      },
      {
        name: 'Grapple and Drown',
        type: 'action',
        description:
          'Make an attack roll against a target within Close range. On a success, mark a Stress to grab them with a tentacle and drag them beneath the water. The target is Restrained and Vulnerable until they break free with a successful Strength Roll or the Kraken takes Major or greater damage. While Restrained and Vulnerable in this way, a target must mark a Stress when they make an action roll.',
      },
      {
        name: 'Boiling Blast',
        type: 'action',
        description:
          'Spend a Fear to spew a line of boiling water at any number of targets in a line up to Far range. All targets must succeed on an Agility Reaction Roll or take 4d6+9 physical damage. If a target marks an Armor Slot to reduce the damage, they must also mark a Stress.',
      },
      {
        name: 'Momentum',
        type: 'reaction',
        description:
          'When the Kraken makes a successful attack against a PC, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Oracle of Doom',
    tier: 4,
    subtype: 'Solo',
    description:
      'A towering immortal and incarnation of fate, cursed to only see bad outcomes.',
    subDescription: 'Change environment, condemn, dishearten, toss aside',
    difficulty: '20',
    thresholds: [38, 68],
    hp: 11,
    stress: 10,
    attack: '+8',
    weapon: 'Psychic Attack',
    distance: 'Far',
    damageAmount: '4d8+9',
    damageType: 'magic',
    experience: 'Boundless Knowledge +4',
    features: [
      {
        name: 'Terrifying',
        type: 'passive',
        description:
          'When the Oracle makes a successful attack, all PCs within Far range lose a Hope and you gain a Fear.',
      },
      {
        name: 'Walls Closing In',
        type: 'passive',
        description:
          'When a creature rolls a failure while within Very Far range of the Oracle, they must mark a Stress.',
      },
      {
        name: 'Pronounce Fate',
        type: 'action',
        description:
          'Spend a Fear to present a target within Far range with a vision of their personal nightmare. The target must make a Knowledge Reaction Roll. On a failure, they lose all Hope and take 2d20+4 direct magic damage. On a success, they take half damage and lose a Hope.',
      },
      {
        name: 'Summon Tormentors',
        type: 'action',
        description:
          "Once per day, spend 2 Fear to summon 2d4 Tier 2 or below Minions relevant to one of the PC's personal nightmares. They appear at Close range relative to that PC.",
      },
      {
        name: 'Ominous Knowledge',
        type: 'reaction',
        description:
          'When the Oracle sees a mortal creature, they instantly know one of their personal nightmares.',
      },
      {
        name: 'Vengeful Fate',
        type: 'reaction',
        description:
          'When the Oracle marks HP from an attack within Very Close range, you can mark a Stress to knock the attacker back to Far range and deal 2d10+4 physical damage.',
      },
    ],
  },
  {
    name: 'Outer Realms Abomination',
    tier: 4,
    subtype: 'Bruiser',
    description: 'A chaotic mockery of life, constantly in flux.',
    subDescription: 'Demolish, devour, undermine',
    difficulty: '19',
    thresholds: [35, 71],
    hp: 7,
    stress: 5,
    attack: '+2d4',
    weapon: 'Massive Pseudopod',
    distance: 'Very Close',
    damageAmount: '4d6+13',
    damageType: 'magic',
    features: [
      {
        name: 'Chaotic Form',
        type: 'passive',
        description:
          'When the Abomination attacks, roll 2d4 and use the result as their attack modifier.',
      },
      {
        name: 'Disorienting Presence',
        type: 'passive',
        description:
          'When a target takes damage from the Abomination, they must make an Instinct Reaction Roll. On a failure, they gain disadvantage on their next action roll and you gain a Fear.',
      },
      {
        name: 'Reality Quake',
        type: 'action',
        description:
          'Spend a Fear to rattle the edges of reality within Far range of the Abomination. All targets within that area must succeed on a Knowledge Reaction Roll or become Unstuck from reality until the end of the scene. When an Unstuck target spends Hope or marks Armor Slots, HP, or Stress, they must double the amount spent or marked.',
      },
      {
        name: 'Unreal Form',
        type: 'reaction',
        description:
          'When the Abomination takes damage, reduce it by 1d20. If the Abomination marks 1 or fewer Hit Points from a successful attack against them, you gain a Fear.',
      },
    ],
  },
  {
    name: 'Outer Realms Corruptor',
    tier: 4,
    subtype: 'Support',
    description: 'A shifting, formless mass seemingly made of chromatic light.',
    subDescription: 'Confuse, distract, overwhelm',
    difficulty: '19',
    thresholds: [27, 47],
    hp: 4,
    stress: 3,
    attack: '+7',
    weapon: 'Corroding Pseudopod',
    distance: 'Very Close',
    damageAmount: '4d8+5',
    damageType: 'magic',
    features: [
      {
        name: 'Will-Shattering Touch',
        type: 'passive',
        description:
          'When a PC takes damage from the Corruptor, they lose a Hope.',
      },
      {
        name: 'Disgorge Reality Flotsam',
        type: 'action',
        description:
          'Mark a Stress to spew partially digested portions of consumed realities at all targets within Close range. Targets must succeed on a Knowledge Reaction Roll or mark 2 Stress.',
      },
    ],
  },
  {
    name: 'Outer Realms Thrall',
    tier: 4,
    subtype: 'Minion',
    description: 'A vaguely humanoid form stripped of memory and identity.',
    subDescription: 'Destroy, disgust, disorient, intimidate',
    difficulty: '17',
    hp: 1,
    stress: 1,
    attack: '+3',
    weapon: 'Claws and Teeth',
    distance: 'Very Close',
    damageAmount: '11',
    damageType: 'physical',
    features: [
      {
        name: 'Minion (13)',
        type: 'passive',
        description:
          'The Thrall is defeated when they take any damage. For every 13 damage a PC deals to the Thrall, defeat an additional Minion within range the attack would succeed against.',
      },
      {
        name: 'Group Attack',
        type: 'action',
        description:
          'Spend a Fear to choose a target and spotlight all Outer Realm Thralls within Close range of them. Those Minions move into Melee range of the target and make one shared attack roll. On a success, they deal 11 physical damage each. Combine this damage.',
      },
    ],
  },
  {
    name: 'Perfected Zombie',
    tier: 4,
    subtype: 'Bruiser',
    description:
      'A towering, muscular zombie with magically infused strength and skill.',
    subDescription: 'Consume, hound, maim, terrify',
    difficulty: '20',
    thresholds: [40, 70],
    hp: 9,
    stress: 4,
    attack: '+4',
    weapon: 'Greataxe',
    distance: 'Very Close',
    damageAmount: '4d12+15',
    damageType: 'physical',
    features: [
      {
        name: 'Terrifying',
        type: 'passive',
        description:
          'When the Zombie makes a successful attack, all PCs within Far range lose a Hope and you gain a Fear.',
      },
      {
        name: 'Fearsome Presence',
        type: 'passive',
        description: "PCs can't spend Hope to use features against the Zombie.",
      },
      {
        name: 'Perfect Strike',
        type: 'action',
        description:
          'Mark a Stress to make a standard attack against all targets within Very Close range. Targets the Zombie succeeds against are Vulnerable until their next rest.',
      },
      {
        name: 'Skilled Opportunist',
        type: 'reaction',
        description:
          "When another adversary deals damage to a target within Very Close range of the Zombie, you can spend a Fear to add the Zombie's standard attack damage to the damage roll.",
      },
    ],
  },
  {
    name: 'Volcanic Dragon: Ashen Tyrant',
    tier: 4,
    subtype: 'Solo',
    description:
      "No enemy has ever had the insolence to wound the dragon so. As the lava settles, it's ground to ash like the dragon's past foes.",
    subDescription: 'Choke, fly, intimidate, kill or be killed',
    difficulty: '18',
    thresholds: [29, 55],
    hp: 8,
    stress: 5,
    attack: '+10',
    weapon: 'Claws and Teeth',
    distance: 'Close',
    damageAmount: '4d12+15',
    damageType: 'physical',
    experience: 'Hunt from Above +5',
    features: [
      {
        name: 'Relentless (4)',
        type: 'passive',
        description:
          'The Ashen Tyrant can be spotlighted up to four times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Cornered',
        type: 'passive',
        description:
          'Mark a Stress instead of spending a Fear to spotlight the Ashen Tyrant.',
      },
      {
        name: 'Injured Wings',
        type: 'passive',
        description:
          'While flying, the Ashen Tyrant gains a +1 bonus to their Difficulty.',
      },
      {
        name: 'Ashes to Ashes',
        type: 'passive',
        description:
          "When a PC rolls a failure while within Close range of the Ashen Tyrant, they lose a Hope and you gain a Fear. If the PC can't lose a Hope, they must mark a HP.",
      },
      {
        name: 'Desperate Rampage',
        type: 'action',
        description:
          'Mark a Stress to make an attack against all targets within Close range. Targets the Ashen Tyrant succeeds against take 2d20+2 physical damage, are knocked back to Close range of where they were, and must mark a Stress.',
      },
      {
        name: 'Ashen Cloud',
        type: 'action',
        description:
          'Spend a Fear to smash the ground and kick up ash within Far range. While within the ash cloud, a target has disadvantage on action rolls. The ash cloud clears the next time an adversary is spotlighted.',
      },
      {
        name: 'Apocalyptic Thrashing',
        type: 'action',
        description:
          'Spend a Fear to activate. It ticks down when a PC rolls with Fear. When it triggers, the Ashen Tyrant thrashes about, causing environmental damage (such as an earthquake, avalanche, or collapsing walls). All targets within Far range must make a Strength Reaction Roll. Targets who fail take 2d10+10 physical damage and are Restrained by the rubble until they break free with a successful Strength Roll. Targets who succeed take half damage. If the Ashen Tyrant is defeated while this countdown is active, trigger the countdown immediately as the destruction caused by their death throes.',
      },
    ],
  },
  {
    name: 'Volcanic Dragon: Molten Scourge',
    tier: 4,
    subtype: 'Solo',
    description: 'Enraged by their wounds, the dragon bursts into molten lava.',
    subDescription: 'Douse with lava, incinerate, repel Invaders, reposition',
    difficulty: '20',
    thresholds: [30, 58],
    hp: 7,
    stress: 5,
    attack: '+9',
    weapon: 'Lava-Coated Claws',
    distance: 'Close',
    damageAmount: '4d12+4',
    damageType: 'physical',
    experience: 'Hunt from Above +5',
    features: [
      {
        name: 'Relentless (3)',
        type: 'passive',
        description:
          'The Molten Scourge can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Cracked Scales',
        type: 'passive',
        description:
          'When the Molten Scourge takes damage, roll a number of d6s equal to HP marked. For each result of 4 or higher, you gain a Fear.',
      },
      {
        name: 'Shattering Might',
        type: 'action',
        description:
          'Mark a Stress to make an attack against a target within Very Close range. On a success, the target takes 4d8+1 physical damage, loses a Hope, and is knocked back to Close range. The Molten Scourge clears a Stress.',
      },
      {
        name: 'Eruption',
        type: 'action',
        description:
          "Spend a Fear to erupt lava from beneath the Molten Scourge's scales, filling the area within Very Close range with molten lava. All targets in that area must succeed on an Agility Reaction Roll or take 4d6+6 physical damage and be knocked back to Close range. This area remains lava. When a creature other than the Molten Scourge enters that area or acts while inside of it, they must mark 6 HP.",
      },
      {
        name: 'Volcanic Breath',
        type: 'reaction',
        description:
          'When the Molten Scourge takes Major damage, roll a d10. On a result of 8 or higher, the Molten Scourge breathes a flow of lava in front of them within Far range. All targets in that area must make an Agility Reaction Roll. Targets who fail take 2d10+4 physical damage, mark 1d4 Stress, and are Vulnerable until they clear a Stress. Targets who succeed take half damage and must mark a Stress.',
      },
      {
        name: 'Lava Splash',
        type: 'reaction',
        description:
          'When the Molten Scourge takes Severe damage from an attack within Very Close range, molten blood gushes from the wound and deals 2d10+4 direct physical damage to the attacker.',
      },
      {
        name: 'Ashen Vengeance (Phase Change)',
        type: 'reaction',
        description:
          'When the Molten Scourge marks their last HP, replace them with the Ashen Tyrant and immediately spotlight them.',
      },
    ],
  },
  {
    name: 'Volcanic Dragon: Obsidian Predator',
    tier: 4,
    subtype: 'Solo',
    description:
      'A massive winged creature with obsidian scales and impossibly sharp claws.',
    subDescription: 'Defend lair, dive-bomb, fly, hunt, intimidate',
    difficulty: '19',
    thresholds: [33, 65],
    hp: 6,
    stress: 5,
    attack: '+8',
    weapon: 'Obsidian Claws',
    distance: 'Close',
    damageAmount: '4d10+4',
    damageType: 'physical',
    experience: 'Hunt from Above +5',
    features: [
      {
        name: 'Relentless (2)',
        type: 'passive',
        description:
          'The Obsidian Predator can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Flying',
        type: 'passive',
        description:
          'While flying, the Obsidian Predator gains a +3 bonus to their Difficulty.',
      },
      {
        name: 'Obsidian Scales',
        type: 'passive',
        description: 'The Obsidian Predator is resistant to physical damage.',
      },
      {
        name: 'Avalanche Tail',
        type: 'action',
        description:
          'Mark a Stress to make an attack against all targets within Close range. Targets the Obsidian Predator succeeds against take 4d6+4 physical damage and are knocked back to Far range and Vulnerable until their next roll with Hope.',
      },
      {
        name: 'Dive-Bomb',
        type: 'action',
        description:
          'If the Obsidian Predator is flying, mark a Stress to choose a point within Far range. Move to that point and make an attack against all targets within Very Close range. Targets the Obsidian Predator succeeds against take 2d10+6 physical damage and must mark a Stress and lose a Hope.',
      },
      {
        name: 'Erupting Rage (Phase Change)',
        type: 'reaction',
        description:
          'When the Obsidian Predator marks their last HP, replace them with the Molten Scourge and immediately spotlight them.',
      },
    ],
  },
  {
    name: 'Zombie Legion',
    tier: 4,
    subtype: 'Horde (3/HP)',
    description:
      'A large pack of undead, still powerful despite their rotting flesh.',
    subDescription: 'Consume brain, shred flesh, surround',
    difficulty: '17',
    thresholds: [25, 45],
    hp: 8,
    stress: 5,
    attack: '+2',
    weapon: 'Undead Hands',
    distance: 'Close',
    damageAmount: '4d6+10',
    damageType: 'physical',
    features: [
      {
        name: 'Horde (2d6+5)',
        type: 'passive',
        description:
          'When the Legion has marked half or more of their HP, their standard attack deals 2d6+5 physical damage instead.',
      },
      {
        name: 'Unyielding',
        type: 'passive',
        description: 'The Legion has resistance to physical damage.',
      },
      {
        name: 'Relentless (2)',
        type: 'passive',
        description:
          'The Legion can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.',
      },
      {
        name: 'Overwhelm',
        type: 'reaction',
        description:
          'When the Legion takes Minor damage from an attack within Melee range, you can mark a Stress to make a standard attack with advantage against the attacker.',
      },
    ],
  },
];

export const adversaries: AdversaryDetails[] = preAdversaries.map(
  (adversary) => ({
    ...adversary,
    type: 'adversary',
    text: `${adversary.features
      .map(
        (feat) =>
          `<p><strong><em>${capitalize(feat.name)} - ${capitalize(feat.type)}: </em></strong> ${feat.description}</p>
      ${feat.extra ? feat.extra : ''}
      ${feat.flavor ? `<p><em>${feat.flavor}</em></p>` : ''}`,
      )
      .join('')}`,
  }),
);
