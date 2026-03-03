import { capitalize } from '@/lib/utils';
import type { PreAdversaryDetails } from '../types';

const preEnvironments: PreAdversaryDetails[] = [
  {
    name: 'Abandoned Grove',
    tier: 1,
    subtype: 'Exploration',
    description:
      'A former druidic grove lying fallow and fully reclaimed by nature.',
    subDescription: 'Draw in the curious, echo the past',
    difficulty: '11',
    potential:
      'Beasts (Bear, Dire Wolf, Glass Snake), Grove Guardians (Minor Treant, Sylvan Soldier, Young Dryad)',
    features: [
      {
        name: 'Overgrown Battlefield',
        type: 'passive',
        description:
          'There has been a battle here. A PC can make an Instinct Roll to identify evidence of that fight. On a success with Hope, learn all three pieces of information below. On a success with Fear, learn two. On a failure, a PC can mark a Stress to learn one and gain advantage on the next action roll to investigate this environment. A PC with an appropriate background or Experience can learn an additional detail and ask a follow-up question about the scene and get a truthful (if not always complete) answer.',
        extra: `
        <ul class="list-outside list-disc pl-4">
        <li>Traces of a battle (broken weapons and branches, gouges in the ground) litter the ground.</li>
        <li>A moss-covered tree trunk is actually the corpse of a treant.</li>
        <li>Still-standing trees are twisted in strange ways, as if by powerful magic.</li>
        </ul>
        `,
        flavor:
          'Why did these groups come to blows? Why is the grove unused now?',
      },
      {
        name: 'Barbed Vines',
        type: 'action',
        description:
          "Pick a point within the grove. All targets within Very Close range of that point must succeed on an Agility Reaction Roll or take 1d8+3 physical damage and become Restrained by barbed vines. Restrained lasts until they're freed with a successful Finesse or Strength roll or by dealing at least 6 damage to the vines.",
        flavor:
          'How many vines are there? Where do they grab you? Do they pull you down or lift you off the ground?',
      },
      {
        name: 'You Are Not Welcome Here',
        type: 'action',
        description:
          'A Young Dryad, two Sylvan Soldiers, and a number of Minor Treants equal to the number of PCs appear to confront the party for their intrusion.',
        flavor:
          'What are the grove guardians concealing? What threat to the forest could the PCs confront to appease the Dryad?',
      },
      {
        name: 'Defiler',
        type: 'action',
        description:
          'Spend a Fear to summon a Minor Chaos Elemental drawn to the echoes of violence and discord. They appear within Far range of a chosen PC and immediately take the spotlight.',
        flavor:
          'What color does the grass turn as the elemental appears? How does the chaos warp insects and small wildlife within the grove?',
      },
    ],
  },
  {
    name: 'Ambushed',
    tier: 1,
    subtype: 'Event',
    description: 'An ambush is set to catch an unsuspecting party off-guard.',
    subDescription: 'Overwhelm, scatter, surround',
    difficulty: 'Special (see "Relative Strength")',
    features: [
      {
        name: 'Relative Strength',
        type: 'passive',
        description:
          'The Difficulty of this environment equals that of the adversary with the highest Difficulty.',
        flavor: "Who cues the ambush? What makes it clear they're in charge?",
      },
      {
        name: 'Surprise!',
        type: 'action',
        description:
          'The ambushers reveal themselves to the party, you gain 2 Fear, and the spotlight immediately shifts to one of the ambushing adversaries.',
        flavor:
          'What do the ambushers want from the party? How do their tactics in the ambush reflect that?',
      },
    ],
  },
  {
    name: 'Ambushers',
    tier: 1,
    subtype: 'Event',
    description:
      'An ambush is set by the PCs to catch unsuspecting adversaries off-guard.',
    subDescription: 'Escape, group up, protect the most vulnerable',
    difficulty: 'Special (see "Relative Strength")',
    features: [
      {
        name: 'Relative Strength',
        type: 'passive',
        description:
          'The Difficulty of this environment equals that of the adversary with the highest Difficulty.',
        flavor: 'Which adversary is the least prepared? Which one is the most?',
      },
      {
        name: 'Where Did They Come From?',
        type: 'reaction',
        description:
          'When a PC starts the ambush on unsuspecting adversaries, you lose 2 Fear and the first attack roll a PC makes has advantage.',
        flavor:
          'What are the adversaries in the middle of doing when the ambush starts? How does this impact their approach to the fight?',
      },
    ],
  },
  {
    name: 'Bustling Marketplace',
    tier: 1,
    subtype: 'Social',
    description:
      'The economic heart of the settlement, with local artisans, traveling merchants, and patrons across social classes.',
    subDescription:
      'Buy low, and sell high, tempt and tantalize with wares from near and far',
    difficulty: '10',
    potential: 'Guards (Bladed Guard, Head Guard), Masked Thief, Merchant',
    features: [
      {
        name: 'Tip the Scales',
        type: 'passive',
        description:
          'PCs can gain advantage on a Presence Roll by offering a handful of gold as part of the interaction.',
        flavor:
          'Will any coin be accepted, or only local currency? How overt are the PCs in offering this bribe?',
      },
      {
        name: 'Unexpected Find',
        type: 'action',
        description:
          'Reveal to the PCs that one of the merchants has something they want or need, such as food from their home, a rare book, magical components, a dubious treasure map, or a magical key.',
        flavor:
          'What cost beyond gold will the merchant ask for in exchange for this rarity?',
      },
      {
        name: 'Sticky Fingers',
        type: 'action',
        description:
          "A thief tries to steal something from a PC. The PC must succeed on an Instinct Roll to notice the thief or lose an item of the GM's choice as the thief escapes to a Close distance. To retrieve the stolen item, the PCs must complete a Progress Countdown (6) to chase down the thief before the thief completes a Consequence Countdown (4) and escapes to their hideout.",
        flavor:
          "What drove this person to pickpocketing? Where is the thief's hideout and how has it avoided notice?",
      },
      {
        name: 'Crowd Closes In',
        type: 'reaction',
        description:
          'When one of the PCs splits from the group, the crowds shift and cut them off from the party.',
        flavor:
          "Where does the crowd's movement carry them? How do they feel about being alone but surrounded?",
      },
    ],
  },
  {
    name: 'Cliffside Ascent',
    tier: 1,
    subtype: 'Traversal',
    description:
      'A steep, rocky cliff side tall enough to make traversal dangerous.',
    subDescription:
      'Cast the unready down to a rocky doom, draw people in with promise of what lies at the top',
    difficulty: '12',
    potential: 'Construct, Deeproot Defender, Giant Scorpion, Glass Snake',
    features: [
      {
        name: 'The Climb',
        type: 'passive',
        description:
          'Climbing up the cliff side uses a Progress Countdown (12). It ticks down according to the following criteria when the PCs make an action roll to climb:',
        extra: `
        <ul class="list-outside list-disc pl-4">
        <li>Critical Success: Tick down 3</li>
        <li>Success with Hope: Tick down 2</li>
        <li>Success with Fear: Tick down 1</li>
        <li>Failure with Hope: No advancement</li>
        <li>Failure with Fear: Tick up 1</li>
        </ul>
        <p>When the countdown triggers, the party has made it to the top of the cliff.</p>
        `,
        flavor:
          'What strange formations are the stones arranged in? What ominous warnings did previous adventurers leave?',
      },
      {
        name: 'Pitons Left Behind',
        type: 'passive',
        description:
          'Previous climbers left behind large metal rods that climbers can use to aid their ascent. If a PC using the pitons fails an action roll to climb, they can mark a Stress instead of ticking the countdown up.',
        flavor:
          'What do the shape and material of these pitons tell you about the previous climbers? How far apart are they from one another?',
      },
      {
        name: 'Fall',
        type: 'action',
        description:
          "Spend a Fear to have a PC's handhold fail, plummeting them toward the ground. If they aren't saved on the next action, they hit the ground and tick up the countdown by 2. The PC takes 1d12 physical damage if the countdown is between 8 and 12, 2d12 between 4 and 7, and 3d12 at 3 or lower.",
        flavor:
          'How can you tell many others have fallen here before? What lives in these walls that might try to scare adventurers into falling for an easy meal?',
      },
    ],
  },
  {
    name: 'Local Tavern',
    tier: 1,
    subtype: 'Social',
    description: 'A lively tavern that serves as the social hub for its town.',
    subDescription: 'Provide opportunities for adventurers, nurture community',
    difficulty: '10',
    potential:
      'Guards (Bladed Guard, Head Guard), Mercenaries (Harrier, Sellsword, Spellblade, Weaponmaster), Merchant',
    features: [
      {
        name: "What's the Talk of the Town?",
        type: 'passive',
        description:
          'A PC can ask the bartender, staff, or patrons about local events, rumors, and potential work with a Presence Roll. On a success, they can pick two of the below details to learn—or three if they critically succeed. On a failure, they can pick one and mark a Stress as the local carries on about something irrelevant.',
        extra: `
        <ul class="list-outside list-disc pl-4">
        <li>A fascinating rumor with a connection to a PC's background</li>
        <li>A promising job for the party involving a nearby threat or situation</li>
        <li>Local folklore that relates to something they've seen</li>
        <li>Town gossip that hints at a community problem</li>
        </ul>
        `,
        flavor:
          'Who has what kind of information? What gossip do the locals start spreading about the PCs?',
      },
      {
        name: 'Sing For Your Supper',
        type: 'passive',
        description:
          'A PC can perform one time for the guests by making a Presence Roll. On a success, they earn 1d4 handfuls of gold (2d4 if they critically succeed). On a failure, they mark a Stress.',
        flavor:
          "What piece do you perform? What does that piece mean to you? When's the last time you performed it for a crowd?",
      },
      {
        name: 'Mysterious Stranger',
        type: 'action',
        description:
          'Reveal a stranger concealing their identity, lurking in a shaded booth.',
        flavor:
          "What do they want? What's their impression of the PCs? What mannerisms or accessories do they have?",
      },
      {
        name: 'Someone Comes to Town',
        type: 'action',
        description:
          "Introduce a significant NPC who wants to hire the party for something or who relates to a PC's background.",
        flavor:
          'Did they know the PCs were here? What do they want in this town?',
      },
      {
        name: 'Bar Fight!',
        type: 'action',
        description:
          'Spend a Fear to have a bar fight erupt in the tavern. When a PC tries to move through the tavern while the fight persists, they must succeed on an Agility or Presence Roll or take 1d6+2 physical damage from a wild swing or thrown object. A PC can try to activate this feature by succeeding on an action roll that would provoke tavern patrons.',
        flavor: 'Who started the fight? What will it take to stop it?',
      },
    ],
  },
  {
    name: 'Outpost Town',
    tier: 1,
    subtype: 'Social',
    description:
      'A small town on the outskirts of a nation or region, close to a dungeon, tombs, or other adventuring destinations.',
    subDescription:
      'Drive the desperate to certain doom, profit off of ragged hope',
    difficulty: '12',
    potential:
      'Jagged Knife Bandits (Hexer, Kneebreaker, Lackey, Lieutenant, Shadow, Sniper), Masked Thief, Merchant',
    features: [
      {
        name: 'Rumors Abound',
        type: 'passive',
        description:
          'Gossip is the fastest-traveling currency in the realm. A PC can inquire about major events by making a Presence Roll. What they learn depends on the outcome of their roll, based on the following criteria.',
        extra: `
        <ul class="list-outside list-disc pl-4">
        <li>Critical Success: Learn about two major events. The PC can ask one follow-up question about one of the rumors and get a truthful (if not always complete) answer.</li>
        <li>Success with Hope: Learn about two events, at least one of which is relevant to the character's background.</li>
        <li>Success with Fear: Learn an alarming rumor related to the character's background.</li>
        <li>Any Failure: The locals respond poorly to their inquiries. The PC must mark a Stress to learn one relevant rumor.</li>
        </ul>
        `,
        flavor:
          'What news do the PCs have that they could pass along to curious travelers? What do the locals think about these events?',
      },
      {
        name: 'Society of the Broken Compass',
        type: 'passive',
        description:
          'An adventuring society maintains a chapterhouse here, where heroes trade boasts and rumors, drink to their imagined successes, and scheme to undermine their rivals.',
        flavor:
          'What boasts do the adventurers here make, and which do you think are true?',
      },
      {
        name: 'Rival Party',
        type: 'passive',
        description:
          'Another adventuring party is here, seeking the same treasure or leads as the PCs.',
        flavor:
          'Which PC has a connection to one of the rival party members? Do they approach the PC first or do they wait for the PC to move?',
      },
      {
        name: "It'd Be a Shame If Something Happened to Your Store",
        type: 'action',
        description:
          'The PCs witness as agents of a local crime boss shake down a general goods store.',
        flavor: 'What trouble does it cause if the PCs intervene?',
      },
      {
        name: 'Wrong Place, Wrong Time',
        type: 'reaction',
        description:
          'At night, or when the party is alone in a back alley, you can spend a Fear to introduce a group of thieves who try to rob them. The thieves appear at Close range of a chosen PC and include a Jagged Knife Kneebreaker, as many Lackeys as there are PCs, and a Lieutenant. For a larger party, add a Hexer or Sniper.',
        flavor:
          'What details show the party that these people are desperate former adventurers?',
      },
    ],
  },
  {
    name: 'Raging River',
    tier: 1,
    subtype: 'Traversal',
    description:
      'A swift-moving river without a bridge crossing, deep enough to sweep away most people.',
    subDescription: 'Bar crossing, carry away the unready, divide the land',
    difficulty: '10',
    potential:
      'Beasts (Bear, Glass Snake), Jagged Knife Bandits (Hexer, Kneebreaker, Lackey, Lieutenant, Shadow, Sniper)',
    features: [
      {
        name: 'Dangerous Crossing',
        type: 'passive',
        description:
          'Crossing the river requires the party to complete a Progress Countdown (4). A PC who rolls a failure with Fear is immediately targeted by the "Undertow" action without requiring a Fear to be spent on the feature.',
        flavor:
          'Have any of the PCs forded rivers like this before? Are any of them afraid of drowning?',
      },
      {
        name: 'Undertow',
        type: 'action',
        description:
          'Spend a Fear to catch a PC in the undertow. They must make an Agility Reaction Roll. On a failure, they take 1d6+1 physical damage and are moved a Close distance down the river, becoming Vulnerable until they get out of the river. On a success, they must mark a Stress.',
        flavor:
          'What trinkets and baubles lie along the bottom of the riverbed? Do predators swim these rivers?',
      },
      {
        name: 'Patient Hunter',
        type: 'action',
        description:
          'Spend a Fear to summon a Glass Snake within Close range of a chosen PC. The Snake appears in or near the river and immediately takes the spotlight to use their "Spinning Serpent" action.',
        flavor:
          'What treasures does the beast have in their burrow? What travelers have already fallen victim to this predator?',
      },
    ],
  },
  {
    name: 'Cult Ritual',
    tier: 2,
    subtype: 'Event',
    description:
      'A Fallen cult assembles around a sigil of the defeated gods and a bonfire that burns a sickly shade of green.',
    subDescription:
      'Profane the land, unite the Mortal Realm with the Circles Below',
    difficulty: '14',
    potential:
      'Cult of the Fallen (Cult Adept, Cult Fang, Cult Initiate, Secret-Keeper)',
    features: [
      {
        name: 'Desecrated Ground',
        type: 'passive',
        description:
          "Cultists dedicated this place to the Fallen Gods, and their foul influence seeps into it. Reduce the PCs' Hope Die to a d10 while in this environment. The desecration can be removed with a Progress Countdown (6).",
        flavor:
          'How do the PCs first notice that something is wrong about this place? What fears resurface while hope is kept at bay?',
      },
      {
        name: 'Blasphemous Might',
        type: 'action',
        description:
          "A portion of the ritual's power is diverted into a cult member to fight off interlopers. Choose one adversary to become Imbued with terrible magic until the scene ends or they're defeated. An Imbued adversary immediately takes the spotlight and gains one of the following benefits, or all three if you spend a Fear:",
        extra: `
        <ul class="list-outside list-disc pl-4">
        <li>They gain advantage on all attacks.</li>
        <li>They deal an extra 1d10 damage on a successful attack.</li>
        <li>They gain the following feature: Relentless (2) - Passive: This adversary can be spotlighted up to two times per GM turn. Spend Fear as usual to spotlight them.</li>
        </ul>
        `,
        flavor:
          'How does the enemy change in appearance? What fears do their blows bring to the surface?',
      },
      {
        name: 'The Summoning',
        type: 'reaction',
        description:
          "When the PCs enter the scene or the cult begins the ritual to summon a demon, activate the countdown. Designate one adversary to lead the ritual. The countdown ticks down when a PC rolls with Fear. When it triggers, summon a Minor Demon within Very Close range of the ritual's leader. If the leader is defeated, the countdown ends with no effect as the ritual fails.",
        flavor:
          'What will the cult do with this leashed demon if they succeed? What will they try to summon next?',
      },
      {
        name: 'Complete the Ritual',
        type: 'reaction',
        description:
          "If the ritual's leader is targeted by an attack or spell, an ally within Very Close range of them can mark a Stress to be targeted by that attack or spell instead.",
        flavor:
          'What does it feel like to see such devotion turned to the pursuit of fear and domination?',
      },
    ],
  },
  {
    name: 'Hallowed Temple',
    tier: 2,
    subtype: 'Social',
    description:
      'A bustling but well-kept temple that provides healing and hosts regular services, overseen by a priest or seraph.',
    subDescription:
      'Connect the Mortal Realm with the Hallows Above, display the power of the divine, provide aid and succor to the faithful',
    difficulty: '13',
    potential: 'Guards (Archer Guard, Bladed Guard, Head Guard)',
    features: [
      {
        name: 'A Place of Healing',
        type: 'passive',
        description:
          'A PC who takes a rest in the Hallowed Temple automatically clears all HP.',
        flavor:
          'What does the incense smell like? What kinds of songs do the acolytes sing?',
      },
      {
        name: 'Divine Guidance',
        type: 'passive',
        description:
          "A PC who prays to a deity while in the Hallowed Temple can make an Instinct Roll to receive answers. If the god they beseech isn't welcome in this temple, the roll is made with disadvantage.",
        extra: `
        <ul class="list-outside list-disc pl-4">
        <li>Critical Success: The PC gains clear information. Additionally, they gain 1d4 Hope, which can be distributed between the party if they share the vision and guidance they received.</li>
        <li>Success with Hope: The PC receives clear information.</li>
        <li>Success with Fear: The PC receives brief flashes of insight and an emotional impression conveying an answer.</li>
        <li>Any Failure: The PC receives only vague flashes. They can mark a Stress to receive one clear image without context.</li>
        </ul>
        `,
        flavor:
          'What does it feel like as you are touched by this vision? What feeling lingers after the images have passed?',
      },
      {
        name: 'Relentless Hope',
        type: 'reaction',
        description:
          'Once per scene, each PC can mark a Stress to turn a result with Fear into a result with Hope.',
        flavor:
          'What emotions or memories do you connect with when fear presses in?',
      },
      {
        name: 'Divine Censure',
        type: 'reaction',
        description:
          'When the PCs have trespassed, blasphemed, or off ended the clergy, you can spend a Fear to summon a High Seraph and 1d4 Bladed Guards within Close range of the senior priest to reinforce their will.',
        flavor:
          'What symbols or icons do they bear that signal they are anointed agents of the divinity? Who leads the group and what led them to this calling?',
      },
    ],
  },
  {
    name: 'Haunted City',
    tier: 2,
    subtype: 'Exploration',
    description:
      'An abandoned city populated by the restless spirits of eras past.',
    subDescription:
      'Misdirect and disorient, replay apocalypses both public and personal',
    difficulty: '14',
    potential:
      'Ghosts (Spectral Archer, Spectral Captain, Spectral Guardian), ghostly versions of other adversaries (see "Ghostly Form")',
    features: [
      {
        name: 'Buried Knowledge',
        type: 'passive',
        description:
          'The city has countless mysteries to unfold. A PC who seeks knowledge about the fallen city can make an Instinct or Knowledge Roll to learn about this place and discover (potentially haunted) loot.',
        extra: `
        <ul class="list-outside list-disc pl-4">
        <li>Critical Success: Gain valuable information and a related useful item.</li>
        <li>Success with Hope: Gain valuable information.</li>
        <li>Success with Fear: Uncover vague or incomplete information.</li>
        <li>Any Failure: Mark a Stress to find a lead after an exhaustive search.</li>
        </ul>
        `,
        flavor:
          'What greater secrets does the city contain? Why have so many ghosts lingered here? What doomed adventurers have met a bad fate here already?',
      },
      {
        name: 'Ghostly Form',
        type: 'passive',
        description:
          'Adversaries who appear here are of a ghostly form. They have resistance to physical damage and can mark a Stress to move up to Close range through solid objects.',
        flavor:
          'What injuries to their physical form speak to their cause of death? What unfulfilled purpose holds them in the Mortal Plane?',
      },
      {
        name: 'Dead Ends',
        type: 'action',
        description:
          'The ghosts of an earlier era manifest scenes from their bygone era, such as a street festival, a revolution, or a heist. These hauntings change the layout of the city around the PCs, blocking the way behind them, forcing a detour, or presenting them with a challenge, such as mistaking them for rival thieves during the heist.',
        flavor: 'What do the ghosts want from you? What do you need from them?',
      },
      {
        name: 'Apocalypse Then',
        type: 'action',
        description:
          'Spend a Fear to manifest the echo of a past disaster that ravaged the city. Activate a Progress Countdown (5) as the disaster replays around the PCs. To complete the countdown and escape the catastrophe, the PCs must overcome threats such as rampaging fires, stampeding civilians, collapsing buildings, or crumbling streets, while recalling history and finding clues to escape the inevitable.',
        flavor:
          'Is this the disaster that led the city to be abandoned? What is known about this disaster, and how could that help the PCs escape?',
      },
    ],
  },
  {
    name: 'Mountain Pass',
    tier: 2,
    subtype: 'Traversal',
    description:
      'Stony peaks that pierce the clouds, with a twisting path winding its way up and over through many switchbacks.',
    subDescription:
      'Exact a chilling toll in supplies and stamina, reveal magical tampering, slow down travel',
    difficulty: '15',
    potential:
      'Beasts (Bear, Giant Eagle, Glass Snake), Chaos Skull, Minotaur Wrecker, Mortal Hunter',
    features: [
      {
        name: 'Engraved Sigils',
        type: 'passive',
        description:
          'Large markings and engravings have been made in the mountainside. A PC with a relevant background or Experience identifies them as weather magic increasing the power of the icy winds. A PC who succeeds on a Knowledge Roll can recall information about the sigils, potential information about their creators, and the knowledge of how to dispel them. If a PC critically succeeds, they recognize that the sigils are of a style created by ridgeborne enchanters and they gain advantage on a roll to dispel the sigils.',
        flavor:
          'Who laid this enchantment? Are they nearby? Why did they want the weather to be more daunting?',
      },
      {
        name: 'Avalanche',
        type: 'action',
        description:
          'Spend a Fear to carve the mountain with an icy torrent, causing an avalanche. All PCs in its path must succeed on an Agility or Strength Reaction Roll or be bowled over and carried down the mountain. A PC using rope, pitons, or other climbing gear gains advantage on this roll. Targets who fail are knocked down the mountain to Far range, take 2d20 physical damage, and must mark a Stress. Targets who succeed must mark a Stress.',
        flavor:
          'How do the PCs try to weather the avalanche? What approach do the characters take to find one another when their companions go hurtling down the mountainside?',
      },
      {
        name: 'Raptor Nest',
        type: 'reaction',
        description:
          "When the PCs enter the raptors' hunting grounds, two Giant Eagles appear at Very Far range of a chosen PC, identifying the PCs as likely prey.",
        flavor:
          'How long has it been since the eagles last found prey? Do they have eggs in their nest, or unfledged young?',
      },
      {
        name: 'Icy Winds',
        type: 'reaction',
        description:
          'When the PCs enter the mountain pass, activate the countdown. When it triggers, all characters traveling through the pass must succeed on a Strength Reaction Roll or mark a Stress. A PC wearing clothes appropriate for extreme cold gains advantage on these rolls.',
        flavor:
          "What parts of the PC's bodies go numb first? How do they try to keep warm as they press forward?",
      },
    ],
  },
  {
    name: 'Burning Heart of the Woods',
    tier: 3,
    subtype: 'Exploration',
    description:
      'Thick indigo ash fills the air around a towering moss-covered tree that burns eternally with flames a sickly shade of blue.',
    subDescription:
      'Beat out an uncanny rhythm for all to follow, corrupt the woods',
    difficulty: '16',
    potential:
      'Beasts (Bear, Glass Snake), Elementals (Elemental Spark), Verdant Defenders (Dryad, Oak Treant, Stag Knight)',
    features: [
      {
        name: 'Chaos Magic Locus',
        type: 'passive',
        description:
          'When a PC makes a Spellcast Roll, they must roll two Fear Dice and take the higher result.',
        flavor:
          'What does it feel like to work magic in this chaos-touched place? What do you fear will happen if you lose control of the spell?',
      },
      {
        name: 'The Indigo Flame',
        type: 'passive',
        description:
          'PCs who approach the central tree can make a Knowledge Roll to try to identify the magic that consumed this environment.',
        extra: `
        <ul class="list-outside list-disc pl-4">
        <li>On a success: They learn three of the below details. On a success with Fear, they learn two.</li>
        <li>On a failure: They can mark a Stress to learn one and gain advantage on the next action roll to investigate this environment.</li>
        <li>Details: This is a result of Fallen magic. The corruption is spread through the ashen moss. It can be cleansed only by a ritual of nature magic with a Progress Countdown (8).</li>
        </ul>
        `,
        flavor:
          'What Fallen cult corrupted these woods? What have they already done with the cursed wood and sap from this tree?',
      },
      {
        name: 'Grasping Vines',
        type: 'action',
        description:
          'Animate vines bristling with thorns whip out from the underbrush to ensnare the PCs. A target must succeed on an Agility Reaction Roll or become Restrained and Vulnerable until they break free, clearing both conditions, with a successful Finesse or Strength Roll or by dealing 10 damage to the vines. When the target makes a roll to escape, they take 1d8+4 physical damage and lose a Hope.',
        flavor:
          'What painful memories do the vines bring to the surface as they pierce flesh?',
      },
      {
        name: 'Charcoal Constructs',
        type: 'action',
        description:
          'Warped animals wreathed in indigo flame trample through a point of your choice. All targets within Close range of that point must make an Agility Reaction Roll. Targets who fail take 3d12+3 physical damage. Targets who succeed take half damage instead.',
        flavor:
          'Are these real animals consumed by the flame or merely constructs of the corrupting magic?',
      },
      {
        name: 'Choking Ash',
        type: 'reaction',
        description:
          'When the PCs enter the Burning Heart of the Woods, activate the countdown. When it triggers, all characters must make a Strength or Instinct Reaction Roll. Targets who fail take 4d6+5 direct physical damage. Targets who succeed take half damage. Protective masks or clothes give advantage on the reaction roll.',
        flavor:
          'What hallucinations does the ash induce? What incongruous taste does it possess?',
      },
    ],
  },
  {
    name: 'Castle Siege',
    tier: 3,
    subtype: 'Event',
    description:
      'An active siege with an attacking force fighting to gain entry to a fortified castle.',
    subDescription:
      'Bleed out the will to fight, breach the walls, build tension',
    difficulty: '17',
    potential:
      'Mercenaries (Harrier, Sellsword, Spellblade, Weaponmaster), Noble Forces (Archer Squadron, Conscript, Elite Soldier, Knight of the Realm)',
    features: [
      {
        name: 'Secret Entrance',
        type: 'passive',
        description:
          'A PC can find or recall a secret way into the castle with a successful Instinct or Knowledge Roll.',
        flavor:
          'How do they get in without revealing the pathway to the attackers? Are any of the defenders monitoring this path?',
      },
      {
        name: 'Siege Weapons (Environment Change)',
        type: 'action',
        description:
          "Consequence Countdown (6). The attacking force deploys siege weapons to try to raze the defenders' fortifications. Activate the countdown when the siege begins (for a protracted siege, make this a long-term countdown instead). When it triggers, the defenders' fortifications have been breached and the attackers flood inside. You gain 2 Fear, then shift to the Pitched Battle environment and spotlight it.",
        flavor:
          'What siege weapons are being deployed? Are they magical, mundane, or a mixture of both? What defenses must the characters overcome to storm the castle?',
      },
      {
        name: 'Reinforcements!',
        type: 'action',
        description:
          'Summon a Knight of the Realm, a number of Tier 3 Minions equal to the number of PCs, and two adversaries of your choice within Far range of a chosen PC as reinforcements. The Knight of the Realm immediately takes the spotlight.',
        flavor: 'Who are they targeting first? What formation do they take?',
      },
      {
        name: 'Collateral Damage',
        type: 'reaction',
        description:
          'When an adversary is defeated, you can spend a Fear to have a stray attack from a siege weapon hit a point on the battlefield. All targets within Very Close range of that point must make an Agility Reaction Roll.',
        extra: `
        <ul class="list-outside list-disc pl-4">
        <li>Targets who fail take 3d8+3 physical or magic damage and must mark a Stress.</li>
        <li>Targets who succeed must mark a Stress.</li>
        </ul>
        `,
        flavor:
          "What debris is scattered by the attack? What is broken by the strike that can't be easily mended?",
      },
    ],
  },
  {
    name: 'Pitched Battle',
    tier: 3,
    subtype: 'Event',
    description:
      'A massive combat between two large groups of armed combatants.',
    subDescription:
      'Seize people, land, and wealth, spill blood for greed and glory',
    difficulty: '17',
    potential:
      'Mercenaries (Sellsword, Harrier, Spellblade, Weaponmaster), Noble Forces (Archer Squadron, Conscript, Elite Soldier, Knight of the Realm)',
    features: [
      {
        name: 'Adrift on a Sea of Steel',
        type: 'passive',
        description:
          'Traversing a battlefield during an active combat is extremely dangerous. A PC must succeed on an Agility Roll to move at all, and can only go up to Close range on a success. If an adversary is within Melee range of them, they must mark a Stress to make an Agility Roll to move.',
        flavor:
          'Do the combatants mistake you for the enemy or consider you interlopers? Can you tell the difference between friend and foe in the fray?',
      },
      {
        name: 'Raze and Pillage',
        type: 'action',
        description:
          'The attacking force raises the stakes by lighting a fire, stealing a valuable asset, kidnapping an important person, or killing the populace.',
        flavor: 'What is valuable here? Who is most vulnerable?',
      },
      {
        name: 'War Magic',
        type: 'action',
        description:
          'Spend a Fear as a mage from one side uses large-scale destructive magic. Pick a point on the battlefield within Very Far range of the mage. All targets within Close range of that point must make an Agility Reaction Roll. Targets who fail take 3d12+8 magic damage and must mark a Stress.',
        flavor:
          'What form does the attack take—fireball, raining acid, a storm of blades? What tactical objective is this attack meant to accomplish, and what comes next?',
      },
      {
        name: 'Reinforcements!',
        type: 'action',
        description:
          'Summon a Knight of the Realm, a number of Tier 3 Minions equal to the number of PCs, and two adversaries of your choice within Far range of a chosen PC as reinforcements. The Knight of the Realm immediately takes the spotlight.',
        flavor: 'Who are they targeting first? What formation do they take?',
      },
    ],
  },
  {
    name: 'Chaos Realm',
    tier: 4,
    subtype: 'Traversal',
    description:
      'An otherworldly space where the laws of reality are unstable and dangerous.',
    subDescription: 'Annihilate certainty, consume power, defy logic',
    difficulty: '20',
    potential: 'Outer Realms Monstrosities (Abomination, Corruptor, Thrall)',
    features: [
      {
        name: 'Impossible Architecture',
        type: 'passive',
        description:
          "Up is down, down is right, right is starward. Gravity and directionality themselves are in flux, and any attempt to move through this realm is an odyssey unto itself, requiring a Progress Countdown (8). On a failure, a PC must mark a Stress in addition to the roll's other consequences.",
        flavor:
          'What does it feel like to move in a space so alien to the Mortal Realm? What landmark or point do you fixate on to maintain your balance? What bizarre landmarks do you traverse on your journey?',
      },
      {
        name: 'Everything You Are This Place Will Take from You',
        type: 'action',
        description:
          'Activate the countdown. When it triggers, all PCs must succeed on a Presence Reaction Roll or their highest trait is temporarily reduced by 1d4 unless they mark a number of Stress equal to its value. Any lost trait points are regained if the PC critically succeeds or escapes the Chaos Realm.',
        flavor:
          'How does this place try to steal from you that which makes you legendary? What does it feel like to have this power taken from you?',
      },
      {
        name: 'Unmaking',
        type: 'action',
        description:
          'Spend a Fear to force a PC to make a Strength Reaction Roll. On a failure, they take 4d10 direct magic damage. On a success, they must mark a Stress.',
        flavor:
          'What glimpse of other worlds do you catch while this place tries to unmake you? What core facet of your personality does the unmaking try to erase?',
      },
      {
        name: 'Outer Realms Predators',
        type: 'action',
        description:
          "Spend a Fear to summon an Outer Realms Abomination, an Outer Realms Corruptor, and 2d6 Outer Realms Thralls, who appear at Close range of a chosen PC in defiance of logic and causality. Immediately spotlight one of these adversaries, and you can spend an additional Fear to automatically succeed on that adversary's standard attack.",
        flavor:
          'What half-consumed remnants of the shattered world do these monstrosities cast aside in pursuit of living flesh? What jagged reflections of former personhood do you catch between moments of unquestioning malice?',
      },
      {
        name: 'Disorienting Reality',
        type: 'reaction',
        description:
          "On a result with Fear, you can ask the PC to describe which of their fears the Chaos Realm evokes as a vision of reality unmakes and reconstitutes itself to the PC. The PC loses a Hope. If it is their last Hope, you gain a Fear. What moment do they see? If it's a memory, how is it warped by this place? How hard will it be to hold on to the real memory?",
        flavor:
          'What moment do they see? How hard will it be to hold on to the real memory?',
      },
    ],
  },
  {
    name: 'Divine Usurpation',
    tier: 4,
    subtype: 'Event',
    description:
      'A massive ritual designed to breach the gates of the Hallows Above and unseat the New Gods themselves.',
    subDescription: 'Collect power, overawe, silence dissent',
    difficulty: '20',
    potential:
      'Arch-Necromancer, Fallen Shock Troops, Mortal Hunter, Oracle of Doom, Perfected Zombie',
    features: [
      {
        name: 'Final Preparations',
        type: 'passive',
        description:
          'When the environment first takes the spotlight, designate one adversary as the Usurper seeking to overthrow the gods. Activate a Long-Term Countdown (8) as the Usurper assembles what they need to conduct the ritual. When it triggers, spotlight this environment to use the "Beginning of the End" feature. While this environment remains in play, you can hold up to 15 Fear.',
        flavor:
          'What does the Usurper still require: The heart of a High Seraph? The lodestone of an ancient waygate? The loyalty of two archenemies? The heartbroken tears of a pure soul?',
      },
      {
        name: 'Divine Blessing',
        type: 'passive',
        description:
          'When a PC critically succeeds, they can spend 2 Hope to refresh an ability normally limited by uses (such as once per rest, once per session).',
        flavor:
          'What god favors you as you fight against this usurpation? How does your renewed power reflect their influence?',
      },
      {
        name: 'Defilers Abound',
        type: 'action',
        description:
          'Spend 2 Fear to summon 1d4+2 Fallen Shock Troops that appear within Close range of the Usurper to assist their divine siege. Immediately spotlight the Shock Troops to use a "Group Attack" action.',
        flavor:
          "Which High Fallen do these troops serve? Which god's flesh do they wish to feast upon?",
      },
      {
        name: 'Godslayer',
        type: 'action',
        description:
          'If the Divine Siege Countdown (see "Beginning of the End") has triggered, you can spend 3 Fear to describe the Usurper slaying one of the gods of the Hallows Above, feasting upon their power and growing stronger. The Usurper clears 2 HP. Increase their Difficulty, damage, attack modifier, or give them a new feature from the slain god.',
        flavor:
          "Which god meets their end? What are their last words? How does the Usurper's new stolen power manifest?",
      },
      {
        name: 'Beginning of the End',
        type: 'reaction',
        description:
          'When the "Final Preparations" long-term countdown triggers, the Usurper begins hammering on the gates of the Hallows themselves. Activate a Divine Siege Countdown (10). Spotlight the Usurper to describe the Usurper\'s assault and tick down this countdown by 1. If the Usurper takes Major or greater damage, tick up the countdown by 1. When it triggers, the Usurper shatters the barrier between the Mortal Realm and the Hallows Above to slay the gods and take their place. You gain a Fear for each unmarked HP the Usurper has. You can immediately use the "Godslayer" feature without spending Fear to make an additional GM move.',
        flavor:
          'How does the Mortal Realm writhe as the natural order is violated? What mortals witness this blasphemy from afar?',
      },
      {
        name: 'Ritual Nexus',
        type: 'reaction',
        description:
          'On any failure with Fear against the Usurper, the PC must mark 1d4 Stress from the backlash of magical power.',
        flavor:
          'What visions of failures past torment you as your eff orts fall short? How are these memories twisted by the Usurper?',
      },
    ],
  },
  {
    name: 'Imperial Court',
    tier: 4,
    subtype: 'Social',
    description:
      'The majestic domain of a powerful empire, lavishly appointed with stolen treasures.',
    subDescription:
      'Justify and perpetuate imperial rule, seduce rivals with promises of power and comfort',
    difficulty: '20',
    potential: 'Bladed Guard, Courtesan, Knight of the Realm, Monarch, Spy',
    features: [
      {
        name: 'All Roads Lead Here',
        type: 'passive',
        description:
          "While in the Imperial Court, a PC has disadvantage on Presence Rolls made to take actions that don't fit the imperial way of life or support the empire's dominance.",
        flavor:
          'How does the way language is used make even discussing alternative ways of living difficult? What obvious benefits for loyalty create friction when you try to discuss alternatives?',
      },
      {
        name: 'Rival Vassals',
        type: 'passive',
        description:
          "The PCs can find imperial subjects, vassals, and supplicants in the court, each vying for favor, seeking proximity to power, exchanging favors for loyalty, and elevating their status above others'. Some might be desperate to undermine their rivals, while others might even be open to discussions that verge on sedition.",
        flavor:
          'How do they benefit from vassalage, and what has it cost them? What exploitation drives them to consider opposing the unstoppable?',
      },
      {
        name: 'The Gravity of Empire',
        type: 'action',
        description:
          "Spend a Fear to present a PC with a golden opportunity or offer to satisfy a major goal in exchange for obeying or supporting the empire. The target must make a Presence Reaction Roll. On a failure, they must mark all their Stress or accept the offer. If they have already marked all their Stress, they must accept the offer or exile themselves from the empire. On a success, they must mark 1d4 Stress as they're taxed by temptation.",
        flavor:
          "What do the PCs want so desperately they might consider throwing in with this ruthless power? How did imperial agents learn the PC's greatest desires?",
      },
      {
        name: 'Imperial Decree',
        type: 'action',
        description:
          "Spend a Fear to tick down a long-term countdown related to the empire's agenda by 1d4. If this triggers the countdown, a proclamation related to the agenda is announced at court as the plan is executed.",
        flavor:
          'What display of power or transfer of wealth was needed to expedite this plan? Whose lives were disrupted or upended to make this happen?',
      },
      {
        name: 'Eyes Everywhere',
        type: 'reaction',
        description:
          'On a result with Fear, you can spend a Fear to have someone loyal to the empire overhear seditious talk within the court. A PC must succeed on an Instinct Reaction Roll to notice that the group has been overheard so they can try to intercept the witness before the PCs are exposed.',
        flavor:
          "How has the empire compromised this witness? Why is their first impulse to protect the empire, even if doesn't treat them well?",
      },
    ],
  },
  {
    name: "Necromancer's Ossuary",
    tier: 4,
    subtype: 'Exploration',
    description:
      'A dusty crypt with a library, twisting corridors, and abundant sarcophagi, spattered with the blood of ill-fated invaders.',
    subDescription:
      'Confound intruders, delve into secrets best left buried, manifest unlife, unleash a tide of undead',
    difficulty: '19',
    potential: "Arch-Necromancer's Host (Perfected Zombie, Zombie Legion)",
    features: [
      {
        name: 'No Place for the Living',
        type: 'passive',
        description:
          'A feature or action that clears HP requires spending a Hope to use. If it already costs Hope, a PC must spend an additional Hope.',
        flavor:
          'What does it feel like to try to heal in a place so antithetical to life?',
      },
      {
        name: 'Centuries of Knowledge',
        type: 'passive',
        description:
          "A PC can investigate the library and laboratory and make a Knowledge Roll to learn information related to arcana, local history, and the Necromancer's plans.",
        flavor:
          'What are the names of the tomes? What project is the necromancer working on and what does it communicate about their plans?',
      },
      {
        name: 'Skeletal Burst',
        type: 'action',
        description:
          'All targets within Close range of a point you choose in this environment must succeed on an Agility Reaction Roll or take 4d8+8 physical damage from skeletal shrapnel as part of the ossuary detonates around them.',
        flavor:
          'What ancient skeletal architecture is destroyed? What bones stick in your armor?',
      },
      {
        name: 'Aura of Death',
        type: 'action',
        description:
          'Once per scene, roll a d4. Each undead within Far range of the Necromancer can clear HP and Stress equal to the result rolled. The undead can choose how that number is divided between HP and Stress.',
        flavor:
          'How does their renewed vigor manifest? Do they look more lifelike or, paradoxically, are they more decayed but vigorous?',
      },
      {
        name: 'They Just Keep Coming!',
        type: 'action',
        description:
          'Spend a Fear to summon 1d6 Rotted Zombies, two Perfected Zombies, or a Zombie Legion, who appear at Close range of a chosen PC.',
        flavor:
          "Who were these people before they became the necromancer's pawns? What vestiges of those lives remain for the heroes to see?",
      },
    ],
  },
];

export const environments: AdversaryDetails[] = preEnvironments.map(
  (environment) => ({
    ...environment,
    type: 'environment',
    text: `${environment.features
      .map(
        (feat) =>
          `<p><strong><em>${capitalize(feat.name)} - ${capitalize(feat.type)}: </em></strong> ${feat.description}</p>
      ${feat.extra ? feat.extra : ''}
      ${feat.flavor ? `<p><em>${feat.flavor}</em></p>` : ''}`,
      )
      .join('')}`,
  }),
);
