import type { ClassReference } from '../types';

export const classes: ClassReference[] = [
  {
    name: 'bard',
    flavor:
      'Bards are the most charismatic people in all the realms. Members of this class are masters of captivation and specialize in a variety of performance types, including singing, playing musical instruments, weaving tales, or telling jokes. Whether performing for an audience or speaking to an individual, bards thrive in social situations. Members of this profession bond and train at schools or guilds, but a current of egotism runs through those of the bardic persuasion. While they may be the most likely class to bring people together, a bard of ill temper can just as easily tear a party apart.',
    domains: ['grace', 'codex'],
    startEvasion: 10,
    startHp: 5,
    items: 'A romance novel or a letter never opened',
    features: [
      {
        name: 'Make a Scene',
        description:
          'Spend 3 Hope to temporarily Distract a target within Close range, giving them a -2 penalty to their Difficulty.',
      },
      {
        name: 'Rally',
        description:
          'Once per session, describe how you rally the party and give yourself and each of your allies a Rally Die. At level 1, your Rally Die is a d6. A PC can spend their Rally Die to roll it, adding the result to their action roll, reaction roll, damage roll, or to clear a number of Stress equal to the result. At the end of each session, clear all unspent Rally Dice. At level 5, your Rally Die increases to a d8.',
      },
    ],
    questions: [
      'Who from your community taught you to have such confidence in yourself?',
      'You were in love once. Who did you adore, and how did they hurt you?',
      "You've always looked up to another bard. Who are they, and why do you idolize them?",
    ],
    connections: [
      'What made you realize we were going to be such good friends?',
      'What do I do that annoys you?',
      'Why do you grab my hand at night?',
    ],
    subclasses: ['Troubadour', 'Wordsmith'],
  },
  {
    name: 'druid',
    flavor:
      "Becoming a druid is more than an occupation; it's a calling for those who wish to learn from and protect the magic of the wilderness. While one might underestimate a gentle druid who practices the often-quiet work of cultivating flora, druids who channel the untamed forces of nature are terrifying to behold. Druids cultivate their abilities in small groups, often connected by a specific ethos or locale, but some choose to work alone. Through years of study and dedication, druids can learn to transform into beasts and shape nature itself.",
    domains: ['sage', 'arcana'],
    startEvasion: 10,
    startHp: 6,
    items:
      'A small bag of rocks and bones or a strange pendant found in the dirt',
    features: [
      {
        name: 'Evolution',
        description:
          'Spend 3 Hope to transform into a Beastform without marking a Stress. When you do, choose one trait to raise by +1 until you drop out of that Beastform.',
      },
      {
        name: 'Beastform',
        description:
          "Mark a Stress to magically transform into a creature of your tier or lower from the Beastform list. You can drop out of this form at any time. While transformed, you can't use weapons or cast spells from domain cards, but you can still use other features or abilities you have access to. Spells you cast before you transform stay active and last for their normal duration, and you can talk and communicate as normal. Additionally, you gain the Beastform's features, add their Evasion bonus to your Evasion, and use the trait specified in their statistics for your attack. While you're in a Beastform, your armor becomes part of your body and you mark Armor Slots as usual; when you drop out of a Beastform, those marked Armor Slots remain marked. If you mark your last Hit Point, you automatically drop out of this form.",
      },
      {
        name: 'Wildtouch',
        description:
          'You can perform harmless, subtle effects that involve nature—such as causing a flower to rapidly grow, summoning a slight gust of wind, or starting a campfire at will.',
      },
    ],
    questions: [
      'Why was the community you grew up in so reliant on nature and its creatures?',
      'Who was the first wild animal you bonded with? Why did your bond end?',
      'Who has been trying to hunt you down? What do they want from you?',
    ],
    connections: [
      'What did you confide in me that makes me leap into danger for you every time?',
      'What animal do I say you remind me of?',
      'What affectionate nickname have you given me?',
    ],
    subclasses: ['Warden of the Elements', 'Warden of Renewal'],
  },
  {
    name: 'guardian',
    flavor:
      "The title of guardian represents an array of martial professions, speaking more to their moral compass and unshakeable fortitude than the means by which they fight. While many guardians join groups of militants for either a country or cause, they're more likely to follow those few they truly care for, majority be damned. Guardians are known for fighting with remarkable ferocity even against overwhelming odds, defending their cohort above all else. Woe betide those who harm the ally of a guardian, as the guardian will answer this injury in kind.",
    domains: ['valor', 'blade'],
    startEvasion: 9,
    startHp: 7,
    items: 'A totem from your mentor or a secret key',
    features: [
      {
        name: 'Frontline Tank',
        description: 'Spend 3 Hope to clear 2 Armor Slots.',
      },
      {
        name: 'Unstoppable',
        description:
          "Once per long rest, you can become Unstoppable. You gain an Unstoppable Die. At level 1, your Unstoppable Die is a d4. Place it on your character sheet in the space provided, starting with the 1 value facing up. After you make a damage roll that deals 1 or more Hit Points to a target, increase the Unstoppable Die value by one. When the die's value would exceed its maximum value or when the scene ends, remove the die and drop out of Unstoppable. At level 5, your Unstoppable Die increases to a d6. While Unstoppable, you gain the following benefits:",
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>You reduce the severity of physical damage by one threshold (Severe to Major, Major to Minor, Minor to None).</li>
        <li>You add the current value of the Unstoppable Die to your damage roll.</li>
        <li>You can't be Restrained or Vulnerable.</li>
        </ul>
        `,
      },
    ],
    questions: [
      'Who from your community did you fail to protect, and why do you still think of them?',
      "You've been tasked with protecting something important and delivering it somewhere dangerous. What is it, and where does it need to go?",
      'You consider an aspect of yourself to be a weakness. What is it, and how has it affected you?',
    ],
    connections: [
      'How did I save your life the first time we met?',
      'What small gift did you give me that you notice I always carry with me?',
      'What lie have you told me about yourself that I absolutely believe?',
    ],
    subclasses: ['Stalwart', 'Vengeance'],
  },
  {
    name: 'ranger',
    flavor:
      "Rangers are highly skilled hunters who, despite their martial abilities, rarely lend their skills to an army. Through mastery of the body and a deep understanding of the wilderness, rangers become sly tacticians, pursuing their quarry with cunning and patience. Many rangers track and fight alongside an animal companion with whom they've forged a powerful spiritual bond. By honing their skills in the wild, rangers become expert trackers, as likely to ensnare their foes in a trap as they are to assail them head-on.",
    domains: ['bone', 'sage'],
    startEvasion: 12,
    startHp: 6,
    items: 'A trophy from your first kill or a seemingly broken compass',
    features: [
      {
        name: 'Hold Them Off',
        description:
          'Spend 3 Hope when you succeed on an attack with a weapon to use that same roll against two additional adversaries within range of the attack.',
      },
      {
        name: "Ranger's Focus",
        description:
          "Spend a Hope and make an attack against a target. On a success, deal your attack's normal damage and temporarily make the attack's target your Focus. Until this feature ends or you make a different creature your Focus, you gain the following benefits against your Focus:",
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>You know precisely what direction they are in.</li>
        <li>When you deal damage to them, they must mark a Stress.</li>
        <li>When you fail an attack against them, you can end your Ranger's Focus feature to reroll your Duality Dice.</li>
        </ul>
        `,
      },
    ],
    questions: [
      "A terrible creature hurt your community, and you've vowed to hunt them down. What are they, and what unique trail or sign do they leave behind?",
      'Your first kill almost killed you, too. What was it, and what part of you was never the same after that event?',
      "You've traveled many dangerous lands, but what is the one place you refuse to go?",
    ],
    connections: [
      'What friendly competition do we have?',
      "Why do you act differently when we're alone than when others are around?",
      'What threat have you asked me to watch for, and why are you worried about it?',
    ],
    subclasses: ['Beastbound', 'Wayfinder'],
  },
  {
    name: 'rogue',
    flavor:
      "Rogues are scoundrels, often in both attitude and practice. Broadly known as liars and thieves, the best among this class move through the world anonymously. Utilizing their sharp wits and blades, rogues trick their foes through social manipulation as easily as breaking locks, climbing through windows, or dealing underhanded blows. These masters of magical craft manipulate shadow and movement, adding an array of useful and deadly tools to their repertoire. Rogues frequently establish guilds to meet future accomplices, hire out jobs, and hone secret skills, proving that there's honor among thieves for those who know where to look.",
    domains: ['midnight', 'grace'],
    startEvasion: 12,
    startHp: 6,
    items: 'A set of forgery tools or a grappling hook',
    features: [
      {
        name: "Rogue's Dodge",
        description:
          'Spend 3 Hope to gain a +2 bonus to your Evasion until the next time an attack succeeds against you. Otherwise, this bonus lasts until your next rest.',
      },
      {
        name: 'Cloaked',
        description:
          'Any time you would be Hidden, you are instead Cloaked. In addition to the benefits of the Hidden condition, while Cloaked you remain unseen if you are stationary when an adversary moves to where they would normally see you. After you make an attack or end a move within line of sight of an adversary, you are no longer Cloaked.',
      },
      {
        name: 'Sneak Attack',
        description:
          'When you succeed on an attack while Cloaked or while an ally is within Melee range of your target, add a number of d6s equal to your tier to your damage roll.',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>Level 1 → Tier 1</li>
        <li>Levels 2-4 → Tier 2</li>
        <li>Levels 5-7 → Tier 3</li>
        <li>Levels 8-10 → Tier 4</li>
        </ul>
        `,
      },
    ],
    questions: [
      'What did you get caught doing that got you exiled from your home community?',
      "You used to have a different life, but you've tried to leave it behind. Who from your past is still chasing you?",
      'Who from your past were you most sad to say goodbye to?',
    ],
    connections: [
      'What did I recently convince you to do that got us both in trouble?',
      'What have I discovered about your past that I hold secret from the others?',
      'Who do you know from my past, and how have they influenced your feelings about me?',
    ],
    subclasses: ['Nightwalker', 'Syndicate'],
  },
  {
    name: 'seraph',
    flavor:
      "Seraphs are divine fighters and healers imbued with sacred purpose. A wide array of deities exist within the realms, and thus numerous kinds of seraphs are appointed by these gods. Their ethos traditionally aligns with the domain or goals of their god, such as defending the weak, exacting vengeance, protecting a land or artifact, or upholding a particular faith. Some seraphs ally themselves with an army or locale, much to the satisfaction of their rulers, but other crusaders fight in opposition to the follies of the Mortal Realm. It is better to be a seraph's ally than their enemy, as they are terrifying foes to those who defy their purpose.",
    domains: ['splendor', 'valor'],
    startEvasion: 9,
    startHp: 7,
    items: 'A bundle of offerings or a sigil of your god',
    features: [
      {
        name: 'Life Support',
        description:
          'Spend 3 Hope to clear a Hit Point on an ally within Close range.',
      },
      {
        name: 'Prayer Dice',
        description:
          "At the beginning of each session, roll a number of d4s equal to your subclass's Spellcast trait and place them on your character sheet in the space provided. These are your Prayer Dice. You can spend any number of Prayer Dice to aid yourself or an ally within Far range. You can use a spent die's value to reduce incoming damage, add to a roll's result after the roll is made, or gain Hope equal to the result. At the end of each session, clear all unspent Prayer Dice.",
      },
    ],
    questions: [
      'Which god did you devote yourself to? What incredible feat did they perform for you in a moment of desperation?',
      'How did your appearance change after taking your oath?',
      'In what strange or unique way do you communicate with your god?',
    ],
    connections: [
      'What promise did you make me agree to, should you die on the battlefield?',
      'Why do you ask me so many questions about my god?',
      "You've told me to protect one member of our party above all others, even yourself. Who are they and why?",
    ],
    subclasses: ['Divine Wielder', 'Winged Sentinel'],
  },
  {
    name: 'sorcerer',
    flavor:
      "Not all innate magic users choose to hone their craft, but those who do can become powerful sorcerers. The gifts of these wielders are passed down through families, even if the family is unaware of or reluctant to practice them. A sorcerer's abilities can range from the elemental to the illusionary and beyond, and many practitioners band together into collectives based on their talents. The act of becoming a formidable sorcerer is not the practice of acquiring power, but learning to cultivate and control the power one already possesses. The magic of a misguided or undisciplined sorcerer is a dangerous force indeed.",
    domains: ['arcana', 'midnight'],
    startEvasion: 10,
    startHp: 6,
    items: 'A whispering orb or a family heirloom',
    features: [
      {
        name: 'Volatile Magic',
        description:
          'Spend 3 Hope to reroll any number of your damage dice on an attack that deals magic damage.',
      },
      {
        name: 'Arcane Sense',
        description:
          'You can sense the presence of magical people and objects within Close range.',
      },
      {
        name: 'Minor Illusion',
        description:
          'Make a Spellcast Roll (10). On a success, you create a minor visual illusion no larger than yourself within Close range. This illusion is convincing to anyone at Close range or farther.',
      },
      {
        name: 'Channel Raw Power',
        description:
          'Once per long rest, you can place a domain card from your loadout into your vault and choose to either:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>Gain Hope equal to the level of the card.</li>
        <li>Enhance a spell that deals damage, gaining a bonus to your damage roll equal to twice the level of the card.</li>
        </ul>
        `,
      },
    ],
    questions: [
      'What did you do that made the people in your community wary of you?',
      'What mentor taught you to control your untamed magic, and why are they no longer able to guide you?',
      'You have a deep fear you hide from everyone. What is it, and why does it scare you?',
    ],
    connections: [
      'Why do you trust me so deeply?',
      'What did I do that makes you cautious around me?',
      'Why do we keep our shared past a secret?',
    ],
    subclasses: ['Elemental Origin', 'Primal Origin'],
  },
  {
    name: 'warrior',
    flavor:
      'Becoming a warrior requires years, often a lifetime, of training and dedication to the mastery of weapons and violence. While many who seek to fight hone only their strength, warriors understand the importance of an agile body and mind, making them some of the most sought-after fighters across the realms. Frequently, warriors find employment within an army, a band of mercenaries, or even a royal guard, but their potential is wasted in any position where they cannot continue to improve and expand their skills. Warriors are known to have a favored weapon; to come between them and their blade would be a grievous mistake.',
    domains: ['blade', 'bone'],
    startEvasion: 11,
    startHp: 6,
    items: 'The drawing of a lover or a sharpening stone',
    features: [
      {
        name: 'No Mercy',
        description:
          'Spend 3 Hope to gain a +1 bonus to your attack rolls until your next rest.',
      },
      {
        name: 'Attack of Opportunity',
        description:
          'If an adversary within Melee range attempts to leave that range, make a reaction roll using a trait of your choice against their Difficulty. Choose one effect on a success, or two if you critically succeed:',
        extra: `
        <ul class="list-disc list-outside pl-4">
        <li>They can't move from where they are.</li>
        <li>You deal damage to them equal to your primary weapon's damage.</li>
        <li>You move with them.</li>
        </ul>
        `,
      },
      {
        name: 'Combat Training',
        description:
          'You ignore burden when equipping weapons. When you deal physical damage, you gain a bonus to your damage roll equal to your level.',
      },
    ],
    questions: [
      'Who taught you to fight, and why did they stay behind when you left home?',
      'Somebody defeated you in battle years ago and left you to die. Who was it, and how did they betray you?',
      'What legendary place have you always wanted to visit, and why is it so special?',
    ],
    connections: [
      'We knew each other long before this party came together. How?',
      'What mundane task do you usually help me with off the battlefield?',
      'What fear am I helping you overcome?',
    ],
    subclasses: ['Call of the Brave', 'Call of the Slayer'],
  },
  {
    name: 'wizard',
    flavor:
      'Whether through an institution or individual study, those known as wizards acquire and hone immense magical power over years of learning using a variety of tools, including books, stones, potions, and herbs. Some wizards dedicate their lives to mastering a particular school of magic, while others learn from a wide variety of disciplines. Many wizards become wise and powerful figures in their communities, advising rulers, providing medicines and healing, and even leading war councils. While these mages all work toward the common goal of collecting magical knowledge, wizards often have the most conflict within their own ranks, as the acquisition, keeping, and sharing of powerful secrets is a topic of intense debate that has resulted in innumerable deaths.',
    domains: ['codex', 'splendor'],
    startEvasion: 11,
    startHp: 5,
    items:
      "A book you're trying to translate or a tiny, harmless elemental pet",
    features: [
      {
        name: 'Not This Time',
        description:
          'Spend 3 Hope to force an adversary within Far range to reroll an attack or damage roll.',
      },
      {
        name: 'Prestidigitation',
        description:
          "You can perform harmless, subtle magical effects at will. For example, you can change an object's color, create a smell, light a candle, cause a tiny object to float, illuminate a room, or repair a small object.",
      },
      {
        name: 'Strange Patterns',
        description:
          'Choose a number between 1 and 12. When you roll that number on a Duality Die, gain a Hope or clear a Stress. You can change this number when you take a long rest.',
      },
    ],
    questions: [
      'What responsibilities did your community once count on you for? How did you let them down?',
      "You've spent your life searching for a book or object of great significance. What is it, and why is it so important to you?",
      'You have a powerful rival. Who are they, and why are you so determined to defeat them?',
    ],
    connections: [
      "What favor have I asked of you that you're not sure you can fulfill?",
      'What weird hobby or strange fascination do we both share?',
      'What secret about yourself have you entrusted only to me?',
    ],
    subclasses: ['School of Knowledge', 'School of War'],
  },
];
